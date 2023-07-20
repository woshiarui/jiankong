const workercode = () => {

  const calculateFMP = (scoredData) => {
    // 首先将打分结果基于时间排序(时间戳从小到大)
    scoredData.sort((a, b) => a.time - b.time)
  
    // 计算每两个时间戳之间的得分差值，变动最大的即为最终结果
    const initInfoValue = {
      maxDelta: -1,
      time: -1,
      prev: {
        time: 0,
        domScore: 0
      }
    }
  
    const res = scoredData.reduce((info, curr) => {
      const delta = curr.domScore - info.prev.domScore
      if (delta > info.maxDelta) {
        info.maxDelta = delta
        info.time = curr.time
      }
      info.prev = curr
      return info
    }, initInfoValue)
  
    return res
  }

  self.onmessage = function (e) {
    if (e.data){
        const { scoredData } = e.data
        if(Array.isArray(scoredData)){
          this.postMessage(calculateFMP(scoredData))
        }
    }
  }
}

let code = workercode.toString()
code = code.substring(code.indexOf('{')+1, code.lastIndexOf('}'))

const blob = new Blob([code], {type: 'application/javascript'})

const worker_script =  URL.createObjectURL(blob)


export default worker_script