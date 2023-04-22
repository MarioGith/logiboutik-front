import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Select from "react-select";
import { toast } from "react-toastify";
import { setForSelect } from "../../utils";
import { List, Button } from "../../components";
import { Handler } from "../../services";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const EditArticle = () => {
  const { t } = useTranslation("article");
  const { router, asPath } = useRouter();
  const _id = asPath.split("/")[asPath.split("/").length - 1];
  const [newArticle, setNewArticle] = useState();
  const [options, setOptions] = useState([]);
  const [historic, setHistoric] = useState([]);
  const [stock, setStock] = useState(0);

  useEffect(() => {
    Handler.list("shop")
      .then((res) => {
        setOptions(setForSelect(res));
      })
      .catch((err) => console.log(err));

    Handler.get("article", _id)
      .then((res) => {
        console.log(res);
        res.historic = res.historic.map((his) => {
          return {
            ...his,
            date: `${his.date.split("T")[0].split("-")[2]}/${
              his.date.split("T")[0].split("-")[1]
            }/${his.date.split("T")[0].split("-")[0]}`,
            transaction_type: t(`transaction.${his.transaction_type}`),
          };
        });
        setHistoric(res.historic);
        setStock(res.stock);
        setNewArticle(res.details);
      })
      .catch((err) => console.log(err));
  }, [_id, t]);

  const deleteArticle = async () => {
    await Handler.delete("article", _id);
    router.push("/article");
  };

  const handleEdit = async () => {
    const res = await Handler.update("article", _id, newArticle);
    if (res.status === 200) {
      toast("Edited", { type: "success" });
    } else {
      toast(res.data.message, { type: "error" });
    }
  };

  if (!newArticle) return <></>;

  return (
    <div className="container">
      <div className="details">
        <div className="creation">
          <label>{t("currentStock")}</label>
          <input value={stock} disabled type="text" />

          <label>{t("name")}</label>
          <input
            value={newArticle.name}
            onChange={(e) => {
              setNewArticle({
                ...newArticle,
                name: e.target.value.toLowerCase(),
              });
            }}
            type="text"
          />

          <label>{t("price")}</label>
          <input
            value={newArticle.price}
            onChange={(e) => {
              setNewArticle({ ...newArticle, price: e.target.value });
            }}
          />
          <label>{t("shop")}</label>
          <Select
            options={options}
            isClearable
            placeholder={t("shop_placeholder")}
            defaultValue={options.find(
              (shop) => shop.value === newArticle.shop
            )}
            isSearchable
            className="select"
            onChange={(e) => {
              if (e) {
                setNewArticle({ ...newArticle, shop: e.value });
              }
            }}
          />
        </div>
        <Button
          onClick={() => handleEdit()}
          label={t("modify", { ns: "common" })}
        />
        <Button onClick={() => deleteArticle()} label={t("delete")} warning />
      </div>
      <List data={historic} url="/transaction" />
    </div>
  );
};

export default EditArticle;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "article",
        "transaction",
        "common",
      ])),
    },
  };
}

export const getStaticPaths = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};
