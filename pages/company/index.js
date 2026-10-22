import React, { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { useCompanyContext } from "../../context/CompanyContext";
import { Button } from "../../components";
import { capitalize, notifyInvalid, notifySuccess } from "../../utils";
import { withTranslations } from "../../utils/i18n";

const EMPTY_CLIENT = { name: "", address: "", city: "" };

const Field = ({ id, label, value, onChange }) => (
  <>
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value)}
      type="text"
    />
  </>
);

const Company = () => {
  const { state, dispatch } = useCompanyContext();
  const { t } = useTranslation(["company", "common"]);
  const [company, setCompany] = useState(state);
  const [client, setClient] = useState(EMPTY_CLIENT);

  // The saved data is read after the first render: copy it into the form.
  useEffect(() => {
    setCompany(state);
  }, [state.name, state.adress, state.phone, state.website]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveCompany = () => {
    dispatch({ type: "modify_company", value: company });
    notifySuccess(t("saved", { ns: "common" }));
  };

  const addClient = () => {
    const name = client.name.trim();
    if (!name) {
      notifyInvalid(t("client_name_required"));
      return;
    }
    if (
      state.client.some(
        (c) => c.name.trim().toLowerCase() === name.toLowerCase(),
      )
    ) {
      notifyInvalid(t("client_exists"));
      return;
    }
    dispatch({ type: "add_client", value: { ...client, name } });
    setClient(EMPTY_CLIENT);
    notifySuccess(t("client_added"));
  };

  const removeClient = (name) => {
    if (window.confirm(t("confirm_delete", { ns: "common" }))) {
      dispatch({ type: "remove_client", value: name });
    }
  };

  const reset = () => {
    if (window.confirm(t("confirm_reset"))) dispatch({ type: "reset" });
  };

  return (
    <>
      <div className="container">
        <h3>{t("info")}</h3>
        <p className="status">{t("saved_locally")}</p>
        <div className="creation">
          <Field
            id="company-name"
            label={t("name")}
            value={company.name}
            onChange={(name) => setCompany({ ...company, name })}
          />
          <Field
            id="company-address"
            label={t("address")}
            value={company.adress}
            onChange={(adress) => setCompany({ ...company, adress })}
          />
          <Field
            id="company-phone"
            label={t("phone")}
            value={company.phone}
            onChange={(phone) => setCompany({ ...company, phone })}
          />
          <Field
            id="company-website"
            label={t("website")}
            value={company.website}
            onChange={(website) => setCompany({ ...company, website })}
          />
        </div>
        <Button onClick={saveCompany} label={t("save", { ns: "common" })} />
      </div>

      <div className="container">
        <h3>{t("client")}</h3>
        {state.client.length === 0 ? (
          <p className="status">{t("no_client")}</p>
        ) : (
          <ul className="clients">
            {state.client.map((c, index) => (
              <li key={`${c.name}-${index}`}>
                <span>
                  {capitalize(c.name)}
                  {c.city ? ` — ${c.city}` : ""}
                </span>
                <Button
                  onClick={() => removeClient(c.name)}
                  label={t("client_remove")}
                  warning
                />
              </li>
            ))}
          </ul>
        )}

        <div className="creation">
          <Field
            id="client-name"
            label={t("client_name")}
            value={client.name}
            onChange={(name) => setClient({ ...client, name })}
          />
          <Field
            id="client-address"
            label={t("client_address")}
            value={client.address}
            onChange={(address) => setClient({ ...client, address })}
          />
          <Field
            id="client-city"
            label={t("client_city")}
            value={client.city}
            onChange={(city) => setClient({ ...client, city })}
          />
        </div>
        <Button onClick={addClient} label={t("client_add")} />

        <Button onClick={reset} warning label={t("reset")} />
      </div>
    </>
  );
};

export default Company;

export const getStaticProps = withTranslations(["company"]);
