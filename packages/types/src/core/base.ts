/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-06-04 16:19:02
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-17 23:54:09
*/
import { ACTION_TYPE, EVENT_TYPES, STATUS_CODE } from '@rmonitor/common'

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

export interface Window {
  onpopstate: any;
  history: any;
  innerWidth: any;
  innerHeight: any;
  _rMonitor: {
    [key: string]: any;
  };
  addEventListener: any;
}

export interface Callback {
  (...args: any[]): any;
}

export interface AnyObject {
  [key: string]: any;
}

export type voidFun = (...args: []) => void

export type ReplaceCallback = (data: any) => void;

export interface ReplaceHandler {
  type: EVENT_TYPES;
  callback: Callback
}

export interface ActionQueueData {
  type: EVENT_TYPES,
  category: ACTION_TYPE,//行为类型 click、http error、code error等等
  status: STATUS_CODE,//行为状态 成功or失败
  time: number,
  data: any,
}

export interface RouteHistory {
  from: string,
  to: string
}

export interface ErrorTarget {
  target?: {
    localName?: string
  }
  error?: any
  message?: string
}

export interface ResourceTarget {
  src?: string;
  href?: string;
  localName?: string;
}

export interface ResourceError {
  time: number;
  message: string;// 加载失败信息
  name: string; // 脚本类型，例如js脚本
}

export interface RecordScreen {
  recordScreenId: string; //录屏id
  events: string; //录屏内容
}


export interface ReportData extends HttpData, ResourceError, RecordScreen {
  type: string //事件类型
  pageUrl: string; //页面地址
  time: number; //发生时间
  uuid: string; //页面唯一标识
  apikey: string; //项目id
  status: string; //事件状态
  sdkVersion: string; //版本信息
  actionStore?: ActionQueueData[] //用户行为数据

  //设备信息
  deviceInfo: {
    browserVersion: string | number // 版本号
    browser: string; //Chrome
    osVersion: string | number // 电脑系统 win10
    os: string; //设备系统
    ua: string; //设备详情
    device: string; //设备种类描述
    device_type: string //设备种类，例如pc
  }
}

export interface SdkBase {
  transportData: any; //数据上报
  actionQueue: any;//用户行为
  options: any;//公共配置
  notify: any //发布消息
}

export abstract class BasePlugin {
  public type: string //插件类型
  constructor(type: string) {
    this.type = type
  }
  abstract core(SdkBase: SdkBase): void;//核心方法
  abstract transform(data: any): void //数据转化
}