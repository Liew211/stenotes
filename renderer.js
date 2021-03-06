// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

window.stenotesAPI
  .getSources({ types: ["window", "screen"] })
  .then(async (sources) => {
    const source = sources[0];
    console.log(source);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: source.id,
            minWidth: 1280,
            maxWidth: 1280,
            minHeight: 720,
            maxHeight: 720,
          },
        },
      });
      handleStream(stream);
    } catch (e) {
      handleError(e);
    }

    function handleStream(stream) {
      const video = document.querySelector("video");
      video.srcObject = stream;
      video.onloadedmetadata = (e) => video.play();
    }

    function handleError(e) {
      console.log(e);
    }
  });
