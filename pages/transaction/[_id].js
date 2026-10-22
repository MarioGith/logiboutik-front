import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Handler } from "../../services";
import { Button, TransactionForm, checkTransaction } from "../../components";
import {
  setForSelect,
  notifyError,
  notifyInvalid,
  notifySuccess,
} from "../../utils";
import { onDemandPaths, withTranslations } from "../../utils/i18n";

const EditTransaction = () => {
  const { t } = useTranslation(["transaction", "common"]);
  const router = useRouter();
  const { _id } = router.query;
  const [transaction, setTransaction] = useState(null);
  const [articleOptions, setArticleOptions] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!_id) return;
    Handler.list("article")
      .then((res) => setArticleOptions(setForSelect(res)))
      .catch((err) => notifyError(err, t));
    // The API answers a one-element array.
    Handler.get("transaction", _id)
      .then(([res]) =>
        // Keep the raw values (type code, real Date): the form shows them
        // translated and formatted, but saves them untouched.
        setTransaction({
          article: res.article,
          quantity: res.quantity,
          date: new Date(res.date),
          transaction_type: res.transaction_type,
        }),
      )
      .catch((err) => {
        // Unknown or deleted id, or API down: back to the list.
        notifyError(err, t);
        router.replace("/transaction");
      });
  }, [_id, t, router]);

  const handleEdit = async () => {
    const problem = checkTransaction(transaction, t);
    if (problem) {
      notifyInvalid(problem);
      return;
    }
    setSaving(true);
    try {
      await Handler.update("transaction", _id, transaction);
      notifySuccess(t("saved", { ns: "common" }));
    } catch (err) {
      notifyError(err, t);
    } finally {
      setSaving(false);
    }
  };

  const deleteTransaction = async () => {
    if (!window.confirm(t("confirm_delete", { ns: "common" }))) return;
    try {
      await Handler.delete("transaction", _id);
      notifySuccess(t("deleted", { ns: "common" }));
      router.push("/transaction");
    } catch (err) {
      notifyError(err, t);
    }
  };

  if (!transaction) {
    return <p className="status">{t("loading", { ns: "common" })}</p>;
  }

  return (
    <div className="container">
      <div className="creation">
        <TransactionForm
          transaction={transaction}
          articleOptions={articleOptions}
          onChange={setTransaction}
        />
      </div>
      <Button
        onClick={handleEdit}
        disabled={saving}
        label={t("modify", { ns: "common" })}
      />
      <Button onClick={deleteTransaction} label={t("delete")} warning />
    </div>
  );
};

export default EditTransaction;

export const getStaticProps = withTranslations(["transaction"]);
export const getStaticPaths = onDemandPaths;
