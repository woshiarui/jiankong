/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-06-04 16:15:40
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-22 11:05:21
 */
import { RMonitor, Window } from "@rmonitor/types"
import { UAParser } from 'ua-parser-js';
//获取全局变量
export function getGlobal(): Window {
    return window as unknown as Window
}

export const isBrowserEnv = typeof window !== 'undefined' && Object.prototype.toString.call(window) === `[object Window]`



//全局变量
const _global = getGlobal()

//全局变量中的rmonitor
const _support = getGlobalSupport()

const uaResult = new UAParser().getResult()
// 获取设备信息
_support.deviceInfo = {
    browserVersion: uaResult.browser.version, // // 浏览器版本号 107.0.0.0
    browser: uaResult.browser.name, // 浏览器类型 Chrome
    osVersion: uaResult.os.version, // 操作系统 电脑系统 10
    os: uaResult.os.name, // Windows
    ua: uaResult.ua,
    device: uaResult.device.model ? uaResult.device.model : 'Unknow',
    device_type: uaResult.device.type ? uaResult.device.type : 'Pc',
};

//标记是否被replace
_support.replaceFlag = _support.replaceFlag || {}
const replaceFlag = _support.replaceFlag

//  errorMap 存储代码错误Hash的map
_support.errorMap = new Map()

export function getGlobalSupport() {
    _global._rMonitor = _global._rMonitor || ({} as RMonitor)
    return _global._rMonitor
}

export function getFlag(replaceType: string) {
    return replaceFlag[replaceType] ? true : false
}

export function setFlag(replaceType: string, isSet: boolean) {
    if (replaceFlag[replaceType]) return
    replaceFlag[replaceType] = isSet
}

export {
    _global,
    _support
}