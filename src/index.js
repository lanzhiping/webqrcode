'use strict';

(() => {
    const camerasEl = document.getElementById('cameras-selector');
    const video = document.getElementById('video');
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    const scaningInterval = null;
    const result = document.getElementById('result');
    const startBtn = document.getElementById('start');
    const stopBtn = document.getElementById('stop');
    let cameras = [];

    camerasEl.onchange = (event) => {
        const deviceId = event.target.value;
        turnOnVideo(deviceId)
    }

    startBtn.onclick = function () {
        if (scaningInterval) {
            return;
        }

        scaningInterval = setInterval(() => {
            result.innerText = 'scaning';
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const imageData = ctx.getImageData(0, 0, 640, 480);
            const code = jsQR(imageData.data, 640, 480);

            if (code) {
                if (typeof code === 'object') {
                    result.innerText = 'code detected: ' + JSON.stringify(code);
                    return;
                }
                if (typeof code === 'string') {
                    result.innerText = 'code detected: ' + code;
                    return;
                }
                result.innerText = 'code detected: ' + code;
            }
        }, 1000);
    };

    stopBtn.onclick = function () {
        window.clearInterval(scaningInterval);
        result.innerText = 'stop scaning';
    };

    function turnOnVideo(deviceId) {
        navigator.mediaDevices.getUserMedia({ video: { deviceId } }).then(function (stream) {
            video.srcObject = stream;
            video.play();
        });
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            cameras = devices.filter(d => d.kind === 'videoinput');

            if (cameras.length) {
                cameras.forEach((cam, index) => {
                    const camOption = document.createElement('option');
                    camOption.innerText = cam.label || (index + 1);
                    camOption.setAttribute('value', cam.deviceId);
                    camerasEl.appendChild(camOption)
                });

                turnOnVideo(cameras[0].deviceId);
            } else {
                window.alert('No Camera Found')
            }
        });
    }

})();
