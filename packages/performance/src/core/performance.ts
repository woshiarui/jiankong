import { _global, on } from '@rmonitor/utils'
import { Callback } from '@rmonitor/types'
import { onFCP, onTTFB } from 'web-vitals';

let entries: any[] = [];
let observer: MutationObserver;
const viewportWidth = _global.innerWidth;
const viewportHeight = _global.innerHeight;
let timer: number


//first paint,浏览器开始渲染（视觉上出现变化了就算）
export function getFP(callback: Callback) {
    const entryHandler = (list: any) => {
        for (const entry of list.getEntries()) {
            if (entry.name === 'first-paint') {
                observer.disconnect()
                callback({
                    name: 'FP',
                    value: entry.startTime,
                    rating: entry.startTime > 2500 ? 'poor' : 'good'
                })
            }
        }
    }
    const observer = new PerformanceObserver(entryHandler);
    observer.observe({ type: 'paint', buffered: true })
}

// dom 对象是否在屏幕内
function isInScreen(dom: HTMLElement): boolean {
    const rectInfo = dom.getBoundingClientRect();
    if (rectInfo.left < viewportWidth && rectInfo.top < viewportHeight) {
        return true;
    }
    return false;
}
//first screen paint,首屏渲染时间
export function getFSP(callback: Callback) {
    //如果支持requestIdleCallback
    let limitedTime = 500
    if ('requestIdleCallback' in _global) {
        let timing = setTimeout(() => {
            observeFSP(callback)
        }, limitedTime)
        //如果超过limiTime没执行就强制执行
        requestIdleCallback(dealine => {
            //如果空闲时间还有剩余时间的话，就执行计算
            if (dealine.timeRemaining() > 0) {
                clearTimeout(timing)
                observeFSP(callback)
            }
        })
    } else {//不支持的话就直接执行
        observeFSP(callback)
    }
}

//监听DOM变化
function observeDOM(callback: Callback) {
    //用requestAnimationFrame代替定时器setTimeout
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(() => {
        //如果状态为complete就代表文档都载入完成了
        if (document.readyState === 'complete') {
            //取消监听
            observer && observer.disconnect();
            //计算FSP
            let startTime = 0
            entries.forEach(entry => {
                if (entry.startTime > startTime) {
                    startTime = entry.startTime;
                }
            });
            let value = startTime - performance.timing.navigationStart;
            callback(value)
        } else {//否则就继续监听DOM变化
            observeDOM(callback)
        }
    })
}

function observeFSP(callback: Callback) {
    const ignoreDOMList = ['STYLE', 'SCRIPT', 'LINK']
    observer = new MutationObserver((mutationList: any) => {
        observeDOM(callback);
        const entry = { children: [], startTime: 0 };
        for (const mutation of mutationList) {
            if (mutation.addedNodes.length && isInScreen(mutation.target)) {
                for (const node of mutation.addedNodes) {
                    // 忽略掉以上标签的变化
                    if (node.nodeType === 1 && !ignoreDOMList.includes(node.tagName) && isInScreen(node)) {
                        entry.children.push(node as never);
                    }
                }
            }
        }

        if (entry.children.length) {
            entries.push(entry);
            entry.startTime = new Date().getTime();
        }
    });
    observer.observe(document, {
        childList: true, // 监听添加或删除子节点
        subtree: true, // 监听整个子树
        characterData: true, // 监听元素的文本是否变化
        attributes: true, // 监听元素的属性是否变化
    });
}

//first contentful paint,内容的首次绘制
export function getFCP(callback: Callback) {
    const entryHandler = (list: any) => {
        for (const entry of list.getEntries()) {
            if (entry.name === 'first-contentful-paint') {
                observer.disconnect()
                callback({
                    name: 'FCP',
                    value: entry.startTime,
                    rating: entry.startTime > 2500 ? 'poor' : 'good'
                })
            }
        }
    }
    const observer = new PerformanceObserver(entryHandler);
    observer.observe({ type: 'paint', buffered: true })
}

//time to first byte,浏览器接收第一字节
export function getTTFB(callback: Callback) {
    on(_global, 'load', function () {
        const { responseStart, navigationStart } = performance.timing;
        const value = responseStart - navigationStart;
        callback({
            name: 'TTFB',
            value,
            rating: value > 100 ? 'poor' : 'good'
        });
    })
}

//time to interactive,达到完全可交互的状态
export function getTTI(callback: Callback) {
    on(_global, 'load', function () {
        const { domInteractive, navigationStart } = performance.timing;
        const value = domInteractive - navigationStart;
        callback({
            name: 'TTI',
            value,
            rating: value > 100 ? 'poor' : 'good'
        });
    })
}

function isSafari(): boolean {
    return /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
}
export function getWebVitals(callback: Callback): void {
    // web-vitals 不兼容safari浏览器
    if (isSafari()) {
        getFCP(res => {
            callback(res);
        });
        getTTFB(res => {
            callback(res);
        });
    } else {
        onFCP(res => {
            callback(res);
        });
        onTTFB(res => {
            callback(res);
        });
    }

    getFSP(res => {
        const data = {
            name: 'FSP',
            value: res,
            rating: res > 2500 ? 'poor' : 'good',
        };
        callback(data);
    });

    getTTI(res => {
        callback(res);
    });

    getFP(res => {
        callback(res);
    });
}
