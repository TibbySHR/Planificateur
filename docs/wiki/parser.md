# Structure

To treat the information coming from our data sources, we developed parsers.

## struct_FAS_parser.py

### What it does:
It parses the Annuaire(1CYC|CSUP) received by the FAS. The file that look likes a XML. It creates dictionnaries of dictionnaries of list etc of python's  data structure. Then it dumps the data using json.dumps(`<dictionnary>`) into a file.json. The parser receive two argument: the source_path to be parsed and the destination_path that he will write the .json object, in that order. The resulting parsed files is a json object with the meta model in meta_annuaire.pdf. meta_annuaire.pdf is produced by exporting meta_annuaire.md with Obsidian application.

### How

It read line per line processing the data. It looks for a flag that preceed most of the lines and do the appropriate extraction accordingly. Each programs starts with a `<GET>` flag indicating its id. This id is put in a pointer which is used and refered to put further information/flag that flollows.

## parser_repertoire.py

tour de passe passe,  si pas d'informatique sur la saison, => les trois saisons sont availables.

### What it does:
It parses "Répertoire_cours_1er_cycle_web.pdf" and by creating dictionnaries of dictionnaries/list of python's data structure. The nit dumps the data using json.dumps(`<dictionnary>`) into a file.json. The parser receive two argument: the course_path to be parsed and the destination_path that he will write the .json object, in that order. The resulting parsed files is a json object with the meta model in meta_repertoire.pdf. meta_repertoire.pdf is produced by exporting meta_repertoire.md with Obsidian application.

## Master Parser

Installation requirement:  
pip install xlsx2csv pymongo

Dependencies:
- MongoDB

DB configuration:
- The parser is configured to use a local MongoDB server. It can be modified using the following Environment Variables:
    - MONGO_URL: The URL of the MongoDB server
    - MONGO_DB: The name of the database to use
    - MONGO_COLLECTION: The name of the collection to use

Running the parser:
- The parser can be run using the following command:
    - python master.py
    - It takes following arguments:
```
usage: master.py [-h] [--root ROOT] [--schedule-raw-directory SCHEDULE_RAW_DIRECTORY] [--schedule-parsed-directory SCHEDULE_PARSED_DIRECTORY]
                 [--annuaire-raw-directory ANNUAIRE_RAW_DIRECTORY] [--annuaire-parsed-directory ANNUAIRE_PARSED_DIRECTORY]
                 [--repertoire-raw-directory REPERTOIRE_RAW_DIRECTORY] [--repertoire-parsed-directory REPERTOIRE_PARSED_DIRECTORY] [--debug]

Parse the raw data and populate the database

options:
  -h, --help            show this help message and exit
  --root ROOT           Root directory of the project
  --schedule-raw-directory SCHEDULE_RAW_DIRECTORY
                        Directory containing the raw schedule data
  --schedule-parsed-directory SCHEDULE_PARSED_DIRECTORY
                        Directory containing the parsed schedule data
  --annuaire-raw-directory ANNUAIRE_RAW_DIRECTORY
                        Directory containing the raw annuaire data
  --annuaire-parsed-directory ANNUAIRE_PARSED_DIRECTORY
                        Directory containing the parsed annuaire data
  --repertoire-raw-directory REPERTOIRE_RAW_DIRECTORY
                        Directory containing the raw repertoire data
  --repertoire-parsed-directory REPERTOIRE_PARSED_DIRECTORY
                        Directory containing the parsed repertoire data
  --debug               Set the logging level to debug

```