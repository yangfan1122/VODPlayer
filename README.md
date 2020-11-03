# VODPlayer

VODPlayer is a Web Video player which built from HTML5 and other third party libraries.  

Formats of video supported are mp4, flv, m3u8 and VR Video.

English | [简体中文](./README-zh_CN.md)  

## Install

```
npm install vodplayer
```

## Params

##### Required
- videoSource - The URL of Video file(mp4, flv, m3u8).
##### Optional
- autoplay - true: Playback automatically. Default is false.
- loop - 1: Continuous loop of video. Default is 0.
- muted - 1: mute. Default is 0.
- control - 0: Hide the control panel. Default is 1.
- coverpic - The URL of cover picutre.
- focusJson - Highlights of the video, e.g. '[{"cutImage":"","title":"highlight1","startPoint":"121","endPoint":"185","id":52},{"cutImage":"","title":"highlight2","startPoint":"221","endPoint":"285","id":533}]'
- starttime - Playback at this time. (autoplay must be false)
- endtime - Stop video at this time. (autoplay must be false)
- vr - 1: Panoramic Video. Default is 0.
- threeJSPath - The URL of [three.js](https://raw.githubusercontent.com/yangfan1122/VODPlayer/master/libs/three.js). If vr is 1, required.
- flvJSPath - The URL of [flv.js](https://raw.githubusercontent.com/yangfan1122/VODPlayer/master/libs/flv.min.js). If videoSource is .flv, required.
- hlsJSPath - The URL of [hls.js](https://raw.githubusercontent.com/yangfan1122/VODPlayer/master/libs/hls.min.js). If videoSource is .m3u8, required.
- requireJSPath - The URL of [require.js](https://raw.githubusercontent.com/yangfan1122/VODPlayer/master/html-template/require.js). If needing to load three.js/flv.js/hls.js, required.


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

VODPlayer is a open source project. I'm glad of any sugestions and [bug report](https://github.com/yangfan1122/VODPlayer/issues).

## Acknowledgments

[flv.js][flv-js]  
[hls.js][hls-js]  
[three.js][three-js]  


[flv-js]: https://github.com/Bilibili/flv.js
[hls-js]: https://github.com/video-dev/hls.js
[three-js]: https://github.com/mrdoob/three.js

