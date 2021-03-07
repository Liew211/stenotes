from keybert import KeyBERT
import wikipedia

class KeyWordGenerator:
      def __init__(self):
            self.model = model = KeyBERT('distilbert-base-nli-mean-tokens')

      def get_keywords(self, doc, num):
            keywords = self.model.extract_keywords(doc, top_n=num)
            return [keyword[0] for keyword in keywords]

      def get_summary(self, word):
            try:
                  search = wikipedia.search(word, results=1, suggestion=True)
                  print(search[0][0])
                  page = wikipedia.page(title=search[0][0])
                  output = {
                        "title": search[0][0]
                        "url": "https://en.wikipedia.org/wiki/" + search[0][0],
                        "summary": page.summary[0:100] + "..."
                  }
                  return output
            except:
                  return {}
                  print("error")
            