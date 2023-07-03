import { _global, replaceAop, getTimeStamp, on } from "@rmonitor/utils";
import { EVENT_TYPES, HTTPTYPE } from "@rmonitor/common";
import { ReplaceHandler, voidFun } from '@rmonitor/types'
import { notify, subscribeEvent } from "./subscribe";

/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-06-04 16:12:53
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-03 23:52:49
 */

function replace(type: EVENT_TYPES) {
    switch (type) {
        case EVENT_TYPES.XHR:
            xhrReplace()
    }
}

export function addReplaceHandler(handler: ReplaceHandler) {
    if (!subscribeEvent(handler)) return
    replace(handler.type)
}


/**
 * 监听xhr
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
                tempRes.text().then(() => {
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