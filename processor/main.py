from flask import Flask
from flask_socketio import SocketIO
from processor.transcribe import Transcriber
from processor.summarize import Summarizer
from datetime import datetime


app = Flask(__name__)
socketio = SocketIO(app)


@socketio.on('connect')
def on_connect():
    print("connected to server")
    socketio.emit("serverResponse", "First Push")
    socketio.start_background_task(target=main)


@socketio.on('disconnect')
def on_disconnect():
    print("disconnected from server")


def get_timestring():
    return str(datetime.now()).replace(' ', '_').replace(':', '')


def emit(key, value, log):
    log.write(f'{get_timestring()}\t{key}\t{value}\n')
    socketio.emit(key, {"data": value})


running = False
def main():
    global running
    if running:
        return
    running = True

    with open(f'logs/log_{get_timestring()}.txt', 'x') as log:
        for text_type, text in transcriber.transcribe():
            socketio.sleep(0)
            if text_type is Transcriber.TextType.SENTENCE:
                text = f'{text.capitalize()}.'
                summarizer.add_sentence(text)
                for summary in summarizer.get_summaries(num=1):
                    print(f"SUMMARY\t{summary}")
                    emit("summary", summary, log)
                emit("full", text, log)
            else:
                text = text.capitalize()
                emit("partial", text, log)


if __name__ == "__main__":
    from argparse import ArgumentParser
    parser = ArgumentParser()
    parser.add_argument('-d', '--device', type=str, required=True,
                        help='input device name')
    parser.add_argument('-m', '--model', type=str, required=True,
                        metavar='MODEL_PATH', help='Path to the model')
    parser.add_argument('-b', '--buffer-size', type=int, default=10,
                        help='size of summarization buffer')
    args = parser.parse_args()

    summarizer = Summarizer(args.buffer_size)
    transcriber = Transcriber(args.device, args.model)

    socketio.run(app,port=8000)
