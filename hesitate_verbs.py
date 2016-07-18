import pickle

verb_nouns = {
'DRY',
'MICROWAVE',
'SCOOP',
'LIFT',
'STEAM',
'PICKLE',
'CHECK',
'HEAT',
'PRESS',
'SLICE',
'SET',
'GLAZE',
'DUST',
'MIX',
'SPOON',
'THIN',
'TOAST',
'CRACK',
'BROWN', #still get a lot of errors here
'CRUMBLE',
'STUFF',
'SLICE',
'RIB',
'PEEL',
'TOP',
'WARM',
'SMEAR',
'MINCE',
'CHOP',
'JUICE',
'GRILL',
'SPRITZ',
'QUARTER',
'POUND',
'ROLL'
}

pickle.dump(verb_nouns, open( "save_hesitate_verbs.p", "wb" ) )