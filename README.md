<!--
 * @Descripttion: 
 * @version: 
 * @Author: ZhengXiaoRui
 * @email: zheng20010712@163.com
 * @Date: 2023-07-29 16:09:19
 * @LastEditors: ZhengXiaoRui
 * @LastEditTime: 2023-07-30 18:15:53
-->
# RMonitor

<div align="center">
    <img src="./public/logo.png" alt="rmonitor-logo" height="">
    <p>前端监控SDK</p>
</div>

**项目开始时间：2023.06，目前仍在迭代中**

**项目成员：小码大哈、1227010555、chenday7621**

### 这是个什么项目？

前端监控系统，支持React / Vue 项目无痛（目前还是非常痛的）接入，提供基础监控能力，并且支持开发者插入自定义hooks。

避免线上项目完全**裸奔**，帮助开发者时刻紧盯线上项目

### 为什么要做这个项目？

蚂蚁实习期间接触到监控系统，非常感兴趣，于是便想挑战一下自己做一个监控系统项目，主要想提高一下自己的技术水平，并且增加对前端项目监控指标的了解，能在平时开发过程中更加有意识地去注意一些问题，减少代码BUG、线上故障。

### 目前RMonitor提供怎样的能力？

[√] ✈️ **多种错误采集**：代码错误、Promise错误、异步错误、加载资源错误等

[√] ✈️ **白屏检测**：兼容骨架屏、非骨架屏，提供白屏修复机制

[√] ✈️ **性能数据**：FMP、FP、FCP、FSP、TTI、TTFB

[√] ✈️ **多种错误还原方式**：源码定位、播放录屏，用户行为栈

[√] ✈️ **多种上报方式**：默认web beacon，也支持图片打点，http上报

[√] ✈️ **灵活可自定义**：支持hooks注入

### 功能展示

（些许简陋，视频存放在public下）

错误捕获

![error-catch.gif](public/errorCatch.gif)

性能数据

![performance.gif](public/performance.gif)

录屏回放

![error-replay.gif](public/errorReplay.gif)

### 后续规划

08-09：提供后端模板代码

09-10：提供用户使用文档

后续可能考虑提供数据可视化网站，支持监控报警功能等（反正随便想，也不一定能做哈哈哈）

### 写一个监控系统的好处

对前端项目可能出现的错误更加敏感，减少编码过程中发生的错误

对项目的监控指标更熟悉，更好地定位已经发生的错误

面试吹牛逼（大概率会被锤烂）
