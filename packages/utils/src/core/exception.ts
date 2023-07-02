/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-06-04 18:23:04
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-02 19:42:22
 */
import { voidFun } from "@rmonitor/types";

/**
 * try catch的封装
 * @param fn 
 * @param errFn 
 */
export function nativeTryCatch(fn: voidFun, errFn?: (err) => void): void {
    try {
        fn()
    } catch (err) {
        if (errFn) {
            errFn(err)
        }
    }
}