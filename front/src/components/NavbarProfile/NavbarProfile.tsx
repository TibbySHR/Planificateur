import React, { useState } from "react";
import "./styles.scss";
import UserIcon from "../../assets/images/user.webp";
import SettingsIcon from "../../assets/images/settings.svg";

const NavbarProfile = () => {
  const [isOptionsShown, setIsOptionsShown] = useState(false);

  const options = [
    {
      label: "Configurations",
      icon: SettingsIcon,
      onClick: () => {},
      // mainContext.setState({ ...mainContext, isConfigureModalOpen: true }),
    },
  ];

  return (
    <div
      className="navbar_profile"
      onMouseOver={() => setIsOptionsShown(true)}
      onMouseOut={() => setIsOptionsShown(false)}
    >
      <div className="navbar_profile__account">
        <img src={UserIcon} />
      </div>
      <div
        className={`navbar_profile__options ${
          isOptionsShown && "navbar_profile__options--active"
        }`}
      >
        {options.map((item, i) => {
          return (
            <div
              key={i}
              onClick={item.onClick}
              className="navbar_profile__options__item"
            >
              <img
                src={item.icon}
                className="navbar_profile__options__item__icon"
              />
              <span className="navbar_profile__options__item__label">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NavbarProfile;
