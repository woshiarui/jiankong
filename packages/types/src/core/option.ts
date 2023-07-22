import { ActionQueueData, ReportData } from "./base";

/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-07-08 16:47:30
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-22 11:33:34
 */
export interface InitOptions {
    dsn: string; // 上报地址
    apikey: string; //项目id
    userId?: string //用户id
    disable?: boolean //是否禁用SDK

    xhr?: boolean; //是否监控xhr 请求
    fetch?: boolean;
    click?: boolean;
    error?: boolean;
    unhandledrejection?: boolean;
    hashchange?: boolean;
    history?: boolean;
    performance?: boolean;
    recordScreen?: boolean;//是否开启录屏

    recordScreentTime?: number; //单次录屏时长
    recordScreenTypeList?: string[] //上报录屏的错误列表

    isOpenWhiteScreen?: boolean, //是否开启白屏检测
    whiteBoxElements?: string[], //白屏检测的容器列表
    isHasLoading?: boolean, //项目是否有骨架屏

    maxActionQueueLength?: number //限制长度
    throttleDelayTime?: number, //click事件的节流时长
    overTime?: number, //接口超时时长
    filterXhrUrlRegExp?: RegExp, //过滤接口请求的正则表达式
    repeatCodeError?: boolean //是否去除重复的代码错误,重复的错误只上报一次
    useImgUpload?: boolean; // 是否使用图片打点上报

    beforePushActionStore?(data: ActionQueueData): ActionQueueData; // 添加到行为列表前的 hook
    beforeDataReport?(data: ReportData): Promise<ReportData | boolean>; // 数据上报前的 hook
    getUserId?: () => string | number; // 用户定义的
    handleHttpStatus?: (data: any) => boolean, //处理接口返回的response
}

export interface VueInstance {
    [key: string]: any;
    config: VueConfiguration;
}

export interface VueConfiguration {
    silent?: boolean;
    errorHandler?(err: Error, vm: ViewModel, info: string): void;
    warnHandler?(msg: string, vm: ViewModel, trace: string): void;
    keyCodes?: { [key: string]: number | Array<number> };
}

export interface ViewModel {
    [key: string]: any;
    $root?: Record<string, unknown>;
    $options?: {
        [key: string]: any;
        name?: string;
        propsData?: Record<string, any>;
        _componentTag?: string;
        __file?: string;
        props?: Record<string, any>;
    };
    $props?: Record<string, unknown>;
}

export interface RecordScreenOption {
    recordScreenTypeList: string[]
    recordScreentime: number
}

export interface FMPOptions {
    exact?: boolean
}