import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Handler } from "../../services";
import { List, Button } from "../../components";
import { toast } from "react-toastify";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const EditShop = () => {
  const { t } = useTranslation(["shop", "common"]);
  const { router, asPath } = useRouter();
  const _id = asPath.split("/")[asPath.split("/").length - 1];
  const [newShop, setNewShop] = useState();

  useEffect(() => {
    Handler.get("shop", _id)
      .then((res) => {
        setNewShop(res);
      })
      .catch((err) => console.log(err));
  }, [_id]);

  const deleteShop = async () => {
    await Handler.delete("shop", _id);
    router.push("/app/shop");
  };

  const handleEdit = async () => {
    const res = await Handler.update("shop", _id, newShop);
    if (res.status === 200) {
      toast("Edited", { type: "success" });
    } else {
      toast(res.data.message, { type: "error" });
    }
  };

  if (!newShop) return <></>;

  return (
    <div className="container">
      <div className="details">
        <div className="creation">
          <label>{t("name")}</label>
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
        <Button
          onClick={() => handleEdit()}
          label={t("modify", { ns: "common" })}
        />
        <Button onClick={() => deleteShop()} label={t("delete")} warning />
      </div>
      <List data={newShop.articles} url="/article" />
    </div>
  );
};

export default EditShop;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["shop", "common", "article"])),
    },
  };
}

export const getStaticPaths = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};
