import { _support } from "./global";

/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-07-05 23:35:37
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-22 10:59:21
 */
export function parseUrlToObj(url: string) {
    if (!url) return {}
    //gpt生成正则
    const match = url.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
    if (!match) {
        return {}
    }
    const query = match[6] || ''
    const fragment = match[8] || ''
    return {
        host: match[4],
        path: match[5],
        protocol: match[2],
        relative: match[5] + query + fragment
    }
}

/**
 * 返回包括id、clss、innerText等字符串
 * @param target dom
 */
export function htmlElementAsString(target: HTMLElement) {
    const tagName = target.tagName.toLowerCase()
    if (tagName === 'body') {
        return ''
    }
    let classNames = target.classList.value
    classNames = classNames !== '' ? `clas='${classNames}'` : ''
    const id = target.id ? `id='${target.id}'` : ''
    const innerText = target.innerText
    return `<${tagName} ${id} ${classNames}>${innerText}</${tagName}>`
}

// 对错误生成一个唯一的hash
export function getErrorUid(input: string) {
    return window.btoa(encodeURIComponent(input))
}

export function hashMapExist(hash: string): boolean {
    const exist = _support.errorMap.has(hash)
    if (!exist) {
        _support.errorMap.set(hash, true)
    }
    return exist
}