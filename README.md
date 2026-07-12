# 听见北京 / Beijing Between Axis and Breath

一个以声音地图为核心的极简北京城市介绍网页，通过图像、滚动与声音交互呈现北京的历史秩序、胡同烟火、现代节奏与夜晚气息。

## 选题方向

方向 B：城市介绍

## 主要功能说明

本项目是一个可在浏览器中直接访问的单页交互网页，围绕"北京城市介绍"展开。页面包含概况、地标与风景、人文与特色、美食与生活、未来寄语五个板块，并加入"声音地图"互动模块。用户点击不同城市主题卡片，即可播放对应声音、点亮城市气质并推进探索进度。声音通过 Web Audio API 实时合成，无需外部音频文件。整体采用极简排版、宫墙红点缀和轻量动效，适合部署到 GitHub Pages 进行展示。

### 核心特色

- **声音地图互动**：4 个声音卡片（中轴北京、胡同北京、都市北京、夜色北京），点击收集，进度 0/4 → 4/4
- **Web Audio API 合成**：4 种环境音效完全由代码实时合成，零版权风险
- **极简东方美学**：米白底色、宫墙红点缀、衬线标题、大量留白
- **响应式布局**：手机和电脑都能正常浏览
- **滚动动效**：文字淡入、卡片轻浮、进度条平滑增长

## 启动方式

双击 `index.html`，或通过 GitHub Pages 链接访问。

## 技术栈

- HTML5
- CSS3（CSS 变量、Grid、Flexbox、clamp() 流体排版）
- JavaScript（Web Audio API、IntersectionObserver）
- 无框架依赖，纯原生实现

## 文件结构

```
beijing-sound-map/
├── index.html              # 主页面
├── style.css               # 样式
├── script.js               # 交互逻辑
├── assets/
│   ├── images/             # SVG 占位图（可替换为自摄照片）
│   └── audio/              # 无需音频文件（Web Audio 合成）
├── README.md               # 项目说明
├── reflection.md           # 复盘文档
└── .impeccable.md          # 设计上下文
```

## WorkBuddy 协作

本项目使用 WorkBuddy (GLM-5.2) 作为 AI 开发伙伴完成，协作过程涵盖：
- 需求分析与项目规划
- 设计上下文建立（Impeccable 技能）
- HTML/CSS/JS 代码生成
- Web Audio API 音效合成方案
- 视觉风格迭代与调试
