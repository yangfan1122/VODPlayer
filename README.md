# VOD Player

VODPlayer is a Web Video player which built from HTML5 and other third party libraries.

## Getting Started

Add these tags to your document's <head>:

```html
<script data-main="https://cdn.rawgit.com/yangfan1122/docs/gh-pages/assets/vodplayerjs.js" src="https://cdn.rawgit.com/yangfan1122/docs/gh-pages/assets/require.js"></script>
<link href="https://cdn.rawgit.com/yangfan1122/docs/gh-pages/assets/vodplayercss.css" type="text/css" rel="stylesheet">
```

then add these tags to your document's <body>:

```html
<div id="vodcontainer"></div>
<script>
require(["vodplayer"], function(VODPlayer) {
    VODPlayer.VODPlayer(document.getElementById("vodcontainer"), {
        autoplay:false,
        videoSource:"http://www.w3school.com.cn/i/movie.mp4"
    });
});
</script>
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

