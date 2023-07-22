/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-06-04 18:52:27
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-22 11:41:26
 */
import { HTTP_CODE, STATUS_CODE } from "@rmonitor/common";
import { HttpData, ResourceError, ResourceTarget } from "@rmonitor/types";
import { getTimeStamp, interceptStr } from "@rmonitor/utils";
import { options } from "./option";
//TODO： 增加HTTP状态码映射关系函数
export function httpTransform(data: HttpData): HttpData {
    let message: any = ''
    const { elapsedTime, time, method = '', type, Status = 200, response, requestData } = data
    let status: STATUS_CODE
    /**
     * 什么情况下状态码为0：
     * 如果XHR请求返回状态码为0，通常表示请求未能成功发送或接收到响应。这可能有以下几种情况
     * 1. 网络错误：可能是由于网络连接问题，请求无法发送到服务器或无法接收到服务器的响应。
     * 2. 跨域请求被阻止：如果请求跨域，且服务器未设置允许跨域访问的响应头，浏览器会阻止请求，并返回状态码0。
     * 3. 请求被取消：在发送请求之前，如果调用了XHR对象的abort()方法取消了请求，也会返回状态码0。
     */
    if (Status === 0) {
        status = STATUS_CODE.ERROR
        // TODO: 性能数据获取，存储到options中
        message = elapsedTime <= options.overTime * 1000 ? `请求失败，Status值为：${Status}` : "请求失败，接口超时"
    } else if ((Status as number) < HTTP_CODE.BAD_REQUEST) {
        status = STATUS_CODE.OK
        if (options.handleHttpStatus && typeof options.handleHttpStatus === 'function') {
            if (options.handleHttpStatus(data)) {
                status === STATUS_CODE.OK
            } else {
                status = STATUS_CODE.ERROR
                message = `接口报错，报错信息为：${typeof response == 'object' ? JSON.stringify(response) : response}`
            }
        }
    } else {
        status = STATUS_CODE.ERROR
        message = `请求失败，Status值：${Status}`
    }
    message = `${data.url}----${message}`
    return {
        url: data.url,
        time,
        status,
        elapsedTime,
        message,
        requestData: {
            httpType: type as string,
            method,
            data: requestData?.data
        },
        response: {
            Status,
            data: status === STATUS_CODE.ERROR ? response : null  //失败才需要返回信息，成功是符合预期的，则不需要返回数据，省流量。。
        }
    }
}

export function resourceTransform(target: ResourceTarget): ResourceError {
    return {
        time: getTimeStamp(),
        message: `${interceptStr(target.src as string, 100) || interceptStr(target.href as string, 100)}` + '__资源加载失败',
        name: target.localName as string
    }
}