from enum import Enum
import json
import logging
from queue import Queue
import sounddevice as sd
import vosk


class Transcriber:
    class TextType(Enum):
        PARTIAL = "PARTIAL"
        SENTENCE = "SENTENCE"

    def __init__(self, input_device, model_path):
        device_info = sd.query_devices(input_device, 'input')
        self.samplerate = int(device_info['default_samplerate'])
        self.input_device = input_device
        self.model = vosk.Model(model_path)
        self.recognizer = vosk.KaldiRecognizer(self.model, self.samplerate)


    def transcribe(self):
        stream = Queue()

        def callback(indata, frames, time, status):
            """This is called (from a separate thread) for each audio block."""
            if status:
                logging.warning(status)
            stream.put(bytes(indata))

        with sd.RawInputStream(
            samplerate=self.samplerate,
            blocksize=8000,
            device=self.input_device,
            dtype='int16',
            channels=1,
            callback=callback,
        ):
            while True:
                data = stream.get()
                if self.recognizer.AcceptWaveform(data):
                    result = json.loads(self.recognizer.Result())
                    sentence = result["text"]
                    if len(sentence) > 0:
                        yield (Transcriber.TextType.SENTENCE, sentence)
                else:
                    result = json.loads(self.recognizer.PartialResult())
                    partial = result["partial"]
                    if len(partial) > 0:
                        yield (Transcriber.TextType.PARTIAL, partial)
