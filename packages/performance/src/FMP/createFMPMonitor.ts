import { FMPOptions, FMPRecodeData } from '@rmonitor/types'
import { calculateFMP } from './calculateFMP'
import { throttleRequestAnimationFrame } from './throttleRequestAnimationFrame'
import { getDomLayoutScore } from './getDomLayoutScore'

export const createFMPMonitor = (options: FMPOptions) => {
  const MutationObserver = window.MutationObserver

  if (!MutationObserver) {
    return
  }
  const startTime = Date.now()

  const scoredData: FMPRecodeData[] = []

  const observeFMP = () => {
    const callback = throttleRequestAnimationFrame(() => {
      const bodyScore = getDomLayoutScore(document.body, 1, false, options?.exact)
      scoredData.push({
        domScore: bodyScore,
        time: Date.now() - startTime
      })
    })

    const observer = new MutationObserver(() => {
      callback?.runCallback()
    })

    observer.observe(document.body, {
      subtree: true,
      childList: true
    })

    return observer
  }

  const observer = observeFMP()

  const reportData = () => {
    // options.onReport({
    //   data: {
    //     fmp: calculateFMP(scoredData).time
    //   },
    //   eventType: EventType.FMP
    // })
    console.log(`FMP:${calculateFMP(scoredData).time}ms`)
    observer.disconnect()
  }

  // FMP 和 onload 事件并不密切相关，但它很可能在 onload 事件附近，所以我们延时一小段时间再报告
  window.onload = () =>{
    setTimeout(() => {
      reportData()
    }, 1000)
  }
}
