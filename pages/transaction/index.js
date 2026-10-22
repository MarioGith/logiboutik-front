import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { List, Button } from "../../components";
import { Handler } from "../../services";
import { formatDate, notifyError } from "../../utils";
import { withTranslations } from "../../utils/i18n";

const ListTransaction = () => {
  const { t } = useTranslation(["transaction", "common"]);
  const router = useRouter();
  const [transactions, setTransactions] = useState(null);

  useEffect(() => {
    Handler.list("transaction")
      .then((res) =>
        setTransactions(
          res.map((trans) => ({
            ...trans,
            date: formatDate(trans.date),
            transaction_type: t(trans.transaction_type),
          })),
        ),
      )
      .catch((err) => {
        setTransactions([]);
        notifyError(err, t);
      });
  }, [t]);

  const toTransaction = (row) => `/transaction/${row._id}`;
  const columns = [
    {
      key: "article",
      label: t("article"),
      link: (row) => row.article && `/article/${row.article._id}`,
    },
    { key: "date", label: t("date"), link: toTransaction },
    { key: "quantity", label: t("quantity"), link: toTransaction },
    {
      key: "transaction_type",
      label: t("transaction_type"),
      link: toTransaction,
    },
  ];

  return (
    <div className="container">
      <h3>{t("list")}</h3>
      <Button
        onClick={() => router.push("/transaction/create")}
        label={t("create")}
      />
      <List data={transactions} columns={columns} loading={!transactions} />
    </div>
  );
};

export default ListTransaction;

export const getStaticProps = withTranslations(["transaction"]);
