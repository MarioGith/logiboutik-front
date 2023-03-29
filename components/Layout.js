import React from "react";
import Header from "./Header";

const Layout = (props) => {
  const { name, children } = props;
  return (
    <>
      <Header name={name} />
      <main>{children}</main>
    </>
  );
};

export default Layout;
