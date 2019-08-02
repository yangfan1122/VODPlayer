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
