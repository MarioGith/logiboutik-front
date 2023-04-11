import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Select from "react-select";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Constants from "../../assets/Constants";
import { Button } from "../../components";
import { Handler } from "../../services";
import { setForSelect } from "../../utils";

const EditTransaction = () => {
  const { t } = useTranslation(["transaction", "common"]);
  const { router, asPath } = useRouter();
  const _id = asPath.split("/")[asPath.split("/").length - 1];

  const [newTransaction, setNewTransaction] = useState();
  const [options, setOptions] = useState([]);

  const { transactionOptions } = Constants;

  useEffect(() => {
    Handler.list("article")
      .then((res) => {
        setOptions(setForSelect(res));
      })
      .catch((err) => console.log(err));
    Handler.get("transaction", _id)
      .then((res) => {
        res = res.map((trans) => {
          return {
            ...trans,
            date: `${trans.date.split("T")[0].split("-")[2]}/${
              trans.date.split("T")[0].split("-")[1]
            }/${trans.date.split("T")[0].split("-")[0]}`,
            transaction_type: t(`${trans.transaction_type}`),
          };
        });
        setNewTransaction(res[0]);
      })
      .catch((err) => console.log(err));
  }, [_id, options.length, t]);

  const deleteTransaction = async () => {
    await Handler.delete("transaction", _id);
    router.push("/transaction");
  };

  const handleEdit = async () => {
    const res = await Handler.update("transaction", _id, newTransaction);
    if (res.status === 200) {
      toast("Edited", { type: "success" });
    } else {
      toast(res.data.message, { type: "error" });
    }
  };

  if (newTransaction == undefined) return <></>;

  return (
    <div className="container">
      <div className="creation">
        <label>{t("article")}</label>
        <Select
          options={options}
          isClearable
          placeholder={t("article_placeholder")}
          className="select"
          isSearchable
          defaultValue={options.find(
            (article) => article.value === newTransaction.article
          )}
          onChange={(e) => {
            if (e) {
              setNewTransaction({ ...newTransaction, article: e.value });
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
        <input value={newTransaction.date} disabled />

        <label>{t("transaction_type")}</label>
        <Select
          options={transactionOptions}
          isClearable
          placeholder={t("transaction_type_placeholder")}
          className="select"
          isSearchable
          defaultValue={transactionOptions.find(
            (transactionOption) =>
              t(`${transactionOption.value}`) ===
              newTransaction.transaction_type
          )}
          onChange={(e) => {
            if (e) {
              setNewTransaction({
                ...newTransaction,
                transaction_type: e.value,
              });
            }
          }}
        />
      </div>
      <Button
        onClick={() => handleEdit()}
        label={t("modify", { ns: "common" })}
      />
      <Button onClick={() => deleteTransaction()} label={t("delete")} warning />
    </div>
  );
};

export default EditTransaction;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["transaction", "common"])),
    },
  };
}

export const getStaticPaths = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};
