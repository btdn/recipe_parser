#Ground Truth
import pickle

finalAssociations = [ 

{'#no-action#': [], 'combine': [['egg'], ['soy', 'milk'], ['vanilla'], ['cinnamon']]},

{'#no-action#': [], 'overlap':[['banana']]},

{'#no-action#': [], 'place': [['bread']]},

{'#no-action#': [], 'dip': [['egg']]},

{'heat': [['skillet']], 'spray': [['cooking', 'spray']], '#no-action#': []},

{'cook': [], '#no-action#': [], 'place': []},

{'cook': [], '#no-action#': [], 'flip': []},

{'#no-action#': []},

{'cook': [], '#no-action#': [], 'place': [['bacon']]},

{'#no-action#': [], 'drain': [['bacon']]},

{'break': [], '#no-action#': []},

{'heat': [['oil']], '#no-action#': []},

{'#no-action#': [], 'whisk': [['milk'], ['egg'], ['nutmeg']]},

{'#no-action#': [], 'dip': [['bread'], ['egg']]},

{'cook': [['bread'], ['egg']], '#no-action#': []},

{'transfer': [], 'turn': [], '#no-action#': []},

{'spread': [['cranberry', 'sauce']], 'top': [['turkey'], ['provolone', 'cheese'], ['bacon']], '#no-action#': []},

{'spread': [['mustard']], '#no-action#': [], 'lay': [['bacon']]},

{'cook': [['cheese']], '#no-action#': []},

{'#no-action#': []},

{'#no-action#': [], 'combine': [['egg'], ['soy', 'milk'], ['vanilla'], ['cinnamon']]},

{'#no-action#': [], 'overlap':[['banana']]},

{'#no-action#': [], 'place': [['bread']]},

{'#no-action#': [], 'dip': [['egg']]},

{'heat': [['skillet']], 'spray': [['cooking', 'spray']], '#no-action#': []},

{'cook': [], '#no-action#': [], 'place': []},

{'cook': [], '#no-action#': [], 'flip': []},

{'#no-action#': []},

{'cook': [], '#no-action#': [], 'place': [['bacon']]},

{'#no-action#': [], 'drain': [['bacon']]},

{'break': [], '#no-action#': []},

{'heat': [['oil']], '#no-action#': []},

{'#no-action#': [], 'whisk': [['milk'], ['egg'], ['nutmeg']]},

{'#no-action#': [], 'dip': [['bread'], ['egg']]},

{'cook': [['bread']], '#no-action#': []},

{'transfer': [], 'turn':[], '#no-action#': []},

{'spread': [['cranberry', 'sauce']], 'top': [['turkey'], ['provolone', 'cheese'], ['bacon']], '#no-action#': []},

{'spread': [['mustard']], '#no-action#': [], 'lay': [['bacon']]},

{'cook': [['cheese']], '#no-action#': []},

{'#no-action#': []},

{'#no-action#': [], 'whisk': [['egg'], ['milk'], ['sugar'], ['vanilla']]},

{'heat': [['oil']], '#no-action#': []},

{'fry': [], '#no-action#': [], 'dip': [['bread'], ['egg']]},

{'repeat': [], '#no-action#': []},

{'#no-action#': [['milk'], ['custard', 'powder']], 'stir': []},

{'#no-action#': [], 'boil': [['milk']]},

{'#no-action#': [], 'stir': [['custard']]},

{'cook': [['custard']], '#no-action#': [], 'reduce': []},

{'#no-action#': [], 'place': [['bread']]},

{'spread': [['custard']], '#no-action#': []},

{'#no-action#': [], 'cover':[], 'form': []},

{'#no-action#': [], 'dust':[['sugar']]},

{'top': [['cream'], ['strawberry']], '#no-action#': []},

{'insert': [['toothpick']], '#no-action#': []},

{'#no-action#': []},

{'cook': [], 'combine': [['cream', 'cheese'], ['jam']], '#no-action#': []},

{'#no-action#': [], 'stir': []},

{'#no-action#': [], 'whisk': [['milk'], ['egg'], ['vanilla'], ['cinnamon']]},

{'#no-action#': [], 'dip': [['bread'], ['egg']]},

{'heat': [], '#no-action#': [], 'add': [['bread']]},

{'cook': [], '#no-action#': []},

{'#no-action#': [], 'spoon': [['cream', 'cheese']], 'cover': []},

{'cook': [], '#no-action#': []},

{'#no-action#': []},

{'#no-action#': [], 'whisk': [['egg'], ['milk'], ['sugar'], ['vanilla']]},

{'heat': [['oil']], '#no-action#': []},

{'fry': [], '#no-action#': [], 'dip': [['bread'], ['egg']]},

{'repeat':[], '#no-action#': []},

{'combine': [['milk'], ['custard', 'powder']], '#no-action#': [], 'stir': []},

{'#no-action#': [], 'boil': [['milk']]},

{'#no-action#': [], 'stir': [['custard']]},

{'cook': [['custard']], '#no-action#': [], 'reduce': []},

{'#no-action#': [], 'place': [['bread']]},

{'spread': [['custard']], '#no-action#': []},

{'#no-action#': [], 'form': [], 'cover':[]},

{'#no-action#': [], 'dust': [['sugar']]},

{'top': [['cream'], ['strawberry']], '#no-action#': []},

{'insert': [['toothpick']], '#no-action#': []},

{'#no-action#': []},

{'#no-action#': [], 'place': [['yeast'], ['water']], 'whisk': []},

{'add': [['flour'], ['salt']], '#no-action#': []},

{'knead': [], '#no-action#': []}, #ALERT

{'add': [['flour']], '#no-action#': [], 'knead': []},

{'#no-action#': [], 'transfer':[], 'form': []},

{'#no-action#': [], 'place': []},

{'drizzle': [['oil']], '#no-action#': []},

{'spread': [['oil']], '#no-action#': []},

{'#no-action#': [], 'cover': []},

{'transfer':[], '#no-action#': []}, #ALERT 

{'cut': [], '#no-action#': []}, 

{'#no-action#': [], 'roll': []},

{'#no-action#': [], 'cover': []},

{'#no-action#': [], 'flatten':[]},

{'#no-action#': [], 'roll': [], 'form': []},

{'transfer':[], '#no-action#': [], 'cover': []},

{'preheat': [], '#no-action#': []},

{'#no-action#': [], 'place': [['water']]},

{'score': [], '#no-action#': []},

{'#no-action#': [], 'spritz':[['water']]},

{'#no-action#': [], 'bake': []},

{'#no-action#': [], 'spritz': []},

{'#no-action#': [], 'bake': []},

{'#no-action#': [], 'transfer':[], 'cool': []},

{'#no-action#': []},

{'cook': [], '#no-action#': [], 'combine': [['cream', 'cheese'], ['jam']]},

{'#no-action#': [], 'stir': []},

{'#no-action#': [], 'whisk': [['milk'], ['egg'], ['vanilla'], ['cinnamon']]},

{'#no-action#': [], 'dip': [['bread'], ['egg']]},

{'heat': [], '#no-action#': [], 'add': [['bread']]},

{'cook': [], '#no-action#': []},

{'#no-action#': [], 'spoon': [['cream', 'cheese']], 'cover': []},

{'cook': [], '#no-action#': []},

{'#no-action#': []},

{'#no-action#': [], 'place': [['yeast'], ['water']], 'whisk': []},

{'add': [['flour'], ['salt']], '#no-action#': []},

{'knead': [], '#no-action#': []},

{'add': [['flour']], '#no-action#': [], 'knead': []},

{'transfer': [], '#no-action#': [], 'form': []},

{'#no-action#': [], 'place': []},

{'drizzle': [['oil']], '#no-action#': []},

{'spread': [['oil']], '#no-action#': []},

{'#no-action#': [], 'cover': []},

{'transfer': [], '#no-action#': []},

{'form': [], 'cut': [], '#no-action#': []},

{'#no-action#': [], 'roll': []},

{'#no-action#': [], 'cover': []},

{'#no-action#': [], 'flatten': []},

{'#no-action#': [], 'roll': [], 'form': []},

{'#no-action#': [], 'cover': [], 'transfer': []},

{'preheat': [], '#no-action#': []},

{'#no-action#': [], 'place': [['water']]},

{'score': [], '#no-action#': []},

{'#no-action#': [], 'spritz':[['water']]},

{'#no-action#': [], 'bake': []},

{'#no-action#': [], 'spritz':[], 'rotate':[]},

{'#no-action#': [], 'bake': []},

{'#no-action#': [], 'cool': [], 'transfer':[]},

{'#no-action#': []},

{'pulse':[], 'cut': [['onion'], ['carrot'], ['celery']], '#no-action#': []},

{'cook': [['smoked', 'sausage']], 'heat': [], '#no-action#': []},

{'cook': [], 'add': [['onion'], ['carrot'], ['celery']], '#no-action#': []},

{'cook': [], 'add': [['ketchup'], ['worcestershire', 'sauce'], ['brown', 'sugar']], '#no-action#': []},

{'#no-action#': [], 'spoon': [['bun'], ['cheese']], 'serve': []},

{'#no-action#': []},

{'preheat': [], '#no-action#': []},

{'#no-action#': []},

{'#no-action#': [], 'toss': [['daikon'], ['carrot'], ['rice', 'vinegar']]},

{'#no-action#': []},

{'refrigerate': [], '#no-action#': [], 'set': [], 'drain': []},

{'mix': [['mayonnaise'], ['hoisin', 'sauce'], ['sriracha']], '#no-action#': []},

{'#no-action#': [], 'split': [['roll']], 'open': []},

{'pull': [], '#no-action#': []},

{'spread': [['roll']], '#no-action#': []},

{'cut': [], '#no-action#': [], 'transfer': [['roll']]},

{'#no-action#': [], 'bake': []},

{'#no-action#': [], 'place': [['pork'], ['pate'], ['cucumber'], ['carrot'], ['jalapeno'], ['cilantro', 'leaf'], ['roll']]},

 {'cut': [], '#no-action#': [], 'serve': []},

 {'#no-action#': []},

{'pulse':[], 'cut': [['onion'], ['carrot'], ['celery']], '#no-action#': []},

{'cook': [['smoked', 'sausage'], ['brown']], 'heat': [], '#no-action#': []},

{'cook': [], 'add': [['onion'], ['carrot'], ['celery']], '#no-action#': []},

{'cook': [], 'add': [['ketchup'], ['worcestershire', 'sauce'], ['brown', 'sugar']], '#no-action#': []},

{'#no-action#': [], 'spoon': [['bun'], ['cheese']], 'serve': []},

{'#no-action#': []},

{'preheat': [], '#no-action#': []},

{'#no-action#': [], 'line':[]},

{'#no-action#': [], 'toss': [['carrot'], ['rice', 'vinegar']]},

{'#no-action#': []}, #ALERT

{'refrigerate': [], '#no-action#': [], 'set': [], 'drain': []},

{'mix': [['mayonnaise'], ['hoisin', 'sauce'], ['sriracha']], '#no-action#': []},

{'#no-action#': [], 'split': [['roll']], 'open': []},

{'pull': [], '#no-action#': []}, #ALERT

{'spread': [['roll']], '#no-action#': []},

{'cut': [], '#no-action#': [], 'transfer': [['roll']]},

{'#no-action#': [], 'bake': []},

{'#no-action#': [], 'place': [['pork'], ['pate'], ['cucumber'], ['carrot'], ['jalapeno'], ['cilantro', 'leaf'], ['roll']]},

{'cut': [], '#no-action#': [], 'serve': []},

{'#no-action#': []},

{'preheat': [], '#no-action#': []},

{'grill': [['red'], ['pepper']], '#no-action#': []},

{'#no-action#': [], 'transfer':[]},

{'#no-action#': [], 'place': [['tomato'], ['garlic']]},

{'#no-action#': [], 'blend': [['pepper']]},

{'season': [['oregano'], ['salt'], ['pepper']], '#no-action#': []},

{'grill': [['eggplant'], ['zucchini'], ['tomato'], ['onion']], '#no-action#': []},

{'spread': [], '#no-action#': [], 'drizzle': [['olive', 'oil'], ['bread']], 'flip': []},

{'add': [['mozzarella', 'cheese']], '#no-action#': [], 'place': [['bread']]},

{'top': [['eggplant'], ['mozzarella', 'cheese']], '#no-action#': []},

{'#no-action#': [], 'place': [['bread']]},

{'grill': [['cheese']], '#no-action#': []},

{'#no-action#': []},

{'preheat': [], '#no-action#': []},

{'grill': [['red'], ['pepper']], '#no-action#': []},

{'transfer': [], '#no-action#': []},

{'#no-action#': [], 'place': [['tomato'], ['garlic']]},

{'#no-action#': [], 'blend': [['pepper']]},

{'season': [['oregano'], ['salt'], ['pepper']], '#no-action#': []},

{'grill': [['eggplant'], ['zucchini'], ['tomato'], ['onion']], '#no-action#': [], 'slice': []},

{'spread': [], '#no-action#': [], 'drizzle': [['olive', 'oil'], ['bread']], 'flip': []},

{'add': [['mozzarella', 'cheese']], '#no-action#': [], 'place': [['bread']]},

{'top': [['eggplant'], ['mozzarella', 'cheese']], '#no-action#': []},

{'#no-action#': [], 'place': [['bread']]},

 {'grill': [['cheese']], '#no-action#': []},

 {'#no-action#': []},

 {'cook': [], '#no-action#': [], 'place': [['bacon']]},

 {'#no-action#': [], 'drain': []},

 {'#no-action#': [], 'set': [], 'crumble':[]},

 {'heat': [], '#no-action#': [], 'spray': [['cooking']]},

 {'#no-action#': [], 'crack': [['egg'], ['salt'], ['pepper']]},

 {'#no-action#': [], 'cook': [['egg']]},

 {'#no-action#': [], 'flip': [['egg']]},

 {'sprinkle': [['bacon'], ['cheddar', 'cheese'], ['egg']], '#no-action#': []},

 {'#no-action#': [], 'cook': [['cheese']]},

 {'#no-action#': [], 'place': [['egg']]},

 {'#no-action#': [], 'transfer':[]},

 {'#no-action#': []},

 {'cook': [], '#no-action#': [], 'place': [['bacon']]},

 {'#no-action#': [], 'drain': []},

 {'#no-action#': [], 'set': [], 'crumble': []},

 {'heat': [], '#no-action#': [], 'spray': [['cooking'], ['spray']]},

 {'season': [['salt']], '#no-action#': [], 'crack': [['egg']]},

 {'#no-action#': [], 'cook': [['egg']]},

 {'#no-action#': [], 'flip': [['egg']]},

 {'sprinkle': [['bacon'], ['cheddar', 'cheese'], ['egg']], '#no-action#': []},

 {'#no-action#': [], 'cook': [['cheese']]},

 {'#no-action#': [], 'place': [['egg']]},

 {'transfer': [], '#no-action#': []},

 {'#no-action#': []},

{'#no-action#': [], 'roast': [['pork']]},

{'#no-action#': [], 'slice': ['pork']}, #ALERT

{'#no-action#': [], 'heat': [['sandwich']]},

{'#no-action#': [], 'stir': [['mayonnaise'], ['caper'], ['lemon', 'pepper']]},

{'#no-action#': [], 'brush': [['bread'], ['olive', 'oil']]},

{'spread': [['bread'], ['mayonnaise']], '#no-action#': []},

 {'layer': [['arugula'], ['havarti'], ['mayonnaise']], '#no-action#': []},

{'top': [['bread']], '#no-action#': []},

{'#no-action#': [['olive', 'oil']]},

{'#no-action#': [], 'place': [['sandwich']]},

{'cook': [['bread'], ['cheese']], '#no-action#': []},

{'cut': [], '#no-action#': [], 'serve': []},

{'#no-action#': []},

{'#no-action#': [], 'roast': [['pork']]},

{'#no-action#': [], 'slice': []},

{'heat': [], '#no-action#': []},

{'#no-action#': [], 'stir': [['mayonnaise'], ['caper'], ['lemon', 'pepper']]},

{'#no-action#': [], 'brush': [['bread'], ['olive', 'oil']]},

]

pickle.dump(finalAssociations, open( "ground_truth.p", "wb" ) )