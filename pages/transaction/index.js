import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { List, Button } from "../../components";
import { Handler } from "../../services";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const ListTransaction = () => {
  const { t } = useTranslation("transaction");
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    Handler.list("transaction")
      .then((res) => {
        res = res.map((trans) => {
          return {
            ...trans,
            date: `${trans.date.split("T")[0].split("-")[2]}/${
              trans.date.split("T")[0].split("-")[1]
            }/${trans.date.split("T")[0].split("-")[0]}`,
            transaction_type: t(`${trans.transaction_type}`),
          };
        });
        setTransactions(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [t, transactions.length]);

  if (!transactions) return <></>;

  return (
    <div className="container">
      <h3>{t("list")}</h3>
      <Button
        onClick={() => router.push("/transaction/create")}
        label={t("create")}
      />
      <List data={transactions} url="/transaction" />
    </div>
  );
};

export default ListTransaction;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["transaction"])),
    },
  };
}
