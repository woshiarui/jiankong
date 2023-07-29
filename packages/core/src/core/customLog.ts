import { EVENT_TYPES, STATUS_CODE } from "@rmonitor/common";
import { getTimeStamp, nativeTryCatch, unknownToString, isError } from "@rmonitor/utils";
import * as ErrorStackParser from "error-stack-parser";
import { actionQueue } from "./actionQueue";
import { transportData } from "./reportData";

//自定义上报
export function log({ message = 'customMsg', error = '', type = EVENT_TYPES.CUSTOM }: any) {
    nativeTryCatch(() => {
        let errorInfo = {}
        if (isError(error)) {
            const result = ErrorStackParser.parse(!error.target ? error : error.error || error.reason)[0]
            errorInfo = { ...result, line: result.lineNumber, column: result.columnNumber }
        }
        actionQueue.push({
            type,
            status: STATUS_CODE.ERROR,
            category: actionQueue.getCategory(EVENT_TYPES.CUSTOM),
            data: unknownToString(message),
            time: getTimeStamp()
        })
        //上传数据
        transportData.send({
            type,
            status: STATUS_CODE.ERROR,
            message: unknownToString(message),
            time: getTimeStamp(),
            ...errorInfo
        })
    }, (err) => {
        console.log('上传自定义事件时报错', err)
    })
}