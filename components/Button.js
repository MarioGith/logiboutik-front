import React from "react";

const Button = (props) => {
  const { onClick, label, warning } = props;
  return (
    <button
      onClick={onClick}
      type="submit"
      style={warning ? { background: "red", color: "black" } : {}}
    >
      {label}
    </button>
  );
};

export default Button;
