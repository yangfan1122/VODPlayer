# VODPlayer

VODPlayer is a Web Video player which built from HTML5 and other third party libraries.  

Formats of video supported are mp4, flv, m3u8 and VR Video.

English | [简体中文](./README-zh_CN.md)  

## Install

```
npm install vodplayer
```

## Params
```vue
TODO
```

## Usage

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

## Contributing

VODPlayer is a open source project. I'm glad of any sugestions and bug report.

## Acknowledgments

[flv.js][flv-js]  
[hls.js][hls-js]  
[three.js][three-js]  


[flv-js]: https://github.com/Bilibili/flv.js
[hls-js]: https://github.com/video-dev/hls.js
[three-js]: https://github.com/mrdoob/three.js

