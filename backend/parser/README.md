# Parser

## Master Parser
Installation requirement:  
`pip install xlsx2csv pymongo`

Dependencies:
- MongoDB

DB configuration:
- The parser is configured to use a local MongoDB server. It can be modified using the following Environment Variables:
    - MONGO_URL: The URL of the MongoDB server
    - MONGO_DB: The name of the database to use
    - MONGO_COLLECTION: The name of the collection to use

Running the parser:
- The parser can be run using the following command:
    - `python master.py`
    - It takes following arguments:
```bash
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


## xlsx2csv.py  
Installation requirement:  
`pip install xlsx2csv`

What it does:  
    It transform a "annuaire.xlsx" to a ".csv" file, deleting the leading and ending lines.  
How to use it:  
    Import it via an other .py process and call it's "xlsx2csv()" function:  
```
import xlsx2csv  
reader = xlsx2csv.xlsx2csv(source_file, destination_file)  
```
It take source_file as a mendatory parameter. Destination_file is optinal, if none is given it will not write the resulting csv.
It return a csv.DictReader object of the csv file eitherwise.



## annuaire_parser.py

What it does:  
It parses an annuaire into a python dict that is json valid.  
The output meta_model is seen in meta_annuaire.md
    
How to use it:  
- Import it via an other .py process and call it's "parse()" function:
    
```
import annuaire_parser.py
result = annuaire_parser.parse(source_file, destination_file)
```
It take source_file as a mendatory parameter. Destination_file is optinal, if none is given it will not write the resulting csv.  
The result returned is  a python dict object that is json valid.


## repertoire_parser.py

What it does:    
- It parses a repertoire.pdf into a python dict that is json valid.    
- The output meta_model is seen in meta_repertoire.md  
How to use it:    
- Import it via an other .py process and call it's "parse()" function:  
```
import repertoire_parser.py  
result = repertoire_parser.parse(source_file, destination_file)  
```
It take source_file as a mendatory parameter. Destination_file is optinal, if none is given it will not write the resulting csv.
the result returned is  a python dict object that is json valid.

