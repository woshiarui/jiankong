/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-06-04 18:40:27
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-05 23:56:54
 */
import { EVENT_TYPES, STATUS_CODE } from "@rmonitor/common";
import { HttpData, RouteHistory } from "@rmonitor/types";
import { httpTransform } from "./transformData";
import { actionQueue } from "./actionQueue";
import { parseUrlToObj } from "@rmonitor/utils/src/core/browser";
import { getTimeStamp } from "@rmonitor/utils";

export const HandleEvents = {
    handleHttp(data: HttpData, type: EVENT_TYPES): void {
        const result = httpTransform(data)
        //添加用户行为
        //需要判断options.dsn
        actionQueue.push({
            type,
            category: actionQueue.getCategory(type),//行为类型 click、http error、code error等等
            status: result.status,//行为状态 成功or失败
            time: result.time,
            data: result
        })
        if (result.status === 'error') {
            //TODO：数据上报
        }
    },

    handleHashChange(data: HashChangeEvent) {
        const { oldURL, newURL } = data
        const { relative: from } = parseUrlToObj(oldURL)
        const { relative: to } = parseUrlToObj(newURL)
        actionQueue.push({
            type: EVENT_TYPES.HASH_CHANGE,
            category: actionQueue.getCategory(EVENT_TYPES.HASH_CHANGE),
            data: {
                from, to
            },
            time: getTimeStamp(),
            status: STATUS_CODE.OK
        })
    },

    handleHistory(data: RouteHistory) {
        const { from, to } = data
        if (!(from || to)) return
        const { relative: parsedFrom } = parseUrlToObj(from)
        const { relative: parsedTo } = parseUrlToObj(to)
        actionQueue.push({
            type: EVENT_TYPES.HISTORY,
            category: actionQueue.getCategory(EVENT_TYPES.HISTORY),
            data: {
                parsedFrom, parsedTo
            },
            time: getTimeStamp(),
            status: STATUS_CODE.OK
        })
    }
}