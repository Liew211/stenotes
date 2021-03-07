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
        self.input_device = input_device
        self.model = vosk.Model(model_path)
        device_info = sd.query_devices(self.input_device, 'input')
        self.samplerate = int(device_info['default_samplerate'])

    def transcribe(self):
        rec = vosk.KaldiRecognizer(self.model, self.samplerate)

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
                if rec.AcceptWaveform(data):
                    result = json.loads(rec.Result())
                    sentence = result["text"]
                    if len(sentence) > 0:
                        yield (Transcriber.TextType.SENTENCE, sentence)
                else:
                    result = json.loads(rec.PartialResult())
                    partial = result["partial"]
                    if len(partial) > 0:
                        yield (Transcriber.TextType.PARTIAL, partial)
