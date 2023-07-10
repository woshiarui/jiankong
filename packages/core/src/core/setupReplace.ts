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
 * @LastEditTime: 2023-07-10 23:25:40
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

    addReplaceHandler({
        callback: data => {
            HandleEvents.handleUnhandleRejection(data)
        },
        type: EVENT_TYPES.HASH_CHANGE
    })

    addReplaceHandler({
        callback: data => {
            HandleEvents.handleClick(data)
        },
        type: EVENT_TYPES.CLICK
    })

    addReplaceHandler({
        callback: () => {
            HandleEvents.handleWhiteScreen()
        },
        type: EVENT_TYPES.WHITESCREEN
    })
}