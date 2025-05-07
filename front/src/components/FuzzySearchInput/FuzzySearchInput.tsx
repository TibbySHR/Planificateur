import createFuzzySearch from "@nozbe/microfuzz";
import React, { useEffect, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import SVGIcon from "../SVGIcon/SVGIcon";

interface FuzzySearchInputProps<T> {
  list: T[];
  setFilteredList: (list: any) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

const FuzzySearchInput = <T,>(props: FuzzySearchInputProps<T>) => {
  const [queryText, setQueryText] = useState("");

  useEffect(() => {
    onSearch(queryText);
  }, [props.list]);

  const onSearch = (value: string) => {
    value !== queryText && setQueryText(value);

    const fuzzySearch = createFuzzySearch(props.list, {
      getText: (item) => [item.name, item._id],
    });

    if (!value.trim()) props.setFilteredList([]);
    else {
      const results = fuzzySearch(value);
      props.setFilteredList(results.map((result) => result.item));
    }
  };

  const onFocus = () => {
    props.onFocus && props.onFocus();
    if (queryText) {
      onSearch(queryText);
    }
  };

  return (
    <InputGroup className="mb-3">
      <InputGroup.Text className="fuzzy_search_input">
        <SVGIcon name="search" width="18" height="18" stroke="#0009" />
      </InputGroup.Text>

      <Form.Control
        aria-label="Fuzzy search input"
        placeholder={props.placeholder || ""}
        value={queryText}
        onChange={(e) => onSearch(e.target.value)}
        onFocus={onFocus}
        onBlur={props.onBlur}
      />
    </InputGroup>
  );
};

export default FuzzySearchInput;
