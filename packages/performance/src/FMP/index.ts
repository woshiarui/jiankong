import { calculateFMP } from './utils/calculateFMP';
import { throttleRequestAnimationFrame } from './utils/throttleRequestAnimationFrame'
import { getDomLayoutScore } from './utils/getDomLayoutScore'
import worker_script from './webworker'

export interface FMPRecodeData {
  time: number;
  domScore: number;
}

interface FMPOptions {
  exact?: boolean
}

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
    if(window.Worker){

      const worker = new Worker(worker_script)
      worker.postMessage({scoredData})
      worker.onmessage = function(e) {
        console.log(`FMP:${e.data.time}ms`)
        worker.terminate()
      }
    } else {
      console.log(`FMP:${calculateFMP(scoredData)}ms`)
    }
    observer.disconnect()
  }

  // FMP 和 onload 事件并不密切相关，但它很可能在 onload 事件附近，所以我们延时一小段时间再报告
  window.onload = () =>{
    setTimeout(() => {
      reportData()
    }, 1000)
  }
}
