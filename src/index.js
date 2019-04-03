'use strict';

(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    const camerasEl = document.getElementById('cameras-selector');
    const video = document.getElementById('video');
    const canvas = document.createElement('canvas');
    const result = document.getElementById('result');
    const startBtn = document.getElementById('start');
    const stopBtn = document.getElementById('stop');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    let scaningInterval = null;

    function scan() {
        const { width, height } = canvas;
        ctx.drawImage(video, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const code = jsQR(imageData.data, width, height);

        if (code) {
            const displayCode = typeof code === 'object'
                ? `code detected: ${JSON.stringify(code)}`
                : `code detected: ${code}`;

            result.innerText = displayCode;
        }
    }

    function renderCameraToVideo(deviceId) {
        const constraints = {
            video: {
                width: 640,
                height: 480,
                facingMode: isMobile ? { exact: "environment" } : undefined,
                deviceId
            }
        }
        navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
            video.srcObject = stream;
            video.play();
        });
    }

    function onCameraSelectorChange(event) {
        const deviceId = event.target.value;

        renderCameraToVideo(deviceId);
    }

    function onStartBtnClick() {
        if (scaningInterval) {
            return;
        }
        window.clearInterval(scaningInterval);
        scaningInterval = setInterval(() => {
            result.innerText = 'scaning';
            scan();
        }, 1000);
    }

    function onStopBtnClick() {
        window.clearInterval(scaningInterval);
        result.innerText = 'stop scaning';
        scaningInterval = null;
    }

    camerasEl.onchange = onCameraSelectorChange;
    startBtn.onclick = onStartBtnClick;
    stopBtn.onclick = onStopBtnClick;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
            .enumerateDevices()
            .then((devices) => devices.filter(d => d.kind === 'videoinput'))
            .then((cameras) => {
                cameras.forEach((cam, index) => {
                    const camOption = document.createElement('option');
                    camOption.innerText = cam.label || (index + 1).toString();
                    camOption.setAttribute('value', cam.deviceId);
                    camerasEl.appendChild(camOption)
                });
                return cameras[0];
            })
            .then((firstCameras) => {
                if (firstCameras) {
                    renderCameraToVideo(firstCameras.deviceId);
                } else {
                    window.alert('No Camera Found')
                }
            });
    }

})();
