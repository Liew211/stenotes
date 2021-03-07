from keybert import KeyBERT
import wikipedia
from collections import deque


class Summarizer:
    def __init__(self, buffer_size):
        self.model = model = KeyBERT('distilbert-base-nli-mean-tokens')
        self.buffer_size = buffer_size
        self.buffer = deque()

    def add_sentence(self, sentence):
        self.buffer.append(sentence)
        while len(buffer) > self.buffer_size:
            self.buffer.popleft()

    def get_summaries(self, num):
        buffer_text = " ".join(self.buffer)
        keywords = self.model.extract_keywords(buffer_text, top_n=num)
        for keyword, _ in keywords:
            summary = self.get_summary(keyword)
            if summary is not None:
                yield summary

    def get_summary(self, keyword, length=128):
        try:
            search = wikipedia.search(keyword, results=1, suggestion=True)
            print(search[0][0])
            page = wikipedia.page(title=search[0][0])
            output = {
                "keyword": keyword,
                "title": search[0][0],
                "url": "https://en.wikipedia.org/wiki/" + search[0][0],
                "summary": f"{page.summary[:length]}..."
            }
            return output
        except:
            return None
            print(f"Error looking up keyword {keyword}")
