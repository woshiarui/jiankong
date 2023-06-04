/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-06-04 18:40:27
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-06-04 18:41:26
 */
import { EVENT_TYPES } from "@rmonitor/common";
import { HttpData } from "@rmonitor/types";

const HandleEvents = {
    handleHttp(data: HttpData, type: EVENT_TYPES): void {
        const result = httpTransform(data)
    }
}