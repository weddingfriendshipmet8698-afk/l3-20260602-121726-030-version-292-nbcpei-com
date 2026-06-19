import { H as Hls } from './hls-vendor-dru42stk.js';

export function initMoviePlayer(options) {
  const video = document.getElementById(options.videoId);
  const overlay = document.getElementById(options.overlayId);
  const button = document.getElementById(options.buttonId);
  const errorBox = document.getElementById(options.errorId);
  let hls = null;
  let attached = false;

  const fail = () => {
    if (errorBox) errorBox.classList.add('is-visible');
  };

  const attach = () => {
    if (attached || !video) return;
    attached = true;
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = options.source;
    } else if (Hls.isSupported()) {
      hls = new Hls({ enableWorker: true, lowLatencyMode: true });
      hls.loadSource(options.source);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data && data.fatal) fail();
      });
    } else {
      fail();
    }
  };

  const start = async () => {
    attach();
    if (!video) return;
    video.controls = true;
    if (overlay) overlay.classList.add('is-hidden');
    try {
      await video.play();
    } catch (err) {
      if (overlay) overlay.classList.remove('is-hidden');
    }
  };

  if (overlay) overlay.addEventListener('click', start);
  if (button) button.addEventListener('click', start);
  if (video) video.addEventListener('click', () => {
    if (video.paused) start();
  });
  window.addEventListener('pagehide', () => {
    if (hls) hls.destroy();
  });
}
