import { InitOptions, ViewModel, VueInstance } from "@rmonitor/types/src/core/option";
import { setupReplace } from "./core/setupReplace";
import { handleOptions } from "./core/option";
import { EVENT_TYPES } from "@rmonitor/common";
import { getFlag, nativeTryCatch, setFlag } from "@rmonitor/utils";
import { HandleEvents } from "./core/handlerEvents";
import { subscribeEvent } from "./core";

/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-06-03 18:55:54
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-08 18:47:41
 */
function init(options: InitOptions) {
    if (!options.dsn || !options.id) {
        return console.error(`RMonitor 缺少配置项：${!options.dsn ? 'dns(上报地址)' : ''} ${!options.id ? 'id(项目id)' : ''}`)
    }
    //关闭监控
    if (!options.disable) return

    //配置项待后续补充
    handleOptions(options)
    setupReplace();
}

//TODO: 适配Vue

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
        //TODO: 待设计
        // instance.core()
    })
}

export default {
    init,
    install,
    errorBoundary,
    use
}