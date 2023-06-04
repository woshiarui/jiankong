import { _global,replaceAop,getTimeStamp, on } from "@rmonitor/utils";
import { EVENT_TYPES, HTTPTYPE } from "@rmonitor/common";
import {voidFun} from '@rmonitor/types'
import { notify } from "./subscribe";

/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-06-04 16:12:53
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-06-04 18:38:25
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
            originalOpen.apply(this,args)
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
                this.rmonitor_xhr.status = status
                if (['', 'json', 'text'].indexOf(responseType) !== -1) {
                    //TODO: 用户设置
                    this.rmonitor_xhr.response = response && JSON.parse(response)
                }
                this.rmonitor_xhr.elapsedTime = endTime - this.rmonitor_xhr.startTime
                //TODO: 执行回调
                notify(EVENT_TYPES.XHR,this.rmonitor_xhr)
                return
            })
            originalSend.apply(this,args)
        }
    })
}