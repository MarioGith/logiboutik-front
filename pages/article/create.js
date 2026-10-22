import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Handler } from "../../services";
import {
  setForSelect,
  notifyError,
  notifyInvalid,
  notifySuccess,
} from "../../utils";
import { ArticleForm, Button, checkArticle } from "../../components";
import { withTranslations } from "../../utils/i18n";

const CreateArticle = () => {
  const { t } = useTranslation(["article", "common"]);
  const router = useRouter();
  const [shopOptions, setShopOptions] = useState([]);
  const [article, setArticle] = useState({ name: "", price: "", shop: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Handler.list("shop")
      .then((res) => setShopOptions(setForSelect(res)))
      .catch((err) => notifyError(err, t));
  }, [t]);

  const sendData = async () => {
    const problem = checkArticle(article, t);
    if (problem) {
      notifyInvalid(problem);
      return;
    }
    setSaving(true);
    try {
      await Handler.create("article", article);
      notifySuccess(t("created"));
      router.push("/article");
    } catch (err) {
      notifyError(err, t);
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <h3>{t("create")}</h3>
      <div className="creation">
        <ArticleForm
          article={article}
          shopOptions={shopOptions}
          onChange={setArticle}
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

export default CreateArticle;

export const getStaticProps = withTranslations(["article"]);
