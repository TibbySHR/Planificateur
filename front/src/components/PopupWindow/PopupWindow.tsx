import Popup from "reactjs-popup";
import "./styles.scss";
import React, { ReactNode } from "react";
import IconButton from "../IconButton/IconButton";

interface PopUpProps {
  isOpen: boolean;
  children: ReactNode | string;
  onClose: () => void;
}

const PopupWindow = (props: PopUpProps) => {
  const { isOpen, onClose, children } = props;
  const closePopup = () => {
    onClose();
  };

  return (
    <Popup
      position="top center"
      open={isOpen}
      onClose={closePopup}
      className="my-popup"
    >
      <IconButton
        SVGIconProps={{
          name: "cross",
          width: "25",
          height: "25",
          fill: "#4b4b4b",
        }}
        onClick={closePopup}
        className="close_button"
      />
      {children}
    </Popup>
  );
};
export default PopupWindow;
