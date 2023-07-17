import { _global } from './global';
/**
 * 消息队列
 */
export class Queue {
    private queue: any[] = []
    private isFlushing = false
    constructor() { }

    addFn(fn: Function) {
        if (typeof fn !== 'function') return
        if (!('requestIdleCallback' in _global || 'Promise' in _global)) {
            fn()
            return
        }
        this.queue.push(fn)
        if (!this.isFlushing) {
            this.isFlushing = true
            //优先使用requestIdleCallback
            if ('requestIdleCallback' in _global) {
                requestIdleCallback(() => this.flushQueue())
            } else {
                //其次使用微任务上报
                Promise.resolve().then(() => this.flushQueue())
            }
        }
    }

    clear() {
        this.queue = []
    }

    getStack() {
        return this.queue
    }

    flushQueue() {
        const temp = this.queue.slice(0)
        this.queue = []
        this.isFlushing = false
        for (let i = 0; i < temp.length; i++) {
            temp[i]()
        }
    }
}