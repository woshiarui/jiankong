/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-07-18 00:10:03
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-29 16:50:33
 */
import { InitOptions } from "@rmonitor/types";
import { _support, validateOption } from "@rmonitor/utils";
import { actionQueue } from "./actionQueue";
import { transportData } from "./reportData";

export class Options {
    dsn = ''; // 监控上报的接口的地址
    throttleDelayTime = 0;//click事件的节流时长
    maxActionQueueLength = 30; //用户行为栈存储默认最大值
    overTime = 10; //接口超时时长
    whiteBoxElements = ['html', 'body', '#app', '#root']; //白屏检测的容器列表
    isOpenWhiteScreen = false; //是否开启白屏检测
    isHasLoading = false; //项目是否有骨架屏
    filterXhrUrlRegExp: any; //过滤接口请求的正则表达式
    repeatCodeError = false; //是否去除重复的代码错误,重复的错误只上报一次
    handleHttpStatus: any; //处理接口返回的response
    constructor() { }
    bindOptions(options: InitOptions) {
        const { dsn, filterXhrUrlRegExp, throttleDelayTime = 0, overTime = 10, isOpenWhiteScreen = false, whiteBoxElements = ['html', 'body', '#app', '#root'], isHasLoading = false, handleHttpStatus, repeatCodeError = false } = options
        validateOption(dsn, 'dsn', 'string') && (this.dsn = dsn);
        validateOption(throttleDelayTime, 'throttleDelayTime', 'number') &&
            (this.throttleDelayTime = throttleDelayTime);
        validateOption(overTime, 'overTime', 'number') && (this.overTime = overTime);
        validateOption(filterXhrUrlRegExp, 'filterXhrUrlRegExp', 'regexp') &&
            (this.filterXhrUrlRegExp = filterXhrUrlRegExp);
        validateOption(isOpenWhiteScreen, 'isOpenWhiteScreen', 'boolean') &&
            (this.isOpenWhiteScreen = isOpenWhiteScreen);
        validateOption(isHasLoading, 'skeletonProject', 'boolean') &&
            (this.isHasLoading = isHasLoading);
        validateOption(whiteBoxElements, 'whiteBoxElements', 'array') &&
            (this.whiteBoxElements = whiteBoxElements);
        validateOption(handleHttpStatus, 'handleHttpStatus', 'function') &&
            (this.handleHttpStatus = handleHttpStatus);
        validateOption(repeatCodeError, 'repeatCodeError', 'boolean') &&
            (this.repeatCodeError = repeatCodeError);
    }
}

const options = _support.options || (_support.options = new Options())

export function handleOptions(params: InitOptions) {
    //后续需要测试是否会重复设置
    actionQueue.bindOptions(params)
    transportData.bindOptions(params)
    options.bindOptions(params)
}

export { options }