/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-07-21 21:52:08
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-23 14:11:14
 */
import { InitOptions, ViewModel, VueInstance } from "@rmonitor/types/src/core/option";
import { setupReplace } from "./core/setupReplace";
import { handleOptions, options } from "./core/option";
import { EVENT_TYPES } from "@rmonitor/common";
import { getFlag, nativeTryCatch, setFlag } from "@rmonitor/utils";
import { HandleEvents } from "./core/handlerEvents";
import { actionQueue, notify, subscribeEvent } from "./core";
import { log } from "./core/customLog";
import { transportData } from "./core/reportData";

function init(options: InitOptions) {
    if (!options.dsn || !options.apikey) {
        return console.error(`RMonitor 缺少配置项：${!options.dsn ? 'dns(上报地址)' : ''} ${!options.apikey ? 'id(项目id)' : ''}`)
    }
    //关闭监控
    if (!options.disable) return

    handleOptions(options)
    setupReplace();
}


function install(Vue: VueInstance, options: InitOptions) {
    if (getFlag(EVENT_TYPES.VUE)) return
    setFlag(EVENT_TYPES.VUE, true)
    const handler = Vue.config.errorHandler
    Vue.config.errorHandler = function (err: Error, vm: ViewModel, info: string) {
        console.log(err)
        HandleEvents.handleError(err)
        if (handler) handler.apply(null, [err, vm, info])
    }
    init(options)
}

/**
 * React项目通过ErrorBoundary上报错误
 */
function errorBoundary(err: Error) {
    if (getFlag(EVENT_TYPES.REACT)) return
    setFlag(EVENT_TYPES.REACT, true)
    HandleEvents.handleError(err)
}

/**
 * 支持自定义插件
 * @param plugin 
 * @param option 
 * @returns 
 */
function use(plugin: any, option: any) {
    const instance = new plugin(option)
    if (!subscribeEvent({
        callback: data => {
            instance.transform(data)
        },
        type: instance.type
    }))
        return

    nativeTryCatch(() => {
        instance.core({ transportData, actionQueue, options, notify });
    })
}

export default {
    init,
    install,
    errorBoundary,
    use,
    log
}