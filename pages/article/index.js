import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { Button, List } from "../../components";
import { Handler } from "../../services";
import { capitalize, formatPrice, notifyError } from "../../utils";
import { withTranslations } from "../../utils/i18n";

const ListArticle = () => {
  const { t } = useTranslation(["article", "common"]);
  const router = useRouter();
  const [articles, setArticles] = useState(null);

  useEffect(() => {
    Handler.list("article")
      .then((res) =>
        setArticles(
          res.map((art) => ({
            ...art,
            name: capitalize(art.name),
            price: formatPrice(art.price),
          })),
        ),
      )
      .catch((err) => {
        setArticles([]);
        notifyError(err, t);
      });
  }, [t]);

  const toArticle = (row) => `/article/${row._id}`;
  const columns = [
    { key: "name", label: t("name"), link: toArticle },
    { key: "price", label: t("price"), link: toArticle },
    {
      key: "shop",
      label: t("shop"),
      link: (row) => row.shop && `/shop/${row.shop._id}`,
    },
  ];

  return (
    <div className="container">
      <h3>{t("list")}</h3>
      <Button
        onClick={() => router.push("/article/create")}
        label={t("create")}
      />
      <List data={articles} columns={columns} loading={!articles} />
    </div>
  );
};

export default ListArticle;

export const getStaticProps = withTranslations(["article"]);
