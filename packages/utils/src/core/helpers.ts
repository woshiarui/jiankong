/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-06-04 16:38:36
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-06-04 17:06:17
 */
import {AnyObject, Callback, } from "@rmonitor/types"
export function replaceAop(source: AnyObject,name:string,replacement: Callback,isForced = false) {
    if (source === undefined) return
    if (name in source || isForced) {
        const original = source[name]
        const wrapped = replacement(original)
        if (typeof wrapped === 'function') {
            source[name] = wrapped
        }
    }
}

export function getTimeStamp(): number {
    return Date.now()
}

export function on(target: any, eventName: string, handler: Callback, options = false) {
    target.addEventListener(eventName, handler, options)
}