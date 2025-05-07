import React from "react";
import "./styles.scss";
import AlertMessage from "../AlertMessage/AlertMessage";
import { IAlertMessage } from "../../models/alertMessage";

const AlertMessageStack = (props: { messages: IAlertMessage[] }) => {
  return (
    <div className="alert-message-stack">
      {props.messages.map((message, i) => {
        return <AlertMessage key={i} message={message} />;
      })}
    </div>
  );
};

export default AlertMessageStack;
