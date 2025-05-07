import React, { useContext, useEffect, useState } from "react";
import "./style.scss"; // Import the CSS file
import { t } from "i18next";

interface UserFormProps {
  options: string[];
  defaultOptions: string[];
  onSubmit: (name: string, selectedOptions: string[]) => void; // Callback function prop
}

const UserForm: React.FC<UserFormProps> = ({
  options,
  defaultOptions = [],
  onSubmit,
}) => {
  const DEFAULT_FILE_NAME = "Les horaires";
  const [name, setName] = useState<string>(DEFAULT_FILE_NAME);
  const [selectedOptions, setSelectedOptions] =
    useState<string[]>(defaultOptions);

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    // user cannot unselect the segment that their courses comes from
    if (defaultOptions.includes(value)) return;

    setSelectedOptions((prevSelectedOptions) =>
      prevSelectedOptions.includes(value)
        ? prevSelectedOptions.filter((option) => option !== value)
        : [...prevSelectedOptions, value]
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Submit! name:", name, "selectedOptions :", selectedOptions);

    onSubmit(name || DEFAULT_FILE_NAME, selectedOptions);
  };

  return (
    <div className="UserForm__container">
      <h2 className="UserForm__heading">{t("form.title")} </h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="UserForm__formGroup">
          <label htmlFor="name" className="UserForm__label">
            {t("form.name")}:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            className="UserForm__input"
            placeholder={t("form.name.placeholder")}
          />
        </div>
        <div className="UserForm__formGroup">
          <label className="UserForm__label">{t("form.chooseOptions")}:</label>
          <div className="UserForm__checkboxGroup">
            {options.map((option, index) => (
              <label
                key={index}
                className={`UserForm__checkboxLabel ${
                  defaultOptions.includes(option) ? "UserForm__disabled" : ""
                }`}
              >
                <input
                  type="checkbox"
                  value={option}
                  checked={selectedOptions.includes(option)}
                  onChange={handleCheckboxChange}
                  disabled={defaultOptions.includes(option)}
                />
                <span className="UserForm__option">{option}</span>
              </label>
            ))}
          </div>
        </div>
        <button type="submit" className="UserForm__button">
          {t("form.submit")}
        </button>
      </form>
    </div>
  );
};

export default UserForm;
