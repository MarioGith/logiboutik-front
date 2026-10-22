import React, { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Handler } from "../../services";
import { Button } from "../../components";
import { notifyError, notifyInvalid, notifySuccess } from "../../utils";
import { withTranslations } from "../../utils/i18n";

const CreateShop = () => {
  const { t } = useTranslation(["shop", "common"]);
  const router = useRouter();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);

  const sendData = async () => {
    if (!name.trim()) {
      notifyInvalid(t("name_required"));
      return;
    }
    setSaving(true);
    try {
      await Handler.create("shop", { name });
      notifySuccess(t("created"));
      router.push("/shop");
    } catch (err) {
      notifyError(err, t);
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <h3>{t("create")}</h3>
      <div className="creation">
        <label htmlFor="name">{t("name")}</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value.toLowerCase())}
          type="text"
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

export default CreateShop;

export const getStaticProps = withTranslations(["shop"]);
