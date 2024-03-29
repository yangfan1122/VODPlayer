# VODPlayer

VODPlayer是一款基于HTML5及其他第三方库的Web视频播放器。  

支持mp4、flv、m3u8及VR视频。  

[English](./README.md)  | 简体中文  

## 安装

```
npm install vodplayer
```

## 详细参数

##### 必填
参数 | 描述 | 默认值
---- | ----------- | -------
`videoSource` | 视频地址(mp4, flv, m3u8)

##### 可选
参数 | 描述 | 默认值
---- | ----------- | -------
`autoplay` | 自动播放 | false
`loop` | 循环播放 | 0
`muted` | 静音 | 0
`control` | 显示控制栏 | 1
`coverpic` | 视频封面地址 
`focusJson` | 视频看点数据, 例: '[{"cutImage":"","title":"highlight1","startPoint":"121","endPoint":"185","id":52},{"cutImage":"","title":"highlight2","startPoint":"221","endPoint":"285","id":533}]' 
`starttime` | 开始播放时刻 (autoplay 必须是 false)
`endtime` | 播放停止时刻. (autoplay 必须是 false)
`vr` | 全景视频 | 0
`threeJSPath` | [three.js](https://raw.githubusercontent.com/yangfan1122/VODPlayer/master/libs/three.js). 如vr为1, 必填.
`flvJSPath` | [flv.js](https://raw.githubusercontent.com/yangfan1122/VODPlayer/master/libs/flv.min.js). 如videoSource为.flv格式, 必填.
`hlsJSPath` | [hls.js](https://raw.githubusercontent.com/yangfan1122/VODPlayer/master/libs/hls.min.js). 如videoSource为.m3u8格式, 必填.
`requireJSPath` | [require.js](https://raw.githubusercontent.com/yangfan1122/VODPlayer/master/html-template/require.js). 如需要加载three.js/flv.js/hls.js, 必填.


## 用法

#### [Vue.js](https://github.com/yangfan1122/VODPlayer/tree/master/examples/vue-test)
  
Player.vue
```vue
<template>
  <div id="id" ref="player"></div>
</template>

<script>
import { VODPlayer } from 'vodplayer'  

export default {
  name: 'Player',

  mounted() {
    new VODPlayer(this.$refs.player, {
      autoplay:false,
      videoSource: '//www.w3school.com.cn/i/movie.mp4'
    })
  }
}
</script>

<style scoped>
#id {
  height: 400px;
}
</style>
```

#### [React](https://github.com/yangfan1122/VODPlayer/tree/master/examples/react-test)
App.js
```jsx harmony
import React from 'react';
import { VODPlayer } from "vodplayer";

function App() {
  let playerRef = null;

  function init() {
    new VODPlayer(playerRef, {
      autoplay:false,
      videoSource:"//www.w3school.com.cn/i/movie.mp4"
    })
  }

  return (
    <div className="App">
      <div ref={p => {playerRef = p; init();}}></div>

      <style>{`
        .App {
          height: 400px;
        }
      `}</style>
    </div>
  );
}

export default App;
```

## 贡献

VODPlayer是一个开源项目。欢迎大家提出意见及[报告问题](https://github.com/yangfan1122/VODPlayer/issues)。

## 感谢以下第三方库

[flv.js][flv-js]  
[hls.js][hls-js]  
[three.js][three-js]  


[flv-js]: https://github.com/Bilibili/flv.js
[hls-js]: https://github.com/video-dev/hls.js
[three-js]: https://github.com/mrdoob/three.js

