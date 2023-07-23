/*
 * @Descripttion: 发布订阅模式的实现
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-06-04 17:52:10
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-02 20:51:54
 */
import { EVENT_TYPES } from "@rmonitor/common";
import { ReplaceCallback, ReplaceHandler } from "@rmonitor/types";
import { getFlag, setFlag, nativeTryCatch } from "@rmonitor/utils";

const handlers: { [key in EVENT_TYPES]?: ReplaceCallback[] } = {}

/**
 * 处理的方法放置到handlers中，{xhr: () => void}
 * @param handler 
 * @returns 
 */
export function subscribeEvent(handler: ReplaceHandler): boolean {
    if (!handler || getFlag(handler.type)) return false
    setFlag(handler.type, true)
    handlers[handler.type] = handlers[handler.type] || []
    handlers[handler.type]?.push(handler.callback)
    return true
}

/**
 * 通知对应事件类型的回调函数执行
 * @param type 
 * @param data 
 * @returns 
 */
export function notify(type: EVENT_TYPES, data?: any): void {
    if (!type || !handlers[type]) return
    handlers[type]?.forEach(callback => {
        nativeTryCatch(() => {
            callback(data)
        }, (err) => {
            console.log(err)
        })
    });
}