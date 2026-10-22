import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { Handler } from "../../services";
import { Button, ClientSelect } from "../../components";
import { useCompanyContext } from "../../context/CompanyContext";
import {
  capitalize,
  formatPrice,
  notifyError,
  notifyInvalid,
} from "../../utils";
import {
  addClientAndTitle,
  addPageNumbers,
  addTable,
  createDocument,
} from "../../utils/pdf";
import { withTranslations } from "../../utils/i18n";

async function buildStockSheet(t, company, client, name, stock) {
  const doc = await createDocument(company);
  addClientAndTitle(
    doc,
    `${t("stock_for")} :`,
    client,
    `${t("stock_name")} : ${name}`,
  );

  // The last two columns are left at 0, to be filled in by hand.
  await addTable(doc, {
    head: [
      [
        t("article"),
        t("price_ttc"),
        t("actual_quantity"),
        t("sell_quantity"),
        t("retrieve_quantity"),
      ],
    ],
    body: stock.map((article) => [
      capitalize(article.name),
      formatPrice(article.price),
      article.quantity,
      0,
      0,
    ]),
    columnStyles: {
      1: { halign: "center" },
      2: { halign: "center" },
      3: { halign: "center" },
      4: { halign: "center" },
    },
    startY: 9.3,
  });

  addPageNumbers(doc, t("page"));
  return doc;
}

const CreateStock = () => {
  const { state } = useCompanyContext();
  const { t } = useTranslation(["stock", "common"]);
  const [client, setClient] = useState(null);
  const [name, setName] = useState("");
  const [stock, setStock] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    Handler.getStock()
      .then(setStock)
      .catch((err) => {
        setStock([]);
        notifyError(err, t);
      });
  }, [t]);

  const generateStock = async () => {
    if (stock.length === 0) {
      notifyInvalid(t("no_stock"));
      return;
    }
    setGenerating(true);
    try {
      const doc = await buildStockSheet(t, state, client ?? {}, name, stock);
      doc.save(`Stock ${name}.pdf`);
    } catch (err) {
      notifyError(err, t);
    } finally {
      setGenerating(false);
    }
  };

  if (!stock) return <p className="status">{t("loading", { ns: "common" })}</p>;

  return (
    <div className="container">
      <h3>{t("create")}</h3>
      <div className="creation">
        <label htmlFor="client">{t("client")}</label>
        <ClientSelect
          inputId="client"
          value={client}
          placeholder={t("client_placeholder")}
          onChange={setClient}
        />
        <label htmlFor="name">{t("stock_name")}</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
        />
      </div>
      <Button
        onClick={generateStock}
        disabled={generating}
        label={generating ? t("generating") : t("download")}
      />
    </div>
  );
};

export default CreateStock;

export const getStaticProps = withTranslations(["stock"]);
