# recipe_parser

# Commands to Run

1) python compound_ingredients.py

2) python cooking_verb.py

3) python ingredient_list.py

You have now loaded all the cooking vocabulary you need, so you can run the parser with

4) python baseline_parser.py

From here on out you can simply run the 4th command, unless you make changes to any of the other files, in which case you must run the file to update it.

# How to get the app running

## Clone the repository
- Import the tables recipes.sql, ingredients.sql, steps.sql, and node.sql into MAMP
- Make sure your home directly is the recipeApp folder
- Connect to sql from the app, make sure MAMP is running and all the fields to access your databases are correct
- After you install all the dependencies for recipe app (it’s a node application), run npm start
- localhost:3000/ should bring you to the main dashboard


## Important Files

### Recipes.js:
- Connection to sql is made. LOTS of callback functions
- You can edit var dataSize to look at a larger subset of the cookie recipes

### Single-graph.js
- Does some more parsing and creates a set of graphs and edges for each recipe in the search
- The most similar and least similar graph is calculated here
- levenshteinDistance, t-sne implemented here

### Render-graph.js
- Actually renders a single graph using d3


## Parsing
All of this happens in baseline_parser.py...the code is a mess, because I have been incrementally changing it and adding edge cases for the past 3 months. 
