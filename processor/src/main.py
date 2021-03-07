import socketio
import eventlet
from src.transcribe import transcribe, TextType
# from src.summarize import Summarizer
from collections import deque
from threading import Thread


INPUT_DEVICE = 2
MODEL_PATH = "models/vosk-model-en-us-aspire-0.2"
BUFFER_SIZE = 16

sio = socketio.Server(async_mode='eventlet')
app = socketio.WSGIApp(sio)


@sio.event
def connect(sid, environ):
    print('connect ', sid)


@sio.event
def disconnect(sid):
    print('disconnect ', sid)


def main():
    # runner = web.AppRunner(app)
    # await runner.setup()
    # site = web.TCPSite(runner, 'localhost', 8080)
    # await site.start()

    # summarizer = Summarizer(buffer_size=BUFFER_SIZE)
    for text_type, text in transcribe(input_device=INPUT_DEVICE, model_path=MODEL_PATH):
        if text_type is TextType.SENTENCE:
            if text == "stop":
                exit(0)
            text = f'{text.capitalize()}.'
            # summarizer.add_sentence(text)
            sio.emit("full", {"data": text})
        else:
            sio.emit("partial", {"data": text})
        print(f"{text_type}\t{text}")
    exit(0)


if __name__ == "__main__":
    thread = Thread(target=main)
    thread.start()
    print("HELLO WORLD")
    eventlet.wsgi.server(eventlet.listen(('', 8000)), app)
