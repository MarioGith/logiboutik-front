import React from "react";
import Select from "react-select";
import { useCompanyContext } from "../context/CompanyContext";

// Picks one of the clients saved on the "Entreprise" page.
// `value` is the selected client ({ name, address, city }) or null.
const ClientSelect = ({ inputId, value, placeholder, onChange }) => {
  const { state } = useCompanyContext();
  const options = state.client.map((client) => ({
    label: client.name,
    value: client,
  }));

  return (
    <Select
      inputId={inputId}
      options={options}
      value={options.find((option) => option.label === value?.name) ?? null}
      isClearable
      isSearchable
      placeholder={placeholder}
      className="select"
      onChange={(option) => onChange(option ? option.value : null)}
    />
  );
};

export default ClientSelect;
