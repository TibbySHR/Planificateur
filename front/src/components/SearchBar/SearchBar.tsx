import { SchoolContext } from "../../store/contexts/schoolContext";
import { ChangeEvent, useContext, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.scss";
import createFuzzySearch from "@nozbe/microfuzz";
import Form from "react-bootstrap/Form";
import { useTranslation } from "react-i18next";

type Program = {
  _id: string;
  name: string;
  orientation: string[];
  facultyId: string;
  departementId: string;
};

export function SearchBar() {
  const { t } = useTranslation();
  const { faculties, selectFaculty, selectDepartment, selectProgram } =
    useContext(SchoolContext);

  const allPrograms: Program[] = useMemo(
    () =>
      faculties.flatMap((faculty) =>
        faculty.departments.flatMap((department) =>
          department.programs.flatMap((p) => ({
            _id: p._id,
            name: p.name,
            orientation: [],
            facultyId: faculty._id,
            departementId: department._id,
            searchText: p.name + p._id
          }))
        )
      ),
    [faculties]
  );

  const fuzzySearch = useMemo(
    () => createFuzzySearch(allPrograms, { key: "searchText" }),
    [allPrograms]
  );

  const [searchedPrograms, setSearchedPrograms] = useState(allPrograms);
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedProgramName, setSelectedProgramName] = useState("");

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const searchValue = event.target.value;
    setSelectedProgramName(searchValue);

    if (searchValue.trim() !== "") {
      setDropdownVisible(true);
      const results = fuzzySearch(searchValue);
      setSearchedPrograms(results.map((result) => result.item));
    } else {
      setDropdownVisible(false);
      setSearchedPrograms([]);
    }
  };

  const handleSelect = async (program: Program) => {
    selectFaculty(program.facultyId);
    selectDepartment(program.departementId);
    selectProgram(program._id);

    setSelectedProgramName(program.name);
    setDropdownVisible(false);
  };

  const handleBlur = () => {
    setDropdownVisible(false);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    if (event.target.value.trim() !== "") {
      setDropdownVisible(true);
      setSelectedProgramName("");
    }
  };

  return (
    <div className="position-relative">
      <Form.Control
        type="text"
        placeholder={t("searchbar.placeholder")}
        value={selectedProgramName}
        onChange={handleSearch}
        onKeyDown={(event)=>{
          // This prevent page reload bug.
          if (event.key === "Enter"){ event.preventDefault()}
        }}  
        onBlur={handleBlur}
        onFocus={handleFocus}
      />
      {isDropdownVisible && searchedPrograms.length > 0 && (
        <div className="dropdown-menu show w-100">
          {searchedPrograms.map((program: Program) => (
            <div
              key={program._id}
              className="dropdown-item"
              onMouseDown={() => handleSelect(program)}
            >
              {program.name} - {program._id}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
