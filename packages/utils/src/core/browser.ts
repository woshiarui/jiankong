/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-07-05 23:35:37
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-07 21:50:02
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