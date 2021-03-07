from flask import Flask
from flask_socketio import SocketIO
# import eventlet
# eventlet.monkey_patch()
from processor.src.transcribe import transcribe, TextType
# from src.summarize import Summarizer
from collections import deque
from threading import Thread


INPUT_DEVICE = 3
MODEL_PATH = "processor/models/vosk-aspire"
BUFFER_SIZE = 16
print("here")

app = Flask(__name__)
socketio = SocketIO(app)


@socketio.on('connect')
def on_connect():
    print("connected server!!")
    socketio.emit("serverResponse", "First Push")
    socketio.start_background_task(target=main)
    

@socketio.on('disconnect')
def on_disconnect():
    print("disconnected server!!")



queue = []
print("before main")
def main():
    
    for text_type, text in transcribe(input_device=INPUT_DEVICE, model_path=MODEL_PATH):
        socketio.sleep(0)
        if text_type is TextType.SENTENCE:
            if text == "stop":
                exit(0)
            text = f'{text.capitalize()}.'
            # summarizer.add_sentence(text)
            socketio.emit("full", {"data": text})
            queue.append({"full": {"data": text}})
        else:
            socketio.emit("partial", {"data": text})
            queue.append({"partial": {"data": text}})
        print(f"{text_type}\t{text}")
    exit(0)


if __name__ == "__main__":
    socketio.run(app,port=8000)
    
    print("HELLO WORLD")
    # eventlet.wsgi.server(eventlet.listen(('', 8000)), app)