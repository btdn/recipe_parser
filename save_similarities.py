import pickle
import json

similarities = pickle.load( open( "save_similarities.p", "rb" ) ) 
jsonarray = json.dumps(similarities)
print jsonarray

