import math
import mysql.connector
import re
from copy import deepcopy
from sets import Set
import pickle
import inflect
import spacy
import unicodedata

nlp = spacy.load('en')

p = inflect.engine()

config = {
  'user': 'root',
  'password': 'root',
  'host': 'localhost',
  'database': 'mysql',
  'raise_on_warnings': True,
}

link = mysql.connector.connect(**config)
cursor = link.cursor()
cookingDescriptions = {'cut', 'small', 'medium', 'sliced', 'large', 'very', 'more', 'squeezed', 'freshly', 'chopped', 'peeled', 'cored', 'ground', 'finely'}
cookingMeasurements = {'pinch', 'dash', 'by', 'of', 'into', 'or', 'for', 'to', 'can', 'jar', 'and', 'with', 'teaspoon', 'teaspoons', 'tsp', 'tsp.', 'tablespoon', 'tablespoons', 'tbsp', 'tbsp.', 'cup', 'cups', 'ounce', 'ounces', 'oz', 'oz.', 'gram', 'grams'}
compoundIngredientDict = pickle.load( open( "save_compound_ingredients.p", "rb" ) )
ingredientSet = Set(pickle.load( open( "save_ingredient_list.p", "rb" ) ) )
cookingVerbSet = Set(pickle.load( open( "save_cooking_verb.p", "rb" ) ) )

print "Opening the file..."
target = open('output-jul-8-2016.txt', 'w')
target.truncate()

def extractIngredientKeysPruning(ingredient):
	ingredientsCopy = deepcopy(ingredient)
	for x in range(len(ingredient)):
		wordChunk = ingredient[x]
		if len(wordChunk) > 0:
			if re.search('\d+(.\d+)?', wordChunk):
				ingredientsCopy.remove(wordChunk)
			elif re.search('\(|\)', wordChunk):
				ingredientsCopy.remove(wordChunk)
			elif wordChunk in cookingMeasurements:
				ingredientsCopy.remove(wordChunk)
			elif wordChunk in cookingDescriptions:
				ingredientsCopy.remove(wordChunk)
	return Set(ingredientsCopy)

def cleanRawString(wordChunk):
	wordChunk = wordChunk.replace("'", "")
	wordChunk = wordChunk.replace(",", "")
	wordChunk = wordChunk.replace("[", "")
	wordChunk = wordChunk.replace("]", "")
	wordChunk = wordChunk.replace('"', '')
	wordChunk = wordChunk.replace('(', '')
	wordChunk = wordChunk.replace(')', '')	
	wordChunk = wordChunk.strip()
	wordChunk = wordChunk.lower()
	if p.singular_noun(wordChunk):
		wordChunk = p.singular_noun(wordChunk)
	return wordChunk	

def extractIngredientKeys(ingredient):
	flag = True
	ingredient = [str(x) for x in ingredient]
	compoundKeys = Set([])
	for x in range(len(ingredient)):
		ingredient[x] = cleanRawString(ingredient[x])
		elem = ingredient[x]
		if elem in compoundIngredientDict:
			extraKeys = compoundIngredientDict[elem]
			if Set(extraKeys) & Set(ingredient):
				compoundKeys = (Set(extraKeys) & Set(ingredient))
				compoundKeys.add(elem)
				flag = False
			else:
				compoundKeys.add(elem)
				flag = False
		if elem in ingredientSet:
			compoundKeys.add(elem)
			flag = False
	if flag:
		return extractIngredientKeysPruning(ingredient)
	else:
		return compoundKeys

def extractInstructionKeys(instruction):
	splitInstruction = [cleanRawString(str(x.encode('ascii','ignore'))) for x in instruction.split()]
	print splitInstruction
	return Set(splitInstruction)

def extractInstructionLabel(instruction, labels):
	print instruction
	flag = True
	backup = []
	assured = []
	for wordChunk in instruction:
		if wordChunk.upper() in cookingVerbSet:
			if wordChunk in labels:
				assured.append(wordChunk)
			else:
				backup.append(wordChunk)
	if len(assured) > 0:
		return assured
	elif len(backup) > 0:
		return backup
	else:
		return labels

def print_fine_pos(token):
    return (token.tag_)

def pos_tags(sentence):
    tokens = nlp(sentence)
    tags = []
    for tok in tokens:
    	if 'V' in str(print_fine_pos(tok)):
        	tags.append(cleanRawString(str(tok)))
    return Set(tags)

query = ("SELECT ingredients, recipe_instructions FROM cooking_recipes_reformat WHERE type='sandwich'") 
cursor.execute(query)
results = cursor.fetchall()

for rawIngr, rawInstr in results:
	ingredients = []
	instructions = []
	ingrArr = rawIngr.split(', u')
	for x in ingrArr:
		ingredients.append(extractIngredientKeys(x.split()))
	lineInstructions = rawInstr.split('.')
	for instruction in lineInstructions:
		labels = pos_tags(instruction)
		instruction = unicodedata.normalize('NFKD', instruction).encode('ascii','ignore')
		target.write(instruction + "\n")
		instructionKeys = extractInstructionKeys(instruction)
		finalLabel = extractInstructionLabel(instructionKeys, labels)
		target.write(str(finalLabel) + "\n")
	 	for ingredient in ingredients:
	 		if (ingredient & instructionKeys):
	 			target.write("Associated Ingredients: " + str(ingredient & instructionKeys) + "\n")
		target.write("####################################" + "\n")
target.close()

