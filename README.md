# Foodies 

For a more advanced view see the Report.pdf

The goal of this project is to allow explorers to find others with similar interests
and passions for cooking and sharing. We want users to be able to develop a
community where they can share their recipes, they are proud of to allow
others to enjoy their creations. In order to do that there must be a system in
place to guide users toward each other. Within our site, we would allow users
to post their own recipes as well as allow explorers to comment and
encourage further discussion through their own recreations or by simply
saying how they felt about the recipe. For each comment they can either
provide their own attempt through an image and description or simply rate it if
this isn’t possible. This allows for a more community approach to the
application rather than simply a recipe site.

To streamline this recipe is required to be organised with a title, ingredients,
meal types, style, etc. This allows filtering later for searches to more
accurately reflect an explorer desired dish. Our site would also have a
customised feed to show users content we think they would be interested in.
The primary difference between our system and currently existing ones is in
how we handle user interaction as well as user retention. As mentioned
previously, we want a community approach to a recipe app. This means that
user feedback is the most important regarding ranking. So, we used these
metrics to design our novel methods such as subscribing to independent
contributors as well as allowing user rating on comments to quickly gauge the
viability of a recipe and to provide feedback to contributors.

Our project can be somewhat summarised as a hybrid of instagram and a
typical food recipe website. The reason we did this was ease of access and
cleaner UI features. We also want our project to have friction and discussion
within the community like what you would typically see in an instagram post,
which is accomplished through the feedback and comment system.

# User Manual

Software required: python 3.7/ python 3.8/ python3.9

Once python is installed create your virtual env with 

### `python3 -m venv venv`

Then run your virtual env with 

### `source venv/bin/activate`

In the capstone directory, run below to install all the dependencies packages listed in the requirement.txt.

### `pip install -r requirments.txt`

Once this is done, create the database from fresh if you want a clean database otherwise ignore the following
Currently the database is premade with several example recipes 

### `python3 make.py`

Finally, run the backend use the following Command.

### `python3 run.py`

To confirm the server is running correctly, go to [http://localhost:5000](http://localhost:5000) in your browser.

### `python3 -m pytest tests`

For tests. Do NOT use command `pytest` to prevent import error.

### `client`

To install dependancies on frontend and to run it please lookinside the readme of the client folder.
