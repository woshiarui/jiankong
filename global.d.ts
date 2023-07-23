/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-07-23 14:07:16
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-23 14:07:21
 */
declare interface Performance extends Performance {
    memory?: {
        jsHeapSizeLimit: number;
        totalJSHeapSize: number;
        usedJSHeapSize: number;
    };
}
