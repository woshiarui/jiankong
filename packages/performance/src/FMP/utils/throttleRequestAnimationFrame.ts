/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-07-29 16:09:19
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-29 16:53:17
 */
/**
 * 使用 request animation frame 调度某个回调函数
 */

export const throttleRequestAnimationFrame = (
  callback: FrameRequestCallback
) => {
  if (!window) {
    return ''
  }

  const { requestAnimationFrame: raf, cancelAnimationFrame: caf } = window

  if (!(typeof raf === 'function') || !(typeof caf === 'function')) {
    return ''
  }

  // raf 的返回值为非 0 数字
  let rafTimer: number = 0

  const runCallback = () => {
    // @xiaomadaha1 这里只有取消(caf)却没有重新调用(raf),这样不就没有统计了吗，不是很理解望解答
    if (rafTimer) {
      // requestAnimationFrame 不管理回调函数
      // 在回调被执行前，多次调用带有同一回调函数的 requestAnimationFrame，会导致回调在同一帧中执行多次
      // 常见的情况是一些事件机制导致多次触发
      // 设定一个 timer，如果接下来回调再次被调度，那么撤销上一个
      // https://www.w3.org/TR/animation-timing/#dom-windowanimationtiming-requestanimationframe
      caf(rafTimer)
    } else {
      rafTimer = raf(callback)
    }
  }

  const cancelCallback = () => {
    if (rafTimer) {
      caf(rafTimer)
    }
  }

  return {
    runCallback,
    cancelCallback
  }
}
