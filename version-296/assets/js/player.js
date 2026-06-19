const ready = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
};

const initPlayer = () => {
  const shell = document.querySelector("[data-player]");
  if (!shell) {
    return;
  }
  const video = shell.querySelector("video");
  const playButton = shell.querySelector("[data-play-button]");
  const overlay = shell.querySelector("[data-player-overlay]");
  const state = shell.querySelector("[data-player-state]");
  if (!video || !playButton || !overlay) {
    return;
  }
  const source = video.dataset.source;
  let started = false;
  let hls = null;
  const setState = (text) => {
    if (state) {
      state.textContent = text;
    }
  };
  const bindSource = () => {
    if (!source) {
      setState("播放暂不可用");
      return false;
    }
    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      if (!video.src) {
        video.src = source;
      }
      return true;
    }
    const HlsClass = window.Hls;
    if (HlsClass && HlsClass.isSupported()) {
      if (!hls) {
        hls = new HlsClass({
          enableWorker: true,
          lowLatencyMode: false,
          backBufferLength: 60
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      }
      return true;
    }
    setState("播放暂不可用");
    return false;
  };
  const start = async () => {
    if (!bindSource()) {
      return;
    }
    started = true;
    shell.classList.add("is-playing");
    try {
      await video.play();
    } catch (error) {
      shell.classList.remove("is-playing");
      setState("点击画面继续播放");
    }
  };
  playButton.addEventListener("click", start);
  overlay.addEventListener("click", start);
  video.addEventListener("click", () => {
    if (!started) {
      start();
    }
  });
  video.addEventListener("play", () => {
    shell.classList.add("is-playing");
  });
  video.addEventListener("pause", () => {
    if (!video.ended) {
      shell.classList.remove("is-playing");
      setState("继续播放");
    }
  });
  video.addEventListener("ended", () => {
    shell.classList.remove("is-playing");
    setState("重新播放");
  });
};

ready(initPlayer);
