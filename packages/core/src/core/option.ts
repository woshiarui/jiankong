import { InitOptions } from "@rmonitor/types/src/core/option";
import { _support } from "@rmonitor/utils";

/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-07-08 16:58:13
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-08 17:09:10
 */
export class Options {
    dsn = '';
    constructor() { }
}

const options = _support.options || (_support.options = new Options())

export function handleOptions(params: InitOptions) {

}

export { options }