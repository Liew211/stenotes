// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

window.stenotesAPI
	.getSources({ types: ["screen", "window", "tab", "audio"] })
	.then(async (sources) => {
		const platform = stenotesAPI.platform;
		let audioStream = null

		// Soundflower workaround for macOS audio access
		if (platform === "darwin") {
			let audDevice = (await navigator.mediaDevices.enumerateDevices())
				.filter(device => (device.kind == "audiooutput" && device.label == "Soundflower (2ch)" && device.deviceId != "default"));
			audioStream = await navigator.mediaDevices.getUserMedia({
				audio: {
					deviceId: audDevice[0].deviceId
				},
				video: false
			});
		}
		else {
			audioStream = await navigator.mediaDevices.getUserMedia({
				audio: {
					mandatory: { chromeMediaSource: "desktop" }
				},
				video: false
			});
		}
		const audio = document.querySelector("video");
		audio.srcObject = audioStream;
		audio.onloadedmetadata = (e) => audio.play();
	});
