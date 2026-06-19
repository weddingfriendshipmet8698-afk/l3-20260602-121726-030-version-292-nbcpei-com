(function () {
    function ready(fn) {
        if (document.readyState !== 'loading') {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }

    ready(function () {
        Array.prototype.slice.call(document.querySelectorAll('.video-wrap')).forEach(function (wrap) {
            var video = wrap.querySelector('video');
            var button = wrap.querySelector('.play-overlay');
            var url = wrap.getAttribute('data-play-src');
            var hls = null;
            var prepared = false;

            function prepare() {
                if (prepared || !video || !url) {
                    return;
                }
                prepared = true;
                if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = url;
                } else if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(url);
                    hls.attachMedia(video);
                } else {
                    video.src = url;
                }
            }

            function play() {
                prepare();
                var started = video.play();
                if (started && typeof started.catch === 'function') {
                    started.catch(function () {
                        wrap.classList.remove('is-playing');
                    });
                }
            }

            if (button) {
                button.addEventListener('click', function () {
                    wrap.classList.add('is-playing');
                    play();
                });
            }

            if (video) {
                video.addEventListener('play', function () {
                    wrap.classList.add('is-playing');
                });
                video.addEventListener('pause', function () {
                    wrap.classList.remove('is-playing');
                });
                video.addEventListener('ended', function () {
                    wrap.classList.remove('is-playing');
                });
            }

            window.addEventListener('beforeunload', function () {
                if (hls && hls.destroy) {
                    hls.destroy();
                }
            });
        });
    });
})();
