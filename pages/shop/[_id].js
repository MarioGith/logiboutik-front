import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Handler } from "../../services";
import { List, Button } from "../../components";
import {
  capitalize,
  formatPrice,
  notifyError,
  notifyInvalid,
  notifySuccess,
} from "../../utils";
import { onDemandPaths, withTranslations } from "../../utils/i18n";

const EditShop = () => {
  const { t } = useTranslation(["shop", "article", "common"]);
  const router = useRouter();
  const { _id } = router.query;
  const [shop, setShop] = useState(null);
  const [articles, setArticles] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!_id) return;
    Handler.get("shop", _id)
      .then((res) => {
        setShop(res.details);
        setArticles(
          res.articles.map((art) => ({
            ...art,
            name: capitalize(art.name),
            price: formatPrice(art.price),
          })),
        );
      })
      .catch((err) => {
        // Unknown or deleted id, or API down: back to the list.
        notifyError(err, t);
        router.replace("/shop");
      });
  }, [_id, t, router]);

  const handleEdit = async () => {
    if (!shop.name.trim()) {
      notifyInvalid(t("name_required"));
      return;
    }
    setSaving(true);
    try {
      await Handler.update("shop", _id, { name: shop.name });
      notifySuccess(t("saved", { ns: "common" }));
    } catch (err) {
      notifyError(err, t);
    } finally {
      setSaving(false);
    }
  };

  const deleteShop = async () => {
    if (!window.confirm(t("confirm_delete", { ns: "common" }))) return;
    try {
      await Handler.delete("shop", _id);
      notifySuccess(t("deleted", { ns: "common" }));
      router.push("/shop");
    } catch (err) {
      notifyError(err, t);
    }
  };

  if (!shop) return <p className="status">{t("loading", { ns: "common" })}</p>;

  const columns = [
    {
      key: "name",
      label: t("name", { ns: "article" }),
      link: (row) => `/article/${row._id}`,
    },
    {
      key: "price",
      label: t("price", { ns: "article" }),
      link: (row) => `/article/${row._id}`,
    },
  ];

  return (
    <div className="container">
      <div className="creation">
        <label htmlFor="name">{t("name")}</label>
        <input
          id="name"
          value={shop.name}
          onChange={(e) =>
            setShop({ ...shop, name: e.target.value.toLowerCase() })
          }
          type="text"
        />
      </div>
      <Button
        onClick={handleEdit}
        disabled={saving}
        label={t("modify", { ns: "common" })}
      />
      <Button onClick={deleteShop} label={t("delete")} warning />
      <h3>{t("articles")}</h3>
      <List data={articles} columns={columns} />
    </div>
  );
};

export default EditShop;

export const getStaticProps = withTranslations(["shop", "article"]);
export const getStaticPaths = onDemandPaths;
