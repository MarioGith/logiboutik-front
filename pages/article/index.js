import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Button, List } from "../../components";
import { Handler } from "../../services";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const ListArticle = () => {
  const { t } = useTranslation("article");
  const router = useRouter();
  const [articles, setArticles] = useState([]);

  console.log(articles);

  useEffect(() => {
    Handler.list("article")
      .then((res) => {
        res = res.map((art) => {
          return {
            ...art,
            name: art.name[0].toUpperCase() + art.name.substring(1),
            price: `${art.price} €`,
          };
        });
        setArticles(res);
      })
      .catch((err) => console.log(err));
  }, [articles.length]);

  if (!articles) return <></>;

  return (
    <div className="container">
      <h3>{t("list")}</h3>
      <Button
        onClick={() => router.push("/article/create")}
        label={t("create")}
      />
      <List data={articles} url="/article" />
    </div>
  );
};

export default ListArticle;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["article"])),
    },
  };
}
