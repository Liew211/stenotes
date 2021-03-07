from queue import Queue
import sounddevice as sd
import vosk
import logging
import json
from enum import Enum
import sys


class TextType(Enum):
    PARTIAL = "PARTIAL"
    SENTENCE = "SENTENCE"


def transcribe(input_device, model_path):
    device_info = sd.query_devices(input_device, 'input')
    samplerate = int(device_info['default_samplerate'])

    model = vosk.Model(model_path)
    rec = vosk.KaldiRecognizer(model, samplerate)

    stream = Queue()

    def callback(indata, frames, time, status):
        """This is called (from a separate thread) for each audio block."""
        if status:
            logging.warning(status)
        stream.put(bytes(indata))


    with sd.RawInputStream(
        samplerate=samplerate,
        blocksize=8000,
        device=input_device,
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
                    yield (TextType.SENTENCE, sentence)
            else:
                result = json.loads(rec.PartialResult())
                partial = result["partial"]
                if len(partial) > 0:
                    yield (TextType.PARTIAL, partial)


if __name__ == "__main__":
    import argparse

    def int_or_str(text):
        """Helper function for argument parsing."""
        try:
            return int(text)
        except ValueError:
            return text

    print(sd.query_devices())
    parser = argparse.ArgumentParser()
    parser.add_argument('-d', '--device', type=int_or_str,
                        help='input device (numeric ID or substring)')
    parser.add_argument('-m', '--model', type=str,
                        metavar='MODEL_PATH', help='Path to the model')
    args = parser.parse_args()

    for text_type, text in transcribe(args.device, args.model):
        print(f"{text_type}\t{text}")
