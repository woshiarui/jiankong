import { _global, getTimeStamp, on } from "@rmonitor/utils";
import { BasePlugin, SdkBase } from "@rmonitor/types";
import { EVENT_TYPES, STATUS_CODE } from '@rmonitor/common';
import { getResource, getWebVitals } from "./core/performance";
/*
 * @Descripttion:
 * @version:
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-06-03 18:55:54
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-29 16:56:09
 */
export default class WebPerformance extends BasePlugin {
    constructor() {
        super(EVENT_TYPES.PERFORMANCE)
        this.type = EVENT_TYPES.PERFORMANCE
    }
    bindOptions(options: object): void {
        console.log(options)
    }
    core({ transportData }: SdkBase) {
        getWebVitals((res: any) => {
            // name指标名称， rating评级，value数值
            const { name, rating, value } = res
            transportData.send({
                type: EVENT_TYPES.PERFORMANCE,
                status: STATUS_CODE.OK,
                time: getTimeStamp(),
                name,
                rating,
                value
            })
        })

        const observer = new PerformanceObserver(list => {
            for (const long of list.getEntries()) {
                transportData.send({
                    type: EVENT_TYPES.PERFORMANCE,
                    name: 'longTask',
                    longTask: long,
                    time: getTimeStamp(),
                    status: STATUS_CODE.OK
                })
            }
        })

        observer.observe({ entryTypes: ['longtask'] })

        on(_global, 'load', function () {
            transportData.send({
                type: EVENT_TYPES.PERFORMANCE,
                name: 'resourceList',
                time: getTimeStamp(),
                status: STATUS_CODE.OK,
                resourceList: getResource()
            })

            // 上报内存情况，safari、firefox不支持该属性
            if (performance.memory) {
                transportData.send({
                    type: EVENT_TYPES.PERFORMANCE,
                    name: 'memory',
                    time: getTimeStamp(),
                    status: STATUS_CODE.OK,
                    memory: {
                        jsHeapSizeLimit: performance.memory && performance.memory.jsHeapSizeLimit,
                        totalJSHeapSize: performance.memory && performance.memory.totalJSHeapSize,
                        usedJSHeapSize: performance.memory && performance.memory.usedJSHeapSize
                    }
                })
            }


        })
    }
    transform(data: any): void {
        console.log(data)
    }
}