# Source de données

## Annuaires (Synchro)

The data source *Annuaires* gives us the structure and requirements of every program (undergraduate and graduate level) currently available at UdeM: `cheminement / segments / blocs / courses`.
- Source: The data comes from Synchro employees.
- Fetching method:  uses his account to manually fetch the data at the beginning of each semester.

### Used for

- Filter and group courses according a program structure.
- Proposes courses selection as option for the "drag and drop" 
- Verify that the student course selection conforms to the program requirements.

### Data model

The data content is "flag-based" line-per-line information. Most lines begins with a flag that indicate the information that follows. Some flags that overflow on two or more lines.

### Flag
```md
<GET> : A program id and name follows 
<TTG> : Indicate the title of the following text description <DTG>, always has a <DTG> after.The only two titles found is "Objectif(s)" and "Règlement"
<DTG> : Always has a <TTG> before, is a text description made of HTML.
<GTT> : Indicate the title which is always "Structure et règles d'inscription" that is always followed by <GED>, the program description. 
<GED> : Is the program description, always has <GTT> before. Is made of markdown(?).
<ERT> : Indicate the segment id and sometimes it has a name.
<ERD> : Is the segment description.
<ALT> : The bloc id and sometimes it has a name.
<ALD> is the bloc description, option | obligatoire | etc, with its credit requirements.
<CRS> is a courses.
```

## Répertoire_cours_(1er_cycle|C_sup)_web.pdf

The data source Répertoire_cours is a PDF file that gives us the list of all active and inactive courses of UdeM. It allow us to extract courses description and its requirements (concomitant | équivalent | préalable)

- Source: https://registraire.umontreal.ca/publications-et-ressources/annuaires/
- Fetching method: The information is publicly available through the following links
  - 1er cycle: https://registraire.umontreal.ca/fileadmin/registrariat/documents/Annuaires/2023-2024/2023_2024_Re%CC%81pertoire_cours_1er_cycle_web.pdf
  - Cycle supérieur: https://registraire.umontreal.ca/fileadmin/registrariat/documents/Annuaires/2023-2024/2023_2024_Re%CC%81pertoire_cours_cycle_sup_web.pdf

### Data model

Each course is separated by a long line.
The general structure of a course is as follow: 
```md
<code> (<nb_credit>) Cours:<id> <date>?
<nom_cours>
<description_cours>
Habituellement offert: <AUTOMNE | HIVER | ETÉ>+
Volets: <TEXT>
Attributs: <TEXT>
Groupe exigences: <TEXT>
```

1. A course starts with a line containing its code (eg. AME 6090) followed immediately by its number of credits in paratheses. After some space we find the course id and optionally, after some more space, we find the date and hours.
2. A line with its course name
3. Many lines with its description
4. Habituellement offert
5. Volets
6. Attributs
7. Groupes exigences (optionnel). 

Sometimes there is requirements with not inside a "Groupes exigences"  and being used a an identifier on its own line. There is also a repetition of exigences among identifiers (eg 'Habituellement offert').
