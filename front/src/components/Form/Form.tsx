import React, { ChangeEvent } from "react";
import { FormField, FormFieldType } from "../../models/FormField";
import { SearchBar } from "../SearchBar/SearchBar";
import { Form as BT_Form, Placeholder } from "react-bootstrap";
import "./styles.scss";
import { t } from "i18next";

const Form = (props: {
  fields: FormField[];
  className?: string;
  isLoading?: boolean;
}) => {
  const { fields, className = "", isLoading = false,  } = props;

  const renderForm = () => {
    return fields.map((field) => {
      switch (field.type) {
        // This 'Select' is for the drop down selections of faculties, dep, program, orientation
        case FormFieldType.Select:
          return (
            <BT_Form.Group className="mb-4" controlId={field.id} key={field.id}>
              <BT_Form.Label className="fw-bold">{field.label}</BT_Form.Label>
              <BT_Form.Select
                aria-label="select options"
                value={field.value}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  field.onChange(event.target.value)
                }
              >
                {field.options &&
                  field.options.map((item) => (
                    <option value={item._id} key={item._id}>
                      {item.name}
                    </option>
                  ))}
              </BT_Form.Select>
            </BT_Form.Group>
          );

        // This 'Search' is for the programs search.
        case FormFieldType.Search:
          return (
            <BT_Form.Group  className="mb-4" controlId={field.id} key={field.id}>
              <BT_Form.Label className="fw-bold">{field.label}</BT_Form.Label>
              <SearchBar />
            </BT_Form.Group>
          );

        // This 'Text' is for the advanced search bar.
        case FormFieldType.Text:
          return (
            <BT_Form.Group className="mb-4" controlId={field.id} key={field.id}>
              <BT_Form.Label className="fw-bold">{field.label}</BT_Form.Label>
              <BT_Form.Control
                type="text"
                defaultValue={field.value}
                className={field.error ? "is-invalid" : ""} 
                placeholder={t("advancedSearch.placeholder")} 
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault() // This prevent page reload bug.
                    const newValue = event.currentTarget.value ;
                    console.log("Enter pressed with value:", newValue )
                    field.onChange(newValue);
                  }
                  if (event.key === " ") {
                    const newValue = event.currentTarget.value ;
                    console.log("Space pressed with value:", newValue )
                    field.onChange(newValue);
                  }
                }}
                onBlur={(event) => {
                  console.log("Input blurred with value:", event.currentTarget.value);
                  field.onChange(event.currentTarget.value);
                }}
              />
            </BT_Form.Group>
          );
        default:
          return <></>;
      }
    });
  };

  const renderSkeletonsLoading = () => {
    return fields.map((_, index) => {
      return (
        <div key={index}>
          <Placeholder
            as={BT_Form.Label}
            animation="glow"
            className="form_field_skeleton__label skeleton_bg_animation"
          />
          <Placeholder
            as={BT_Form}
            animation="glow"
            className="form_field_skeleton__field skeleton_bg_animation"
          />
        </div>
      );
    });
  };

  return (
    <BT_Form className={`${className}`}>
      {isLoading ? renderSkeletonsLoading() : renderForm()}
    </BT_Form>
  );
};

export default Form;
