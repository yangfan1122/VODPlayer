# VODPlayer

VODPlayer是一款基于HTML5及其他第三方库的Web视频播放器。  

支持mp4、flv、m3u8及VR视频。  

[English](./README.md)  | 简体中文  

## 安装

```
npm install vodplayer
```

## 详细参数
```vue
TODO
```

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

VODPlayer是一个开源项目。欢迎大家提出意见及报告问题。

## 感谢以下第三方库

[flv.js][flv-js]  
[hls.js][hls-js]  
[three.js][three-js]  


[flv-js]: https://github.com/Bilibili/flv.js
[hls-js]: https://github.com/video-dev/hls.js
[three-js]: https://github.com/mrdoob/three.js

