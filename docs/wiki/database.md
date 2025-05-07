# Data model

- Date and hours are in ISO format YYYY-MM-DD (date) and HH:MM (hour)

## Courses collection

```yml
- _id : UDEM_ID
- code : TEXT
- number: TEXT
- name : TEXT
- description : TEXT
- credits : TEXT, can be a string of a float
- available_terms :
    - autumn : BOOLEAN
    - winter : BOOLEAN
    - summer : BOOLEAN
- available_periods :
    - daytime : BOOLEAN
    - evening : BOOLEAN
- requirement_text : TEXT
- prerequisite_courses : ID[]
- concomitant_courses : ID[]
- equivalent_courses : ID[]
- udem_website : TEXT
- other_websites : TEXT[]
- schedule : // or None if no schedule
	- <term>*:
	    - sections_name : TEXT
		- activity : [
			- name : TEXT
			- ranges : [ 
			    - day_of_week : TEXT
			    - start_date : ISO_DATE
			    - end_date : ISO_DATE
			    - start_hour : ISO_HOUR
			    - end_hour : ISO_HOUR
			    - campus : TEXT
			    - pavillon : TEXT
			    - room : TEXT  // not visible publicly
			    - teachers : TEXT[]
			    - nb_of_registrations : INT
			    - max registration : INT
			]
```

Programs collection
```yaml
	- programs : [
		- _id : UDEM_ID
		- name : ""
        - courses : ID[]
		- description : ""
		- total_credits : ""
		- segments : [
			- id : UDEM_ID
			- title : TEXT
			- description : TEXT
			- blocks : [
				- id : ""
				- title : ""		
				- description : ""
				- type : ""
				- min : ""
				- max : ""
				- courses : ID[] 
			]
			- orientations : [
				- id : ""
				- name : ""
				- target segments ids : []
				- recommanded course lineup : [
					- semester of admission : ""
					- semesters lineup : [
						- recommanded courses ids : []
					]
				]
			]
		]
	]
```

## Faculties collection

```yaml
- id : UUID
- name : TEXT
- departements : [
	- id : UDEM_ID
	- name : TEXT
  ]
- programs: [
	- id : UDEM_ID
	- name : TEXT
    - departments: ID[]
  ]
```

# Views

## Teacher schedules collection
```yaml
- teacher name : ""
- courses : [
	- course id : ""
	- seasons : [
		- name of season
		- sections : [
			- name of section : ""
			- subsection/activity [
				- name of subsection : ""
				- ranges : [
					- day of week : ""
					- start_date : ""
					- end_date : ""
					- start_hour : ""
					- end_hour : ""
					- campus : ""
					- pavillon : ""  <-- not visible publicly
					- room : ""  <-- not visible publicly
					- teachers : []
				]
			]
		]
	]
]
```

## Room schedules collection
```yaml
- room : TEXT
- courses : [
	- course id : "" // not visible publicly
	- seasons : [
		- season: TEXT
		- sections : [
			- name_of_section : "" // not visible publicly
			- activity: [
				- name of subsection : "" // not visible publicly
				- ranges : [
					- day_of_week : ""
					- start_date : ""
					- end_date : ""
					- start_hour : ""
					- end_hour : ""
					- campus : TEXT
					- pavillon : TEXT
					- room : TEXT // should only be the target room, not visible publicly
					- teachers : []  // not visible publicly
				]
			]
		]
	]
]
```
