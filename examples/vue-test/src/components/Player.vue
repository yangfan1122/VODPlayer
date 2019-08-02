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
