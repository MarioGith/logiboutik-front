import React from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import { useTranslation } from "next-i18next";
import Constants from "../assets/Constants";

// Article, quantity, date and type fields, shared by the create and edit
// pages. `transaction` is { article, quantity, date, transaction_type } where
// article is the article id and date a Date object.
export const checkTransaction = (transaction, t) => {
  if (!transaction.article) return t("article_required");
  if (!(Number(String(transaction.quantity ?? "").replace(",", ".")) > 0)) {
    return t("quantity_required");
  }
  if (!transaction.date) return t("date_required");
  if (!transaction.transaction_type) return t("type_required");
  return null;
};

const TransactionForm = ({ transaction, articleOptions, onChange }) => {
  const { t } = useTranslation("transaction");
  const typeOptions = Constants.transactionTypes.map((type) => ({
    value: type,
    label: t(type),
  }));
  const find = (options, value) =>
    options.find((option) => option.value === value) ?? null;

  return (
    <>
      <label htmlFor="article">{t("article")}</label>
      <Select
        inputId="article"
        options={articleOptions}
        value={find(articleOptions, transaction.article)}
        isClearable
        isSearchable
        placeholder={t("article_placeholder")}
        className="select"
        onChange={(option) =>
          onChange({ ...transaction, article: option ? option.value : "" })
        }
      />

      <label htmlFor="quantity">{t("quantity")}</label>
      <input
        id="quantity"
        value={transaction.quantity ?? ""}
        onChange={(e) => onChange({ ...transaction, quantity: e.target.value })}
        type="text"
        inputMode="decimal"
      />

      <label htmlFor="date">{t("date")}</label>
      <DatePicker
        id="date"
        selected={transaction.date}
        dateFormat="dd/MM/yyyy"
        onChange={(date) => onChange({ ...transaction, date })}
      />

      <label htmlFor="transaction_type">{t("transaction_type")}</label>
      <Select
        inputId="transaction_type"
        options={typeOptions}
        value={find(typeOptions, transaction.transaction_type)}
        isClearable
        isSearchable
        placeholder={t("transaction_type_placeholder")}
        className="select"
        onChange={(option) =>
          onChange({
            ...transaction,
            transaction_type: option ? option.value : "",
          })
        }
      />
    </>
  );
};

export default TransactionForm;
