/*
 * @Descripttion:
 * @version:
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-07-18 00:10:03
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-23 15:27:39
 */
/* eslint-disable no-undef */
import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import { uglify } from 'rollup-plugin-uglify'
import dts from 'rollup-plugin-dts'
import fs from 'fs'
import path from 'path'
const packagesDir = path.resolve(__dirname, 'packages')
const packageFiles = fs.readdirSync(packagesDir)
function output(path) {
  return [
    {
      input: [`./packages/${path}/src/index.ts`],
      output: [
        {
          file: `./packages/${path}/dist/index.cjs.js`,
          format: 'cjs',
          sourcemap: true
        },
        {
          file: `./packages/${path}/dist/index.esm.js`,
          format: 'esm',
          sourcemap: true
        },
        {
          file: `./packages/${path}/dist/index.js`,
          format: 'umd',
          name: 'rmonitor',
          sourcemap: true
        },
        {
          file: `./packages/${path}/dist/index.min.js`,
          format: 'umd',
          name: 'rmonitor',
          sourcemap: true,
          plugins: [uglify()]
        }
      ],
      plugins: [
        typescript({
          tsconfigOverride: {
            compilerOptions: {
              module: 'ESNext',
              lib: ['es2016', 'dom'],
              jsx: 'react'
            }
          },
          useTsconfigDeclarationDir: true
        }),
        resolve(),
        commonjs(),
        json()
      ]
    },
    {
      input: `./packages/${path}/src/index.ts`,
      output: [
        { file: `./packages/${path}/dist/index.cjs.d.ts`, format: 'cjs' },
        { file: `./packages/${path}/dist/index.esm.d.ts`, format: 'esm' },
        { file: `./packages/${path}/dist/index.d.ts`, format: 'umd' },
        { file: `./packages/${path}/dist/index.min.d.ts`, format: 'umd' }
      ],
      plugins: [dts()]
    }
  ]
}
export default [...packageFiles.map(path => output(path)).flat()]
