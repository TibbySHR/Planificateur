import { useState } from "react";
import { ICourse } from "../../models/course";
import { aggregateSection, Item } from "../../utils/helpers/date_validator";
import "./styles.scss";
  
const SectionSelector = (props:{
    course:ICourse;
    season?:string;
    selectedSections? : string[];
    setSelectedSections? : React.Dispatch<React.SetStateAction<string[]>>
  })=>{
    const{
        course,
        season,
        selectedSections,
        setSelectedSections,
    }= props ;

  var sections : Item[] = []
  if (season){
    sections = aggregateSection(course, season)
  }else{
    sections = []
  } 
  // those are the sections options to be selected by the users
  var options: string[] = sections.map((section:Item)=>
     course._id + section.name
  )
  
  
  const handleSelect = (option: string, e:React.MouseEvent) => {
    e.stopPropagation();
    if (setSelectedSections)
    setSelectedSections((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option) // Deselect if already selected
        : [...prev, option] // Add to selection if not already selected
    );
  };
  
  return (
    <div className="section-container">
      {options.length === 1 ? null : 
        options.map((option) => (
          <div
            key={option}
            onClick={(e) => handleSelect(option, e)}
            className={`section-option ${
              (selectedSections ?? []).includes(option) ? 'selected' : ''
            }`}
          >
            {option.slice(-1)}
          </div>
        ))}
    </div>
  );
}
export default SectionSelector