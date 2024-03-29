export function isExistProperty(obj: any, key: any) {
    return Object.prototype.hasOwnProperty.call(obj, key)
}

function isType(type: any) {
    return function (value: any): boolean {
        return Object.prototype.toString.call(value) === `[object ${type}]`;
    };
}

export const variableType = {
    isNumber: isType('Number'),
    isString: isType('String'),
    isBoolean: isType('Boolean'),
    isNull: isType('Null'),
    isUndefined: isType('Undefined'),
    isSymbol: isType('Symbol'),
    isFunction: isType('Function'),
    isObject: isType('Object'),
    isArray: isType('Array')
}

export function isError(error: Error) {
    switch (Object.prototype.toString.call(error)) {
        case '[object Error]':
            return true
        case '[object Exception]':
            return true
        case '[object DOMException]':
            return true
        default:
            return false
    }
}