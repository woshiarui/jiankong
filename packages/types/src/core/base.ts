/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-06-04 16:19:02
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-06-04 18:58:05
*/
import {EVENT_TYPES} from '@rmonitor/common'

/**
 * http请求
 */
//TODO: 待深入了解字段
export interface HttpData {
    type?: string;
    method?: string;
    time: number;
    url: string; // 接口地址
    elapsedTime: number; // 接口时长
    message: string; // 接口信息
    Status?: number; // 接口状态编码
    status?: string; // 接口状态
    requestData?: {
      httpType: string; // 请求类型 xhr fetch
      method: string; // 请求方式
      data: any;
    };
    response?: {
      Status: number; // 接口状态
      data?: any;
    };
  }

export interface RMonitor {
    options: any; //配置信息
}

export interface Window{
    _rMonitor: {
        [key: string]: any;
      };
}

export interface Callback {
    (...args: any[]): any;
}

export interface AnyObject{
    [key: string]: any;
}

export type voidFun = (...args: []) => void

export type ReplaceCallback = (data: any) => void;

export interface ReplaceHandler {
    type: EVENT_TYPES;
    callback: Callback
}
