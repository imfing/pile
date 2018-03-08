<p align="center">
  <img src="https://raw.githubusercontent.com/mtobeiyf/pile/master/build/icons/pile.png" width="200px" alt="">
</p>

<p align="center">
  <a href="https://github.com/mtobeiyf/pile/releases">
    <img src="https://img.shields.io/github/release/mtobeiyf/pile.svg" alt="">
  </a>
  <a href="http://perso.crans.org/besson/LICENSE.html">
    <img src="https://img.shields.io/badge/License-GPLv3-green.svg" alt="">
  </a>
</p>

# Pile

> 有条不紊的管理你的工作与生活

[README](https://github.com/mtobeiyf/pile/blob/master/README.md) | [中文说明](https://github.com/mtobeiyf/pile/blob/master/README_zh.md)

<p align="center">
  <img src="https://s18.postimg.org/8xfca4ad5/sshot-1.png" width="600px" alt="">
</p>

## 为什么使用Pile?

我们都遇到过**文件凌乱不堪**，想找却找不到的情形。即便将文件分门别类放好了，在我们**切换到另一项事务**时寻找起来依旧不够便捷。好的网页、精彩的文章、资源等等，也许藏在你的收藏夹深处。
Pile就是一个让你更好的管理你的工作、学习、生活的强力工具。

## 使用说明

在开始使用之前，我先简要介绍一下如何更好使用Pile

### 标签

一个标签是存放你一个**项目/工作区**的资源的地方。在标签中你可以通过添加不同的**区域/卡片**来组织你需要用到的事务。

### 卡片

一个区域/卡片是存放特定东西的地方。当前由三种不同的卡片：

#### 应用/文件

你可以通过拖拽的方式添加应用、文件（夹）、快捷方式等，只需单击即可快速打开。右击还可以打开其所在文件夹。

<p align="center">
  <img src="https://s18.postimg.org/l6yd1ahux/pile11.gif" width="700px" alt="">
</p>

#### 笔记

网络资源（链接）、你的想法等，都可以在这里被记录下来，并快捷访问。支持**Markdown**！ :tada:

<p align="center">
  <img src="https://s18.postimg.org/gauq96hl5/pile2.jpg" width="700px" alt="">
</p>

#### 待办

与你这个项目相关的待办事项

<p align="center">
  <img src="https://s18.postimg.org/732hsukx5/pile3.jpg" width="700px" alt="">
</p>

## 特性

- 简易的拖拽操作
- 适用于多种应用场景
- 无尽的可能性，不论你是开发者、设计师、作家……
- 固定标签到桌面，让工作区触手可及
- 支持Markdown和emoji :smiley:

## 下载安装

进入 [发行页面](https://github.com/mtobeiyf/pile/releases)

下载并运行Setup的**.exe**文件，Pile将会自动安装好

或者你也可以下载便携版**zip**文件，
解压后运行`Pile.exe`.

## 技术相关

### Stack

- [Electron](https://electronjs.org/) : 框架
- [electron-vue](https://github.com/SimulatedGREG/electron-vue) : 脚手架
- [iView](https://www.iviewui.com/) : UI组件

### 开发配置

``` bash
# install dependencies
yarn # or npm install

# serve with hot reload at localhost:9080
yarn run dev # or npm run dev

# build electron application for production
yarn run build:dir # or npm run build:dir

```

---

## 版本记录

### 0.2.0

#### 新特性
- 托盘设置开机启动
- 在设置中检测新版本
- 固定当前标签到桌面以便快捷访问
- 自动恢复上次窗口大小及位置

#### 修复
- 错误的数据存储位置
- 每次运行窗口大小不一
- 错误的默认标签语言

### 0.1.1

#### 新特性
- 支持托盘图标
- 标签页重命名及排序
- 限制运行一个实例

#### 修复

- 右击菜单不显示的问题
- 设置按钮不正确的提示信息

### 0.1.0

- 第一个发行版

## 鸣谢

- [Vue.js](https://vuejs.org/)
- [vue-markdown](https://github.com/miaolz123/vue-markdown)
- [lowdb](https://github.com/typicode/lowdb)
- [Backlog](https://github.com/czytelny/backlog)

## License

Licensed under the [GPL v3.0](https://opensource.org/licenses/GPL-3.0) License.

Copyright (c) 2018 [Fing](http://imfing.com). 
All rights reserved.
