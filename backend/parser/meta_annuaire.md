if a key is followed by "?", it mean that it might not be present
### whole jason object:
```
[
	{ <program_object> },
	{ <program_object> },
	...
]
```
### program_object
`id_pattern = ^\\d-\\d{3}-\\d-\\d$  => 1-175-1-0`
``` 
{
	_id: "id_string",	
	name :  "string_name",
	segments : \[ <list_of_segment_object> ] ,
	Règlement ? : " html_string" ,
	Objectifs(s) ?: "html_string", 
	structure ? : "markdown_string"
}
```
### one segment object
segment id string enforced by 
`regex =   "^Segments? \[0-9A-Z]\*$"` ,
```
{
	id :  "id_string" ,
	name : "string" ,
	description  : "string" ,
	blocs : \[ <list_of_blocs_object> ]
}
```
### One bloc object
bloc id string enforced by `regex = ^Bloc ?\[0-9A-Z]\*$`
bloc type string enforced by `regex  = (\[oO]bligatoires?|\[Oo]ptions?|\[cC]hoix|\[cC]ours en ligne)`
`-1` indicate that the value was not found
```
{
	id : "bloc_string_id",
	name: "name_string",
	description  : "string",
	type  :  "type_string" or -1,
	min : +int or -1
	max: +int or -1
	courses : \[ < list of courses object > ],
}
```

### One course object
sigle string enforced with this `regex  "^[A-Z]{3} \\d{4}\[A-Z0-9]?$"`
``` 
{
	_id : "IFT1005",
	name: "string_name"
    code: "IFT",
    number: "1005"
	credits: float,
    available_terms : {"autumn": False, "winter":False, "summer":False} 
    available_periods : {"daytime": False, "evening": False } 
}
```
