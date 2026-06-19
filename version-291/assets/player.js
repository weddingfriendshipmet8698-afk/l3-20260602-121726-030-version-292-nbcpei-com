import { H as Hls } from './hls-dru42stk.js';

document.addEventListener('DOMContentLoaded', function () {
    var player = document.querySelector('[data-hls-player]');
    if (!player) {
        return;
    }

    var video = player.querySelector('video');
    var button = player.querySelector('[data-player-button]');
    var status = player.querySelector('[data-player-status]');
    var source = player.dataset.videoSrc;
    var hlsInstance = null;

    function setStatus(message) {
        if (status) {
            status.textContent = message;
        }
    }

    function startPlayback() {
        if (!source || !video) {
            setStatus('未找到可用播放源。');
            return;
        }

        if (button) {
            button.classList.add('hidden');
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            video.play().catch(function () {
                setStatus('播放源已加载，请再次点击视频播放。');
            });
            setStatus('已使用浏览器原生 HLS 播放。');
            return;
        }

        if (Hls && Hls.isSupported()) {
            if (!hlsInstance) {
                hlsInstance = new Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });
                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);
                hlsInstance.on(Hls.Events.MANIFEST_PARSED, function () {
                    video.play().catch(function () {
                        setStatus('播放源已加载，请再次点击视频播放。');
                    });
                    setStatus('HLS 播放源已加载。');
                });
                hlsInstance.on(Hls.Events.ERROR, function (_, data) {
                    if (data && data.fatal) {
                        setStatus('播放加载遇到网络或格式问题，可刷新后重试。');
                    }
                });
            } else {
                video.play();
            }
            return;
        }

        video.src = source;
        setStatus('当前浏览器不支持 HLS.js，已尝试直接加载播放源。');
    }

    if (button) {
        button.addEventListener('click', startPlayback);
    }
});
