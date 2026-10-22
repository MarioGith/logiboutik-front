import React from "react";

const Button = ({ onClick, label, warning = false, disabled = false }) => (
  <button
    onClick={onClick}
    type="button"
    disabled={disabled}
    className={warning ? "button--danger" : undefined}
  >
    {label}
  </button>
);

export default Button;
