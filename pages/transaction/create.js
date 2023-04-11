import React, { useState, useEffect } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";
import Constants from "../../assets/Constants";
import { Handler } from "../../services";
import { setForSelect } from "../../utils";
import { Button } from "../../components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const CreateArticle = () => {
  const { t } = useTranslation("transaction");

  const [newTransaction, setNewTransaction] = useState({});
  const [options, setOptions] = useState([]);
  const { transactionOptions } = Constants;

  const sendData = async () => {
    const res = await Handler.create("transaction", newTransaction);
    if (res.status === 200) {
      toast(res.data.message, { type: "success" });
    } else {
      toast(res.data.message, { type: "error" });
    }
  };

  useEffect(() => {
    Handler.list("article")
      .then((res) => {
        setOptions(setForSelect(res));
      })
      .catch((err) => console.log(err));
  }, []);

  if (!options) return <></>;

  return (
    <div className="container">
      <h3>{t("create")}</h3>

      <div className="creation">
        <label>{t("create")}</label>
        <Select
          options={options}
          isClearable
          placeholder={t("article_placeholder")}
          className="select"
          isSearchable
          onChange={(e) => {
            if (e) {
              setNewTransaction({ ...newTransaction, article: e.value });
            } else {
              setNewTransaction({ ...newTransaction, article: "" });
            }
          }}
        />

        <label>{t("quantity")}</label>
        <input
          value={newTransaction.quantity}
          onChange={(e) => {
            setNewTransaction({
              ...newTransaction,
              quantity: e.target.value,
            });
          }}
        />

        <label>{t("date")}</label>
        <DatePicker
          selected={newTransaction.date}
          onChange={(val) => {
            setNewTransaction({
              ...newTransaction,
              date: val,
            });
          }}
        />

        <label>{t("transaction_type")}</label>
        <Select
          options={transactionOptions}
          isClearable
          placeholder={t("transaction_type_placeholder")}
          className="select"
          isSearchable
          onChange={(e) => {
            if (e) {
              setNewTransaction({
                ...newTransaction,
                transaction_type: e.value,
              });
            } else {
              setNewTransaction({ ...newTransaction, transaction_type: "" });
            }
          }}
        />
      </div>
      <Button label={t("save")} onClick={() => sendData()} />
    </div>
  );
};

export default CreateArticle;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["transaction"])),
    },
  };
}
