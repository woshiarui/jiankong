/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-07-08 16:47:30
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-18 00:12:55
 */
export interface InitOptions {
    dsn: string; // 上报地址
    id: string; // 项目id
    disable?: boolean //是否禁用SDK
    xhr?: boolean;
    fetch?: boolean;
    click?: boolean;
    error?: boolean;
    unhandledrejection?: boolean;
    hashchange?: boolean;
    history?: boolean;
    skeletonProject?: boolean,  //是否有骨架屏
    whiteBoxElements?: string[] //白屏检测的容器列表
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