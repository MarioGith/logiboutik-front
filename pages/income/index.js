import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { useTranslation } from "next-i18next";
import { Handler } from "../../services";
import { Button, ClientSelect } from "../../components";
import { useCompanyContext } from "../../context/CompanyContext";
import {
  capitalize,
  formatPrice,
  invoiceTotals,
  lineTotal,
  nextDay,
  notifyError,
  notifyInvalid,
  priceHT,
  startOfDay,
} from "../../utils";
import {
  addClientAndTitle,
  addPageNumbers,
  addTotals,
  addTable,
  createDocument,
} from "../../utils/pdf";
import { withTranslations } from "../../utils/i18n";

async function buildInvoice(t, company, client, name, lines) {
  const doc = await createDocument(company);
  addClientAndTitle(doc, t("for"), client, `${t("name")} : ${name}`);

  const totals = invoiceTotals(lines);
  addTotals(
    doc,
    [
      [t("total"), formatPrice(totals.toPay), true],
      [t("ttc"), formatPrice(totals.ttc)],
      [t("ht"), formatPrice(totals.ht)],
      [t("fee"), formatPrice(totals.fee)],
    ],
    11,
  );

  doc.setFontSize(15);
  doc.text(t("note"), 1.5, 16);
  doc.setFontSize(10);
  doc.text(t("payment_note"), 1.5, 16.8);

  doc.addPage();
  doc.setFontSize(20);
  doc.text(t("details"), 1.5, 1.5);
  await addTable(doc, {
    head: [
      [
        t("article"),
        t("price_ttc"),
        t("price_ht"),
        t("sell_quantity"),
        t("billing"),
      ],
    ],
    body: lines.map((line) => [
      capitalize(line.name),
      formatPrice(line.price),
      formatPrice(priceHT(line.price)),
      line.quantity,
      formatPrice(lineTotal(line)),
    ]),
    columnStyles: {
      1: { halign: "center" },
      2: { halign: "center" },
      3: { halign: "center" },
      4: { halign: "center" },
    },
    startY: 2.5,
    headStyles: { fontStyle: "bold" },
  });

  addPageNumbers(doc, t("page"));
  return doc;
}

const CreateIncome = () => {
  const { state } = useCompanyContext();
  const { t } = useTranslation(["income", "client", "common"]);
  // undefined = nothing chosen yet (the first client is used),
  // null = selection cleared on purpose.
  const [client, setClient] = useState(undefined);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [generating, setGenerating] = useState(false);

  const selectedClient =
    client === undefined ? (state.client[0] ?? null) : client;

  const generateIncome = async () => {
    if (!startDate || !endDate) {
      notifyInvalid(t("dates_required"));
      return;
    }
    if (startOfDay(endDate) < startOfDay(startDate)) {
      notifyInvalid(t("dates_order"));
      return;
    }
    setGenerating(true);
    try {
      // The end date is included: ask for sales before the next day.
      const lines = await Handler.getIncome(
        startOfDay(startDate),
        nextDay(endDate),
      );
      if (lines.length === 0) {
        notifyInvalid(t("no_sales"));
        return;
      }
      const doc = await buildInvoice(
        t,
        state,
        selectedClient ?? {},
        name,
        lines,
      );
      doc.save(`${t("header")} ${name}.pdf`);
    } catch (err) {
      notifyError(err, t);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="container">
      <h3>{t("header")}</h3>
      <div className="creation">
        <label htmlFor="client">{t("header", { ns: "client" })}</label>
        <ClientSelect
          inputId="client"
          value={selectedClient}
          placeholder={t("placeholder", { ns: "client" })}
          onChange={setClient}
        />

        <label htmlFor="name">{t("name")}</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
        />

        <label htmlFor="startDate">{t("startDate")}</label>
        <DatePicker
          id="startDate"
          selected={startDate}
          dateFormat="dd/MM/yyyy"
          onChange={setStartDate}
        />

        <label htmlFor="endDate">{t("endDate")}</label>
        <DatePicker
          id="endDate"
          selected={endDate}
          dateFormat="dd/MM/yyyy"
          onChange={setEndDate}
        />
      </div>

      <Button
        onClick={generateIncome}
        disabled={generating}
        label={generating ? t("generating") : t("download")}
      />
    </div>
  );
};

export default CreateIncome;

export const getStaticProps = withTranslations(["income", "client"]);
