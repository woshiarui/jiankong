/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-06-04 16:12:53
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-22 11:25:40
 */
import { _global, replaceAop, getTimeStamp, on, getLocationHref, throttle } from "@rmonitor/utils";
import { EVENT_TYPES, HTTPTYPE } from "@rmonitor/common";
import { ReplaceHandler, voidFun } from '@rmonitor/types'
import { notify, subscribeEvent } from "./subscribe";
import { isExistProperty } from "@rmonitor/utils/src/core/verifyType";

function replace(type: EVENT_TYPES) {
    switch (type) {
        case EVENT_TYPES.XHR:
            xhrReplace()
            break;
        case EVENT_TYPES.FETCH:
            fetchReplace()
            break;
        case EVENT_TYPES.HASH_CHANGE:
            listenHashChange()
            break;
        case EVENT_TYPES.HISTORY:
            historyReplace()
            break;
        case EVENT_TYPES.UNHANDLED_REJECTION:
            unhandledrejectionReplace()
            break;
        case EVENT_TYPES.CLICK:
            domReplace()
            break
        case EVENT_TYPES.RECORDSCREEN:
            whiteScreen()
            break
        case EVENT_TYPES.ERROR:
            listenError()
            break
        default:
            break;
    }
}

export function addReplaceHandler(handler: ReplaceHandler) {
    if (!subscribeEvent(handler)) return
    replace(handler.type)
}


/**
 * 重写xhr
 * @returns 
 */
function xhrReplace(): void {
    if (!('XMLHttpRequest' in _global)) {
        return
    }
    const originalXhrProto = XMLHttpRequest.prototype
    replaceAop(originalXhrProto, 'open', (originalOpen: voidFun) => {
        return function (this: any, ...args: any[]): void {
            this.rmonitor_xhr = {
                method: typeof args[0] === 'string' ? args[0].toUpperCase() : args[0],
                url: args[1],
                startTime: getTimeStamp(),
                type: HTTPTYPE.XHR,
            }
            originalOpen.apply(this, args)
        }
    })
    replaceAop(originalXhrProto, 'send', (originalSend: voidFun) => {
        return function (this: any, ...args: any[]): void {
            // const { method, url } = this.rmonitor_xhr
            //监听xhr的loadend事件,接口成功或者失败都会执行
            on(this, 'loadend', function (this: any) {
                //TODO: 判断是否需要执行
                const { responseType, response, status } = this
                this.rmonitor_xhr.requestData = args[0]
                const endTime = getTimeStamp()
                this.rmonitor_xhr.time = this.rmonitor_xhr.startTime
                this.rmonitor_xhr.Status = status //状态码
                if (['', 'json', 'text'].indexOf(responseType) !== -1) {
                    //TODO: 用户设置
                    this.rmonitor_xhr.response = response && JSON.parse(response)
                }
                this.rmonitor_xhr.elapsedTime = endTime - this.rmonitor_xhr.startTime
                //TODO: 执行回调
                notify(EVENT_TYPES.XHR, this.rmonitor_xhr)
                return
            })
            originalSend.apply(this, args)
        }
    })
}

/**
 * 重写fetch
 * @returns 
 */
function fetchReplace(): void {
    if (!('fetch' in _global)) return
    replaceAop(_global, EVENT_TYPES.FETCH, (originFetch) => {
        return function (url, config: Partial<Request> = {}) {
            const startTime = getTimeStamp()
            const method = (config && config.method) || 'GET'
            let fetchData = {
                type: HTTPTYPE.FETCH,
                method,
                requestData: config && config.body,
                url,
                response: '',
            }

            //headers
            const headers = new Headers(config.headers || {})
            // TODO: why？
            Object.assign(headers, {
                setRequestHeader: headers.set
            })
            config = Object.assign({}, config, headers)
            return originFetch.apply(_global, [url, config]).then((res) => {
                const tempRes = res.clone()
                const endTime = getTimeStamp()
                fetchData = Object.assign({}, fetchData, {
                    elapsedTime: endTime - startTime,
                    Status: tempRes.status,
                    time: startTime
                })
                //TODO: 设置data
                //text的方法是为了获取response对象中的主体内容
                tempRes.text().then((data) => {
                    notify(EVENT_TYPES.FETCH, fetchData)
                })
            }).catch((err) => {
                const endTime = getTimeStamp()
                fetchData = Object.assign({}, fetchData, {
                    elapsedTime: endTime - startTime,
                    Status: 0,
                    time: startTime
                })
                notify(EVENT_TYPES.FETCH, fetchData)
                throw err; //抛出错误，等着被捕获
            })
        }
    })
}

/**
 * 监听hash
 */
function listenHashChange() {
    if (isExistProperty(_global, 'onhashchange')) {
        on(_global, EVENT_TYPES.HASH_CHANGE, function (e: HashChangeEvent) {
            notify(EVENT_TYPES.HASH_CHANGE, e)
        })
    }
}

/**
 * 重写history
 */
let lastHref = getLocationHref()
function historyReplace() {
    //TODO: 是否支持history

    //onpopstate
    const oldOnpopstate = _global.onpopstate
    _global.onpopstate = function (this: any, ...args: any) {
        const to = getLocationHref()
        const from = lastHref
        lastHref = to;
        notify(EVENT_TYPES.HISTORY, {
            from,
            to
        })
        oldOnpopstate && oldOnpopstate.apply(this, args)
    }
    function historyReplaceFn(originalHistoryFn: voidFun) {
        return function (this: any, ...args: any[]) {
            const url = args.length > 2 ? args[2] : undefined
            if (url) {
                const from = lastHref
                const to = String(url)
                lastHref = to
                notify(EVENT_TYPES.HISTORY, {
                    from, to
                })
            }
            return originalHistoryFn.apply(this, args)
        }
    }
    // 重写核心事件 pushState、replaceState
    replaceAop(_global.history, 'pushState', historyReplaceFn)
    replaceAop(_global.history, 'replaceState', historyReplaceFn)
}

/**
 * 监听unhandledrejection
 */
function unhandledrejectionReplace() {
    on(_global, EVENT_TYPES.UNHANDLED_REJECTION, function (ev: PromiseRejectionEvent) {
        //TODO： 支持配置
        ev.preventDefault() //控制台不报错
        notify(EVENT_TYPES.UNHANDLED_REJECTION, ev)
    })
}

function domReplace() {
    if (!('document' in _global)) return
    //节流
    const clickThrottle = throttle(notify, 0.2)
    on(
        _global.document,
        'click',
        function (this) {
            clickThrottle(EVENT_TYPES.CLICK, {
                category: 'click',
                data: this,
            })
        }
        , true
    )
}

function listenError() {
    on(_global, 'error', function (e: ErrorEvent) {
        console.log(e)
        notify(EVENT_TYPES.ERROR, e)
    }, true)
}

function whiteScreen() {
    notify(EVENT_TYPES.WHITESCREEN)
}