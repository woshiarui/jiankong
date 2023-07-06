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
 * @LastEditTime: 2023-07-07 00:28:14
 */
export function setupReplace(): void {
    //重写xhr，绑定回调
    addReplaceHandler({
        callback: data => {
            HandleEvents.handleHttp(data, EVENT_TYPES.XHR)
        },
        type: EVENT_TYPES.XHR
    })

    //重写fetch，绑定回调
    addReplaceHandler({
        callback: data => {
            HandleEvents.handleHttp(data, EVENT_TYPES.FETCH)
        },
        type: EVENT_TYPES.FETCH
    })

    //重写history
    addReplaceHandler({
        callback: data => {
            HandleEvents.handleHistory(data)
        },
        type: EVENT_TYPES.HISTORY
    })

    //监听onhashchange
    addReplaceHandler({
        callback: data => {
            HandleEvents.handleHashChange(data)
        },
        type: EVENT_TYPES.HASH_CHANGE
    })
    //TODO: 待补充handle函数
    addReplaceHandler({
        callback: data => {
            // HandleEvents.handleUnhandledRejection(data)
        },
        type: EVENT_TYPES.HASH_CHANGE
    })

}