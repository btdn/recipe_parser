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

#print "Opening the file..."
#target = open('output-jul-8-2016.txt', 'w')
#target.truncate()

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
	return ingredientsCopy

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
	return splitInstruction

def extractInstructionLabel(instruction, labels):
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
		return list(labels)

def print_fine_pos(token):
    return (token.tag_)

def pos_tags(sentence):
    tokens = nlp(sentence)
    tags = []
    for tok in tokens:
    	if 'V' in str(print_fine_pos(tok)):
        	tags.append(cleanRawString(str(tok)))
    return Set(tags)

#set of tuples of used ingredients + the new ingredient

query = ("SELECT name, type, ingredients, recipe_instructions FROM cooking_recipes_reformat WHERE type='sandwich'") 
cursor.execute(query)
results = cursor.fetchall()

for name, type, rawIngr, rawInstr in results:
	ingredients = []
	instructions = []

	#INSERT INTO TABLE: recipe
	query = ("INSERT INTO recipes(recipe_name, type) VALUES(%s, %s)")
	cursor.execute(query, (name, type))
	link.commit()
	query = ("SELECT LAST_INSERT_ID()")
	cursor.execute(query)
	recipe_id = cursor.fetchone()[0]

	#pre-processing so that each block-text is split accordingly

	ingrArr = rawIngr.split(', u')
	for x in ingrArr:
		#INSERT INTO TABLE: ingredients
		ingredient = extractIngredientKeys(x.split())
		query = ("INSERT INTO ingredients(recipe_id, text_name) VALUES(%s, %s)")
		cursor.execute(query, (recipe_id, ' '.join(ingredient)))
		link.commit()
		ingredients.append(extractIngredientKeys(x.split()))
	lineInstructions = rawInstr.split('.')

	#For each line of instructions
	for instruction in lineInstructions:
		labels = pos_tags(instruction)
		instruction = unicodedata.normalize('NFKD', instruction).encode('ascii','ignore')
		#target.write(instruction + "\n")
		#INSERT INTO TABLE: steps
		query = ("INSERT INTO steps(recipe_id, text_line) VALUES(%s, %s)")
		cursor.execute(query, (recipe_id, instruction))
		link.commit()
		query = ("SELECT LAST_INSERT_ID()")
		cursor.execute(query)
		step_id = cursor.fetchone()[0]

		instructionKeys = extractInstructionKeys(instruction)
		finalLabel = extractInstructionLabel(instructionKeys, labels)
		#target.write("Ingredients: " + str(ingredients) + "\n")
		compoundFlag = False
		
		#target.write(str(finalLabel) + "\n")
		usedIngredients = [0] * len(ingredients)
		finalAssociations = {}
	 	currIndex = 0
	 	rank = 0
	 	currAction ='#no-action#'
	 	finalAssociations[currAction] = []
	 	for x in range(len(instructionKeys)):
	 		wordChunk = instructionKeys[x]
	 		associatedIngredient = []

	 		if compoundFlag:
	 			compoundFlag = False
	 			continue
	 		if currIndex < len(finalLabel) and wordChunk is finalLabel[currIndex]:
	 			currIndex += 1
	 			query = ("INSERT INTO node(recipe_id, step_id, class, rank, text) VALUES(%s, %s, %s, %s, %s)")
				cursor.execute(query, (recipe_id, step_id, 'action', rank, wordChunk))
				link.commit()
				rank += 1
	 			finalAssociations[wordChunk] = []
	 			currAction = wordChunk
	 		for y in range(len(ingredients)):
	 			ingredient = ingredients[y]
	 			ingrSet = Set(ingredient)
	 			if wordChunk in ingrSet and not usedIngredients[y]:
	 				associatedIngredient.append(wordChunk)
	 				if len(ingrSet) > 1:
	 					if (x < len(instructionKeys)-1 and instructionKeys[x+1] in ingrSet):
	 						associatedIngredient.append(instructionKeys[x+1]) 
	 						compoundFlag = True
	 				usedIngredients[y] = 1
	 				break

	 		if (len(associatedIngredient) > 0):
	 			print "Associated Ingredients: " + str(associatedIngredient)
	 			query = ("INSERT INTO node(recipe_id, step_id, class, rank, text) VALUES(%s, %s, %s, %s, %s)")
				cursor.execute(query, (recipe_id, step_id, 'ingredient', rank, ' '.join(associatedIngredient)))
				link.commit()
				rank += 1
	 			#target.write("Associated Ingredients: " + str(associatedIngredient) + "\n")
	 			finalAssociations[currAction].append(associatedIngredient)
	 	print "Final Associations: ", finalAssociations
	 	#target.write("Final Associations: " + str(finalAssociations) + "\n")
		print "#####################################"
		#target.write("####################################" + "\n")
#target.close()

