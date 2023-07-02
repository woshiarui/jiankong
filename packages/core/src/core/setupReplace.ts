import { EVENT_TYPES } from "@rmonitor/common"
import { addReplaceHandler } from "./replace"
import { HandleEvents } from "./handlerEvents"

/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-06-04 18:38:39
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-02 19:55:17
 */
export function setupReplace(): void {
    addReplaceHandler({
        callback: data => {
            HandleEvents.handleHttp(data, EVENT_TYPES.XHR)
        },
        type: EVENT_TYPES.XHR
    })
}