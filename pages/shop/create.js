import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import { Handler } from "../../services";
import { Button } from "../../components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const CreateShop = () => {
  const { t } = useTranslation();

  const [newShop, setNewShop] = useState({
    name: "",
  });

  const sendData = async () => {
    try {
      const res = await Handler.create("shop", newShop);
      if (res.status === 200) {
        toast(res.data.message, { type: "success" });
      } else {
        toast(res.data.message, { type: "error" });
      }
    } catch (e) {
      throw e;
    }
  };

  return (
    <>
      <div className="creation">
        <div className="creation-input">
          <h3>{t("name")}</h3>
          <input
            value={newShop.name}
            onChange={(e) => {
              setNewShop({
                ...newShop,
                name: e.target.value.toLowerCase(),
              });
            }}
            type="text"
          />
        </div>
        <Button label={t("save")} onClick={() => sendData()} />
      </div>
    </>
  );
};

export default CreateShop;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["article", "client"])),
      // Will be passed to the page component as props
    },
  };
}
