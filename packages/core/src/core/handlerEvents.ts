/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-06-04 18:40:27
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-08 19:10:58
 */
import { EVENT_TYPES, STATUS_CODE } from "@rmonitor/common";
import { ErrorTarget, HttpData, RouteHistory } from "@rmonitor/types";
import { httpTransform, resourceTransform } from "./transformData";
import { actionQueue } from "./actionQueue";
import { htmlElementAsString, parseUrlToObj } from "@rmonitor/utils/src/core/browser";
import { getTimeStamp, unknownToString } from "@rmonitor/utils";
import ErrorStackParser from "error-stack-parser";

export const HandleEvents = {
    handleHttp(data: HttpData, type: EVENT_TYPES): void {
        const result = httpTransform(data)
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
    },

    handleUnhandleRejection(ev: PromiseRejectionEvent) {
        const stackFrame = ErrorStackParser.parse(ev.reason)[0]
        const { fileName, columnNumber, lineNumber } = stackFrame
        const message = unknownToString(ev.reason.message || ev.reason.stack);
        const data = {
            type: EVENT_TYPES.UNHANDLED_REJECTION,
            status: STATUS_CODE.ERROR,
            time: getTimeStamp(),
            message,
            fileName,
            line: lineNumber,
            column: columnNumber
        }
        actionQueue.push({
            type: EVENT_TYPES.UNHANDLED_REJECTION,
            category: actionQueue.getCategory(EVENT_TYPES.UNHANDLED_REJECTION),
            time: getTimeStamp(),
            status: STATUS_CODE.ERROR,
            data
        })
        //TODO: 上报数据
    },

    handleClick(data) {
        const htmlString = htmlElementAsString(data.data.activeElement as HTMLElement)
        if (htmlString) {
            actionQueue.push({
                type: EVENT_TYPES.CLICK,
                status: STATUS_CODE.OK,
                category: actionQueue.getCategory(EVENT_TYPES.CLICK),
                data: htmlString,
                time: getTimeStamp()
            })
        }
    },

    handleError(ev: ErrorTarget) {
        const target = ev.target
        // vue 和 react 捕获的报错用ev解析，异步错误用ev.error解析
        if (!target || (ev.target && !ev.target.localName)) {
            const stackFrame = ErrorStackParser.parse(!target ? ev : ev.error)[0]
            const { fileName, columnNumber, lineNumber } = stackFrame
            const errorData = {
                type: EVENT_TYPES.ERROR,
                status: STATUS_CODE.ERROR,
                time: getTimeStamp(),
                message: ev.message,
                fileName,
                line: lineNumber,
                column: columnNumber
            }
            actionQueue.push({
                type: EVENT_TYPES.ERROR,
                category: actionQueue.getCategory(EVENT_TYPES.ERROR),
                data: errorData,
                time: getTimeStamp(),
                status: STATUS_CODE.ERROR
            })
            //数据上报
        }

        // 资源加载错误
        if (target?.localName) {
            const data = resourceTransform(target)
            actionQueue.push({
                type: EVENT_TYPES.RESOURCE,
                category: actionQueue.getCategory(EVENT_TYPES.RESOURCE),
                status: STATUS_CODE.ERROR,
                time: getTimeStamp(),
                data
            })
            //上报数据
        }
    }
}