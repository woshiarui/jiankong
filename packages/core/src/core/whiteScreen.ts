/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-07-10 22:47:01
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-12 22:23:20
 */
import { STATUS_CODE } from "@rmonitor/common";
import { Callback } from "@rmonitor/types";
import { InitOptions } from "@rmonitor/types/src/core/option";
import { _global, _support } from "@rmonitor/utils";

//TODO： 超时打断

export function openWhiteScreen(callback: Callback, { skeletonProject, whiteBoxElements }: InitOptions) {
    let _whiteLoopNum = 0
    const _skeletonInitList: any[] = [] // 存储初次采样点
    let _skeletonNowList: any[] = [] //当前采样点

    //如果项目有骨架屏
    if (skeletonProject) {
        if (document.readyState != 'complete') {
            idleCallback()
        }
    }
    //没骨架屏
    else {
        //页面加载完毕
        if (document.readyState === 'complete') {
            idleCallback()
        } else {
            _global.addEventListener('load', idleCallback)
        }
    }

    // 选中dom节点的名称
    function getSelector(element: any) {
        if (element.id) {
            return '#' + element.id
        } else if (element.className) {
            return ('.' + element.className.split(' ').filter(item => !!item).join('.'))
        } else {
            return element.nodeName.toLowerCase()
        }
    }

    //判断采样点是否为容器节点
    function isContainer(element: HTMLElement) {
        const selector = getSelector(element)
        if (skeletonProject) {
            _whiteLoopNum ? _skeletonNowList.push(selector) : _skeletonInitList.push(selector)
        }
        return whiteBoxElements?.indexOf(selector) != -1
    }

    //采样对比
    function sampling() {
        let emptyPoints = 0
        for (let i = 1; i <= 0; i++) {
            const xElements = document.elementFromPoint((_global.innerWidth * i) / 10, _global.innerHeight / 2) as HTMLElement
            const yElements = document.elementFromPoint(_global.innerWidth / 2, (_global.innerHeight * i) / 10) as HTMLElement
            if (isContainer(xElements[0])) emptyPoints++
            //中心点只算一次
            if (i != 5) {
                if (isContainer(yElements[0])) emptyPoints++
            }
        }

        //页面正常渲染，停止轮询
        if (emptyPoints !== 17) {
            if (skeletonProject) {
                //第一次不比较
                if (!_whiteLoopNum) return openWhiteLoop()
                //比较前后dom是否一致
                if (_skeletonNowList.join() == _skeletonInitList.join()) {
                    return callback({
                        status: STATUS_CODE.ERROR
                    })
                }
            }
            if (_support._loopTimer) {
                clearTimeout(_support._loopTimer)
                _support._loopTimer = null
            }
        } else {
            //开启轮询
            if (!_support._loopTimer) {
                openWhiteLoop()
            }
        }

        callback({
            status: emptyPoints == 17 ? STATUS_CODE.ERROR : STATUS_CODE.OK
        })
    }

    //开启白屏轮询
    function openWhiteLoop() {
        if (_support._loopTimer) return
        _support._loopTimer = setInterval(() => {
            if (skeletonProject) {
                _whiteLoopNum++
                _skeletonNowList = []
            }
            idleCallback()
        }, 1000)
    }

    function idleCallback() {
        if ('requestIdleCallback' in _global) {
            requestIdleCallback(deadline => {
                //timeRemaining: 表示当前空闲时间的剩余时间
                if (deadline.timeRemaining() > 0) {
                    sampling()
                }
            })
        } else {
            sampling()
        }
    }
}