import { ACTION_TYPE, EVENT_TYPES } from "@rmonitor/common";
import { ActionQueueData, InitOptions } from "@rmonitor/types";
import { _support, getTimeStamp, validateOption } from "@rmonitor/utils";

/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-07-02 20:32:06
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-22 11:44:16
 */
export class ActionQueue {
    maxLength = 30;//用户行为存储限制
    beforePushActionStore: unknown = null;
    queue: ActionQueueData[];
    constructor() {
        this.queue = [];
    }
    /**
     * 添加用户行为栈
     */
    push(data: ActionQueueData) {
        //提供自定义能力，用户可以自定义hook
        if (typeof this.beforePushActionStore === 'function') {
            const result = this.beforePushActionStore(data) as ActionQueueData
            if (!result) return
            this.immediatePush(result)
        }
        this.immediatePush(data)
    }

    immediatePush(data: ActionQueueData) {
        //兜底
        data.time || (data.time = getTimeStamp())
        if (this.queue.length > this.maxLength) {
            this.shift()
        }
        this.queue.push(data)
        //可能因为网络延迟等原因导致后发生的操作先入队列，因此需要进行兜底排序
        this.queue.sort((a, b) => a.time - b.time)
    }

    shift() {
        return this.queue.shift() !== undefined
    }

    clear() {
        this.queue = []
    }

    getQueue() {
        return this.queue
    }

    getCategory(type: EVENT_TYPES) {
        switch (type) {
            // 接口请求
            case EVENT_TYPES.XHR:
            case EVENT_TYPES.FETCH:
                return ACTION_TYPE.HTTP;

            // 用户点击
            case EVENT_TYPES.CLICK:
                return ACTION_TYPE.CLICK

            // 路由变化
            case EVENT_TYPES.HISTORY:
            case EVENT_TYPES.HASH_CHANGE:
                return ACTION_TYPE.ROUTE

            // 代码错误
            case EVENT_TYPES.UNHANDLED_REJECTION:
            case EVENT_TYPES.ERROR:
            case EVENT_TYPES.REACT:
            case EVENT_TYPES.VUE:
                return ACTION_TYPE.CODE_ERROR

            // 加载资源
            case EVENT_TYPES.RESOURCE:
                return ACTION_TYPE.RESOURCE

            // 用户自定义内容
            default:
                return ACTION_TYPE.CUSTOM
        }
    }


    bindOptions(options: InitOptions) {
        const { maxActionQueueLength, beforePushActionStore } = options
        validateOption(maxActionQueueLength, 'maxActionQueueLength', 'number') &&
            (this.maxLength = maxActionQueueLength || 30)
        validateOption(beforePushActionStore, 'beforePushActionStore', 'function') &&
            (this.beforePushActionStore = beforePushActionStore)
    }
}

//保证全局统一actionQueue
export const actionQueue = _support.actionQueue || (_support.actionQueue = new ActionQueue())