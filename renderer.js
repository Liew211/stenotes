// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

window.stenotesAPI
  .getSources({ types: ["screen", "window", "tab", "audio"] })
  .then(async (sources) => {
    console.log(sources);
    const source = sources[3];
    console.log(source);
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        mandatory: {
          chromeMediaSource: "desktop",
          echoCancellation: true,
        },
      },
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
    console.log(stream.getAudioTracks());
    const video = document.querySelector("video");
    video.srcObject = stream;
    video.onloadedmetadata = (e) => video.play();
  });
