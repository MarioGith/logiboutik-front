import React, { useState } from "react";
import { useTranslation } from "next-i18next";

const SearchBar = (props) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  return (
    <div style={{ width: "400px" }}>
      <span>{t("search")}</span>
      <input
        style={{ margin: 0, width: "400px", height: "40px" }}
        value={search}
        onChange={(event) => props.handleChange(event)}
      />
    </div>
  );
};

export default SearchBar;
