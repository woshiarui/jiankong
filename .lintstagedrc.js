/*
 * @Descripttion:
 * @version:
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-06-03 20:14:49
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-06-03 20:15:03
 */
module.exports = {
  '**/*.{vue,js,jsx}': ['eslint --fix', 'prettier --write'],
  '**/*.{css,less,scss}': ['stylelint', 'prettier --write'],
  '**/*.{json,html}': ['prettier --write']
}
