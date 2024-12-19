# capstone-project-3900-f18b-octopus

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
