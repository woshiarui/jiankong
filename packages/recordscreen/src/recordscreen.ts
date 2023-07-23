/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-07-21 21:52:08
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-23 14:25:48
 */
import { record } from 'rrweb';
import pako from 'pako'
import { Base64 } from 'js-base64';
import { generateUUID, _support, getTimeStamp } from '@rmonitor/utils';
import { EVENT_TYPES, STATUS_CODE } from '@rmonitor/common'
export function handleScreen(transportData: any, recordScreentime: number) {
    //events 存储录屏信息
    let events: any[] = []
    //stopFn停止录像
    record({
        emit(event, isCheckout) {
            if (isCheckout) {
                //发送错误，上报录屏信息
                if (_support.hasError) {
                    const recordScreenId = _support.recordScreenId
                    _support.recordScreenId = generateUUID()
                    transportData.send({
                        type: EVENT_TYPES.RECORDSCREEN,
                        recordScreenId,
                        time: getTimeStamp(),
                        status: STATUS_CODE.OK,
                        events: zip(events)
                    })
                    events = []
                    _support.hasError = false
                } else {
                    //不上报，清空录屏
                    events = []
                    _support.recordScreenId = generateUUID()
                }
            }
            events.push(event)
        },
        recordCanvas: true,
        checkoutEveryNms: 1000 * recordScreentime
    })
}

//压缩
export function zip(data: any) {
    if (!data) return data
    const dataJson = typeof data !== 'string' && typeof data !== 'number' ? JSON.stringify(data) : data
    //使用base64.encode处理字符编码，可以兼容中文
    const str = Base64.encode(dataJson as string)
    const binaryString = pako.gzip(str)
    const arr = Array.from(binaryString)
    let s = ''
    arr.forEach((item: any) => {
        s += String.fromCharCode(item)
    })
    return Base64.btoa(s)
}