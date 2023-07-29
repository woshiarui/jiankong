import { EVENT_TYPES } from '@rmonitor/common';
import { BasePlugin, SdkBase, RecordScreenOption } from '@rmonitor/types'
import { _support, generateUUID, validateOption } from '@rmonitor/utils';
import { handleScreen } from './recordscreen';
/*
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-06-03 18:55:54
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-29 16:56:41
 */
export default class RecordScreen extends BasePlugin {
    recordScreentime = 10
    recordScreenTypeList: string[] = [
        EVENT_TYPES.ERROR,
        EVENT_TYPES.UNHANDLED_REJECTION,
        EVENT_TYPES.RESOURCE,
        EVENT_TYPES.FETCH,
        EVENT_TYPES.XHR,
    ]

    constructor(params = {} as RecordScreenOption) {
        super(EVENT_TYPES.RECORDSCREEN)
        this.type = EVENT_TYPES.RECORDSCREEN
        const { recordScreenTypeList, recordScreentime } = params;
        (this.recordScreentime = recordScreentime);
        (this.recordScreenTypeList = recordScreenTypeList);
    }

    core({ transportData, options }: SdkBase) {
        options.silentRecordScreen = true;
        options.recordScreenTypeList = this.recordScreenTypeList
        _support.recordScreenId = generateUUID()
        handleScreen(transportData, this.recordScreentime)
    }

    transform(data: any): void {
        return data
    }

    bindOptions(params: RecordScreenOption) {
        const { recordScreenTypeList, recordScreentime } = params;
        validateOption(recordScreentime, 'recordScreentime', 'number') &&
            (this.recordScreentime = recordScreentime);
        validateOption(recordScreenTypeList, 'recordScreenTypeList', 'array') &&
            (this.recordScreenTypeList = recordScreenTypeList);
    }
}