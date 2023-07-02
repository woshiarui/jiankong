/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-06-04 16:15:40
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-06-04 18:28:28
 */
import { Callback, RMonitor, Window } from "@rmonitor/types"

//获取全局变量
export function getGlobal(): Window {
    return window as unknown as Window
}



//全局变量
const _global = getGlobal()

//全局变量中的rmonitor
const _support = getGlobalSupport()

//标记是否被replace
_support.replaceFlag = _support.replaceFlag || {}
const replaceFlag = _support.replaceFlag

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