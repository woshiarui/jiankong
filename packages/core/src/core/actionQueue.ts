import { ACTION_TYPE, EVENT_TYPES } from "@rmonitor/common";
import { ActionQueueData } from "@rmonitor/types";
import { _support, getTimeStamp } from "@rmonitor/utils";

/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-07-02 20:32:06
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-02 20:51:15
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

    //TODO: 待完善
    getCategory(type: EVENT_TYPES) {
        switch (type) {
            case EVENT_TYPES.XHR:
            case EVENT_TYPES.FETCH:
                return ACTION_TYPE.HTTP;

            case EVENT_TYPES.CLICK:
                return ACTION_TYPE.CLICK
        }
    }

    //TODO: bindOptions
}

//保证全局统一actionQueue
export const actionQueue = _support.actionQueue || (_support.actionQueue = new ActionQueue())