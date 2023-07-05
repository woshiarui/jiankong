export function parseUrlToObj(url: string) {
    if (!url) return {}
    //gpt生成正则
    const match = url.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
    if (!match) {
        return {}
    }
    const query = match[6] || ''
    const fragment = match[8] || ''
    return {
        host: match[4],
        path: match[5],
        protocol: match[2],
        relative: match[5] + query + fragment
    }
}