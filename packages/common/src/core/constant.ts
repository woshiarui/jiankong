/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-06-04 16:51:21
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-12 22:30:48
 */
export enum HTTPTYPE {
    XHR = 'xhr',
    FETCH = 'fetch'
}

export enum METHODS {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

export enum EVENT_TYPES {
    XHR = 'xhr',
    FETCH = 'fetch',
    CLICK = 'click',
    HASH_CHANGE = 'onhashchange',
    HISTORY = 'history',
    UNHANDLED_REJECTION = 'unhandledrejection',
    REACT = 'react',
    VUE = 'vue',
    ERROR = 'error',
    RESOURCE = 'resource',
    WHITESCREEN = 'whitescreen',
    CUSTOM = 'custom'
    //TODO: 待补充
}

export enum STATUS_CODE {
    ERROR = 'error',
    OK = 'ok',
}

export enum HTTP_CODE {
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
}

/**
* 用户行为
*/
export enum ACTION_TYPE {
    CLICK = 'Click',
    HTTP = 'Http',
    RESOURCE = 'Resource Error',
    CODE_ERROR = 'Code Error',
    ROUTE = 'Route',
    CUSTOM = 'Custom',
}