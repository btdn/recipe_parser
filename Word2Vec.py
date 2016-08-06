from gensim.models import word2vec
import pickle

model = word2vec.Word2Vec.load_word2vec_format('glove.6B.50d.txt', binary=False)

cookingVerbs = pickle.load( open( "save_cooking_verb.p", "rb" ) ) 
verbSimilarities = {}

for keyA in cookingVerbs:
	verbSimilarities[keyA] = {}
	for keyB in cookingVerbs:
		verbSimilarities[keyA][keyB] = model.similarity(keyA.lower(), keyB.lower())
		print keyA, ", ", keyB, ": ", verbSimilarities[keyA][keyB]

pickle.dump( verbSimilarities, open( "save_similarities.p", "wb" ) )
