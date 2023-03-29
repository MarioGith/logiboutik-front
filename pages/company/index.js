import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useCompanyContext } from "../../context/CompanyContext";
import { Button } from "../../components";

const Company = () => {
  const { state, dispatch } = useCompanyContext();
  const { t } = useTranslation(["company", "common"]);
  const [company, setCompany] = useState(state);
  const [client, setClient] = useState({
    name: "",
    address: "",
    city: "",
  });

  console.log(state.client);

  return (
    <>
      <div className="container">
        <h3>{t("info")}</h3>
        <div className="creation">
          <label>{t("name")}</label>
          <input
            value={company.name}
            onChange={(e) => {
              setCompany({ ...company, name: e.target.value });
            }}
            type="text"
          />

          <label>{t("address")}</label>
          <input
            value={company.adress}
            onChange={(e) => {
              setCompany({ ...company, adress: e.target.value });
            }}
            type="text"
          />
          <label>{t("phone")}</label>
          <input
            value={company.phone}
            onChange={(e) => {
              setCompany({ ...company, phone: e.target.value });
            }}
            type="text"
          />
          <label>{t("website")}</label>
          <input
            value={company.website}
            onChange={(e) => {
              setCompany({ ...company, website: e.target.value });
            }}
            type="text"
          />
        </div>
        <button
          onClick={() => dispatch({ type: "modify_company", value: company })}
          type="button"
        >
          {t("save", { ns: "common" })}
        </button>
      </div>

      <div className="container">
        <h3>{t("client")}</h3>
        {/* <List data={state.client} url="/company" /> */}

        <div className="creation">
          <label>{t("client_name")}</label>
          <input
            value={client.name}
            onChange={(e) => {
              setClient({ ...client, name: e.target.value });
            }}
            type="text"
          />

          <label>{t("client_address")}</label>
          <input
            value={client.address}
            onChange={(e) => {
              setClient({ ...client, address: e.target.value });
            }}
            type="text"
          />

          <label>{t("client_city")}</label>
          <input
            value={client.city}
            onChange={(e) => {
              setClient({ ...client, city: e.target.value });
            }}
            type="text"
          />
        </div>
        <button
          onClick={() => dispatch({ type: "add_client", value: client })}
          type="button"
        >
          {t("save", { ns: "common" })}
        </button>

        <Button
          onClick={() => dispatch({ type: "reset" })}
          warning
          label={t("reset")}
        />
      </div>
    </>
  );
};

export default Company;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["company", "common"])),
    },
  };
}
