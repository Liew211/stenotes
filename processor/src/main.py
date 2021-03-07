#!/usr/bin/env python3

import argparse
import os
from queue import Queue
import sounddevice as sd
import vosk
import sys
import json
from contextlib import contextmanager


@contextmanager
def get_stream(args):
    stream = Queue()

    def callback(indata, frames, time, status):
        """This is called (from a separate thread) for each audio block."""
        if status:
            print(status, file=sys.stderr)
        stream.put(bytes(indata))

    with sd.RawInputStream(
        samplerate=args.samplerate,
        blocksize=8000,
        device=args.device,
        dtype='int16',
        channels=1,
        callback=callback,
    ):
        yield stream


def transcribe(stream, args):
    model = vosk.Model(args.model)
    rec = vosk.KaldiRecognizer(model, args.samplerate)
    while True:
        data = stream.get()
        if rec.AcceptWaveform(data):
            result = json.loads(rec.Result())
            text = result["text"]
            yield text
        else:
            pass
            # print(rec.PartialResult())


def listen(args):
    with get_stream(args) as stream:
        for text in transcribe(stream, args):
            print(text)


if __name__ == "__main__":
    def int_or_str(text):
        """Helper function for argument parsing."""
        try:
            return int(text)
        except ValueError:
            return text

    parser = argparse.ArgumentParser(add_help=False)
    parser.add_argument(
        '-l', '--list-devices', action='store_true',
        help='show list of audio devices and exit')
    args, remaining = parser.parse_known_args()
    if args.list_devices:
        print(sd.query_devices())
        parser.exit(0)
    parser = argparse.ArgumentParser(
        description=__doc__,
        formatter_class=argparse.RawDescriptionHelpFormatter,
        parents=[parser])
    parser.add_argument(
        '-f', '--filename', type=str, metavar='FILENAME',
        help='audio file to store recording to')
    parser.add_argument(
        '-m', '--model', type=str, metavar='MODEL_PATH',
        help='Path to the model')
    parser.add_argument(
        '-d', '--device', type=int_or_str,
        help='input device (numeric ID or substring)')
    parser.add_argument(
        '-r', '--samplerate', type=int, help='sampling rate')
    args = parser.parse_args(remaining)

    if args.samplerate is None:
        device_info = sd.query_devices(args.device, 'input')
        # soundfile expects an int, sounddevice provides a float:
        args.samplerate = int(device_info['default_samplerate'])

    listen(args)
