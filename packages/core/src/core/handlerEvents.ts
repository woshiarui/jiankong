/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-06-04 18:40:27
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-02 20:56:21
 */
import { EVENT_TYPES } from "@rmonitor/common";
import { HttpData } from "@rmonitor/types";
import { httpTransform } from "./transformData";
import { actionQueue } from "./actionQueue";

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
            //数据上报
        }
    }
}