import pickle

verb_nouns = {
'DRY',
'MICROWAVE',
'SCOOP',
'LIFT',
'STEAM',
'PICKLE',
'CHECK',
'CREAM',
'BLEND',
'REVERSE',
'RUB',
'WIND',
'PRESS',
'HEAT',
'PLACE',
'PRESS',
'SLICE',
'SET',
'SHAPE',
'GREASE',
'GLAZE',
'POSITION',
'LOWER',
'WIND',
'DUST',
'MIX',
'SPOON',
'LEVEL',
'THIN',
'INSERT',
'TOAST',
'CRACK',
'WHIP',
'BROWN', #still get a lot of errors here
'CRUMBLE',
'STUFF',
'SEPARATE',
'SLICE',
'LAYER',
'RIB',
'PEEL',
'TOP',
'WARM',
'SMEAR',
'SPRAY',
'MINCE',
'CHOP',
'JUICE',
'GRILL',
'SPRITZ',
'QUARTER',
'POUND',
'ROLL',
'FILM',
}

pickle.dump(verb_nouns, open( "save_hesitate_verbs.p", "wb" ) )