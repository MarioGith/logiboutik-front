import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Handler } from "../../services";
import { ArticleForm, Button, List, checkArticle } from "../../components";
import {
  formatDate,
  notifyError,
  notifyInvalid,
  notifySuccess,
  setForSelect,
} from "../../utils";
import { onDemandPaths, withTranslations } from "../../utils/i18n";

const EditArticle = () => {
  const { t } = useTranslation(["article", "transaction", "common"]);
  const router = useRouter();
  const { _id } = router.query;
  const [article, setArticle] = useState(null);
  const [shopOptions, setShopOptions] = useState([]);
  const [historic, setHistoric] = useState([]);
  const [stock, setStock] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!_id) return;
    Handler.list("shop")
      .then((res) => setShopOptions(setForSelect(res)))
      .catch((err) => notifyError(err, t));
    Handler.get("article", _id)
      .then((res) => {
        setArticle({
          name: res.details.name,
          price: res.details.price,
          shop: res.details.shop,
        });
        setStock(res.stock);
        setHistoric(
          res.historic.map((his) => ({
            ...his,
            date: formatDate(his.date),
            transaction_type: t(his.transaction_type, { ns: "transaction" }),
          })),
        );
      })
      .catch((err) => {
        // Unknown or deleted id, or API down: back to the list.
        notifyError(err, t);
        router.replace("/article");
      });
  }, [_id, t, router]);

  const handleEdit = async () => {
    const problem = checkArticle(article, t);
    if (problem) {
      notifyInvalid(problem);
      return;
    }
    setSaving(true);
    try {
      await Handler.update("article", _id, article);
      notifySuccess(t("saved", { ns: "common" }));
    } catch (err) {
      notifyError(err, t);
    } finally {
      setSaving(false);
    }
  };

  const deleteArticle = async () => {
    if (!window.confirm(t("confirm_delete"))) return;
    try {
      await Handler.delete("article", _id);
      notifySuccess(t("deleted", { ns: "common" }));
      router.push("/article");
    } catch (err) {
      notifyError(err, t);
    }
  };

  if (!article)
    return <p className="status">{t("loading", { ns: "common" })}</p>;

  const toTransaction = (row) => `/transaction/${row._id}`;
  const columns = [
    {
      key: "date",
      label: t("date", { ns: "transaction" }),
      link: toTransaction,
    },
    {
      key: "transaction_type",
      label: t("transaction_type", { ns: "transaction" }),
      link: toTransaction,
    },
    {
      key: "quantity",
      label: t("quantity", { ns: "transaction" }),
      link: toTransaction,
    },
  ];

  return (
    <div className="container">
      <div className="creation">
        <label htmlFor="stock">{t("currentStock")}</label>
        <input id="stock" value={stock} disabled type="text" />
        <ArticleForm
          article={article}
          shopOptions={shopOptions}
          onChange={setArticle}
        />
      </div>
      <Button
        onClick={handleEdit}
        disabled={saving}
        label={t("modify", { ns: "common" })}
      />
      <Button onClick={deleteArticle} label={t("delete")} warning />
      <h3>{t("historic")}</h3>
      <List data={historic} columns={columns} />
    </div>
  );
};

export default EditArticle;

export const getStaticProps = withTranslations(["article", "transaction"]);
export const getStaticPaths = onDemandPaths;
