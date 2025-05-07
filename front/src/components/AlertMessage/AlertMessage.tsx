import React from "react";
import { Alert } from "react-bootstrap";
import "./styles.scss";

const AlertMessage = (props: {
  message: { variant?: string; text: string };
}) => {
  const { variant = "danger", text } = props.message;

  return (
    <Alert className="alert_message" variant={variant} dismissible>
      {text}
    </Alert>
  );
};

export default AlertMessage;
