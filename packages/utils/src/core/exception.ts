/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-06-04 18:23:04
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-06-04 18:24:23
 */
import { voidFun } from "@rmonitor/types";

export function nativeTryCatch(fn: voidFun, errFn?: (err) => void): void {
    try {
        fn()
    } catch (err) {
        if (errFn) {
            errFn(err)
        }
    }
}