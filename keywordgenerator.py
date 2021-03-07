from keybert import KeyBERT

class KeyWordGenerator:
      def __init__(self):
            self.model = model = KeyBERT('distilbert-base-nli-mean-tokens')

      def get_keywords(self, doc):
            return self.model.extract_keywords(doc)
