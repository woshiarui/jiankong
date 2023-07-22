/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-07-21 21:52:08
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-22 11:45:17
 */
import { InitOptions, ReportData } from "@rmonitor/types";
import { Queue } from "../../../utils/src/core/queue";
import { _support, generateUUID, getLocationHref, isBrowserEnv, validateOption } from "@rmonitor/utils";
import { EVENT_TYPES } from "@rmonitor/common";
import { actionQueue } from "./actionQueue";
import { options } from "./option";

export class TransportData {
    queue: Queue = new Queue() //消息队列
    apikey = ''
    errorDsn = ''
    userId = ''
    uuid: string
    beforeDataReport: any //上报数据前的hook
    getUserId: any//用户自定义获取userId的方法
    useImgUpload = false
    constructor() {
        this.uuid = generateUUID()
    }
    beacon(url: string, data: any) {
        return navigator.sendBeacon(url, JSON.stringify(data))
    }

    imgRequest(data: ReportData, url: string) {
        const requestFun = () => {
            const img = new Image()
            const spliceStr = url.indexOf('?') === -1 ? '?' : '&';
            img.src = `${url}${spliceStr}data=${encodeURIComponent(JSON.stringify(data))}`
        }
        this.queue.addFn(requestFun)
    }

    async beforePost(this: any, data: ReportData): Promise<ReportData | boolean> {
        let transportData = this.getTransportData(data)
        //配置了beforeDataReport
        if (typeof this.beforeDataReport === 'function') {
            transportData = this.beforeDataReport(transportData)
            if (!transportData) return false
        }
        return transportData
    }

    async xhrPost(data: ReportData, url: string) {
        const requestFun = () => {
            fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                }
            })
        }
        this.queue.addFn(requestFun)
    }

    //获取用户信息
    getAuthInfo() {
        return {
            userId: this.userId || this.getAuthId() || '',
            apikey: this.apikey,
        }
    }

    getAuthId() {
        if (typeof this.getUserId === 'function') {
            const id = this.getUserId()
            if (typeof id === 'string' || typeof id === 'number') {
                return id
            } else {
                console.error(`RMonitor userId: ${id} 期望string 或 number类型，但是传入${typeof id}`)
            }
        }
    }

    //添加公共信息
    getTransportData(data: any): ReportData {
        const info = {
            ...data,
            ...this.getAuthInfo(), //获取用户信息
            uuid: this.uuid,
            pageUrl: getLocationHref(),
            deviceInfo: _support.deviceInfo,
        }

        const exclude = [
            EVENT_TYPES.WHITESCREEN
        ]
        if (!exclude.includes(data.type)) {
            info.actionStore = actionQueue.getQueue() //获取用户行为
        }
        return info
    }

    // 判断请求是否为SDK配置的接口
    isSdkTransportUrl(targetUrl: string): boolean {
        let isSdkDsn = false
        if (this.errorDsn && targetUrl.indexOf(this.errorDsn) !== -1) {
            isSdkDsn = true
        }
        return isSdkDsn
    }

    bindOptions(options: InitOptions) {
        const { dsn, apikey, beforeDataReport, userId, getUserId, useImgUpload } = options
        validateOption(apikey, 'apikey', 'string') && (this.apikey = apikey);
        validateOption(dsn, 'dsn', 'string') && (this.errorDsn = dsn);
        validateOption(userId, 'userId', 'string') && (this.userId = userId || '');
        validateOption(useImgUpload, 'useImgUpload', 'boolean') &&
            (this.useImgUpload = useImgUpload || false);
        validateOption(beforeDataReport, 'beforeDataReport', 'function') &&
            (this.beforeDataReport = beforeDataReport);
        validateOption(getUserId, 'getUserId', 'function') && (this.getUserId = getUserId);
    }

    async send(data: ReportData) {
        const dsn = this.errorDsn
        if (!dsn) {
            console.error('RMonitor: dsn为空，没有传入监控错误上报的地址')
            return
        }
        if (_support.options.silentRecordScreen) {
            if (options.recordScreenTypeList.includes(data.type)) {
                _support.hasError = true
                data.recordScreenId = _support.recordScreenId
            }
        }
        const result = (await this.beforePost(data)) as ReportData
        if (isBrowserEnv && result) {
            // 优先用sendBeacon 上报，若数据量大，再使用图片打点上报
            const value = this.beacon(dsn, result)
            if (!value) {
                return this.useImgUpload ? this.imgRequest(result, dsn) : this.xhrPost(result, dsn)
            }
        }
    }
}

const transportData = _support.transformData || (_support.transformData = new TransportData())

export { transportData }