# stenotes

Transcribes any audio from your computer!

## Setup

1. download models from https://alphacephei.com/vosk/models and unzip them in `models`
1. create a virtual environment in the root folder of this repository: `python -m venv env`
1. activate it
1. `pip install -r requirements.txt`

Required args:

- `--model models/folder_containing_model`
- `--device "name of your input device (like Soundflower)"`

To find device names, run the following in a Python shell:

```py
import sounddevice as sd
print(sd.query_devices())
```
