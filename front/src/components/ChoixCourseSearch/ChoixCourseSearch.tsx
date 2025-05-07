import React, { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import "./styles.scss";
import SVGIcon from "../SVGIcon/SVGIcon";
// import { getFakeCourses } from "../../utils/functions";
import Course from "../Course/Course";
import { useTranslation } from "react-i18next";

const ChoixCourseSearch = (props: {
  isSearchInputActive: boolean;
  setIsSearchInputActive: (value: boolean) => void;
}) => {
  const { t } = useTranslation();
  const [searchedCourses, setSearchedCourses] = useState(
    []
    // getFakeCourses(2, false)
  ); //Todo: later we will do a (fuzzy) search in the real available courses.

  const [searchedTerm, setSearchedTerm] = useState("");

  const onChangeSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedTerm(event.target.value);
  };

  return (
    <>
      <InputGroup className="choix-search">
        <InputGroup.Text
          className="choix-search__icon"
          onClick={() => props.setIsSearchInputActive(true)}
        >
          <SVGIcon name="search" width="20" height="20" />
        </InputGroup.Text>
        {props.isSearchInputActive && (
          <Form.Control
            placeholder={t("course_search.placeholder")}
            aria-label="Rechercher"
            onChange={onChangeSearchInput}
            value={searchedTerm}
          />
        )}
      </InputGroup>

      {props.isSearchInputActive && !!searchedTerm && (
        <div>
          {searchedCourses.map((course, i) => {
            return <></>;
            // return <Course course={course} key={i} />;
          })}
        </div>
      )}
    </>
  );
};

export default ChoixCourseSearch;
