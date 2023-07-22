/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-06-04 16:38:36
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-22 10:14:27
 */
import { AnyObject, Callback, } from "@rmonitor/types"
import { variableType } from "./verifyType"

/**
 *
 * 重写对象上面的某个属性
 * ../param source 需要被重写的对象
 * ../param name 需要被重写对象的key
 * ../param replacement 以原有的函数作为参数，执行并重写原有函数
 * ../param isForced 是否强制重写（可能原先没有该属性）
 * ../returns void
 */
export function replaceAop(source: AnyObject, name: string, replacement: Callback, isForced = false) {
    if (source === undefined) return
    if (name in source || isForced) {
        const original = source[name]
        const wrapped = replacement(original)
        if (typeof wrapped === 'function') {
            source[name] = wrapped
        }
    }
}

export function getTimeStamp(): number {
    return Date.now()
}


/**
 * 添加事件监听器
 * ../export
 * ../param {{ addEventListener: Function }} target
 * ../param {keyof TotalEventName} eventName
 * ../param {Function} handler
 * ../param {(boolean | Object)} options
 * ../returns
 */
export function on(target: any, eventName: string, handler: Callback, options = false) {
    target.addEventListener(eventName, handler, options)
}

export function getLocationHref() {
    return document?.location?.href || ''
}

export function unknownToString(target: unknown) {
    if (variableType.isString(target)) return target as string
    if (variableType.isUndefined(target)) return 'undefined'
    return JSON.stringify(target)
}

export function throttle(fn: any, delay: number) {
    let flag = true
    return function (this, ...args) {
        if (!flag) return
        fn.apply(this, args)
        flag = false
        setTimeout(() => {
            flag = true
        }, delay)
    }
}

export function generateUUID(): string {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
}

export function interceptStr(str: string, interceptLength: number) {
    if (variableType.isString(str)) {
        return (
            str.slice(0, interceptLength) + (str.length > interceptLength ? `:截取签${interceptLength}个字符` : '')
        )
    }
}

export function typeofAny(target: any) {
    return Object.prototype.toString.call(target).slice(8, -1).toLowerCase()
}

export function validateOption(target: any, targetName: string, expectType: string) {
    if (!target) return false
    if (typeofAny(target) === expectType) return true
    console.error(`RMonitor: ${targetName} 期待传入${expectType}类型,目前是${typeofAny(target)}类型,请修改`)
}