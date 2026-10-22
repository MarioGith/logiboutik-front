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
import { withTranslations } from "../../utils/i18n";

const CreateTransaction = () => {
  const { t } = useTranslation(["transaction", "common"]);
  const router = useRouter();
  const [articleOptions, setArticleOptions] = useState([]);
  const [transaction, setTransaction] = useState({
    article: "",
    quantity: "",
    date: new Date(),
    transaction_type: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Handler.list("article")
      .then((res) => setArticleOptions(setForSelect(res)))
      .catch((err) => notifyError(err, t));
  }, [t]);

  const sendData = async () => {
    const problem = checkTransaction(transaction, t);
    if (problem) {
      notifyInvalid(problem);
      return;
    }
    setSaving(true);
    try {
      await Handler.create("transaction", transaction);
      notifySuccess(t("created"));
      router.push("/transaction");
    } catch (err) {
      notifyError(err, t);
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <h3>{t("create")}</h3>
      <div className="creation">
        <TransactionForm
          transaction={transaction}
          articleOptions={articleOptions}
          onChange={setTransaction}
        />
      </div>
      <Button
        label={
          saving ? t("saving", { ns: "common" }) : t("save", { ns: "common" })
        }
        disabled={saving}
        onClick={sendData}
      />
    </div>
  );
};

export default CreateTransaction;

export const getStaticProps = withTranslations(["transaction"]);
