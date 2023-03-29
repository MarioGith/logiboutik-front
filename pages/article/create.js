import React, { useState, useEffect } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import { Handler } from "../../services";
import { setForSelect } from "../../utils";
import { Button } from "../../components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const CreateArticle = () => {
  const { t } = useTranslation("article");
  const [options, setOptions] = useState([]);

  const [newArticle, setNewArticle] = useState({});

  useEffect(() => {
    Handler.list("shop")
      .then((res) => {
        setOptions(setForSelect(res));
      })
      .catch((err) => console.log(err));
  }, []);

  const sendData = async () => {
    const res = await Handler.create("article", newArticle);
    if (res.status === 200) {
      toast(res.data.message, { type: "success" });
    } else {
      toast(res.data.message, { type: "error" });
    }
  };

  return (
    <div className="container">
      <h3>{t("create")}</h3>
      <div className="creation">
        <label>{t("name")}</label>
        <input
          value={newArticle.name}
          onChange={(e) => {
            setNewArticle({
              ...newArticle,
              name: e.target.value.toLowerCase(),
            });
          }}
          type="text"
        />

        <label>{t("price")}</label>
        <input
          value={newArticle.price}
          onChange={(e) => {
            setNewArticle({ ...newArticle, price: e.target.value });
          }}
        />
        <label>{t("shop")}</label>
        <Select
          options={options}
          isClearable
          placeholder={t("shop_placeholder")}
          isSearchable
          className="select"
          onChange={(e) => {
            if (e) {
              setNewArticle({ ...newArticle, shopId: e.value });
            } else {
              setNewArticle({ ...newArticle, shopId: "" });
            }
          }}
        />
        <Button label={t("save")} onClick={() => sendData()} />
      </div>
    </div>
  );
};

export default CreateArticle;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["article"])),
    },
  };
}
