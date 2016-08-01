from gensim.models import word2vec
import pickle

model = word2vec.Word2Vec.load_word2vec_format('glove.6B.50d.txt', binary=False)

