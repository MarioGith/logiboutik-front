import React, { useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import "jspdf-autotable";
import { useTranslation } from "next-i18next";
import { Handler } from "../../services";
import { generatePDF } from "../../utils";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useCompanyContext } from "../../context/CompanyContext";

const CreateIncome = () => {
  const { state, dispatch } = useCompanyContext();
  const { t } = useTranslation("income", "client");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [name, setName] = useState("");
  const [client, setClient] = useState({
    name: "",
    address: "",
    city: "",
  });

  const clientOptions = state.client.map((client) => {
    return {
      label: client.name,
      value: {
        name: client.name,
        address: client.address,
        city: client.city,
      },
    };
  });

  const generateIncome = async () => {
    const listIncome = await Handler.getIncome(startDate, endDate);
    // eslint-disable-next-line new-cap

    const doc = generatePDF(
      state.name,
      state.adress,
      state.phone,
      state.website
    );
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Client
    doc.text(t("for"), 1.5, 6.3);
    doc.setFontSize(20);
    doc.text(client.name, 1.5, 7.2);
    doc.setFontSize(10);
    doc.text(client.address, 1.5, 7.9);
    doc.text(client.city, 1.5, 8.6);

    // Name
    doc.setFontSize(20);
    const widthName = doc.getTextWidth(`${t("name")} : ${name}`);
    doc.text(`${t("name")} : ${name}`, pageWidth - widthName - 1.5, 7.5);

    // Total
    const totalTTC = listIncome
      .reduce((pv, cv) => {
        return pv + Math.round(cv.price * cv.quantity * 100) / 100;
      }, 0)
      .toFixed(2);
    const totalHT = (totalTTC / 1.2).toFixed(2);
    const fraisDeVente = (totalTTC * 0.225).toFixed(2);
    const totalAPayer = (totalTTC - fraisDeVente).toFixed(2);

    const finalY = 10;
    doc.setLineWidth(0.05);
    doc.line(pageWidth / 2, finalY + 1, pageWidth - 1.5, finalY + 1);

    doc.setFontSize(15);
    doc.text(t("total"), pageWidth / 2 + 1, finalY + 2);
    doc.setFontSize(10);
    doc.text(t("ttc"), pageWidth / 2 + 2, finalY + 2.7);
    doc.text(t("ht"), pageWidth / 2 + 2, finalY + 3.4);
    doc.text(t("fee"), pageWidth / 2 + 2, finalY + 4.1);

    doc.setFontSize(15);
    const widthAPayer = doc.getTextWidth(`${totalAPayer} €`);
    doc.text(`${totalAPayer} €`, pageWidth - widthAPayer - 1.5, finalY + 2);
    doc.setFontSize(10);
    const widthTTC = doc.getTextWidth(`${totalTTC} €`);
    doc.text(`${totalTTC} €`, pageWidth - widthTTC - 1.5, finalY + 2.7);
    const widthHT = doc.getTextWidth(`${totalHT} €`);
    doc.text(`${totalHT} €`, pageWidth - widthHT - 1.5, finalY + 3.4);
    const widthFrais = doc.getTextWidth(`${fraisDeVente} €`);
    doc.text(`${fraisDeVente} €`, pageWidth - widthFrais - 1.5, finalY + 4.1);

    // Note
    doc.setFontSize(15);
    doc.text(t("note"), 1.5, finalY + 6);
    doc.setFontSize(10);
    doc.text(
      "En votre aimable règlement à réception de la facture à libeller au nom de Mr DA CUNHA JM",
      1.5,
      finalY + 6.8
    );

    // Format data
    const incomeRowsMapped = listIncome.map((vente) => {
      return {
        name: vente.name[0].toUpperCase() + vente.name.substring(1),
        priceTtc: `${vente.price} €`,
        priceHt: `${(Math.round((vente.price / 1.2) * 100) / 100).toFixed(
          2
        )} €`,
        quantity: vente.quantity,
        billing: `${(
          Math.round(vente.price * vente.quantity * 100) / 100
        ).toFixed(2)} €`,
      };
    });
    const incomeRows = incomeRowsMapped.map((vente) => {
      return Object.values(vente);
    });

    // Handle Table
    doc.addPage();
    doc.setFontSize(20);
    doc.text(t("details"), 1.5, 1.5);
    doc.autoTable({
      head: [
        [
          t("article"),
          t("price_ttc"),
          t("price_ht"),
          t("sell_quantity"),
          t("billing"),
        ],
      ],
      body: incomeRows,
      columnStyles: {
        1: { halign: "center" },
        2: { halign: "center" },
        3: { halign: "center" },
        4: { halign: "center" },
      },
      startY: 2.5,
      headStyles: {
        fillColor: "#FECD08",

        fontWeight: "bold",
      },
    });

    // Page Number
    const pages = doc.internal.getNumberOfPages();
    doc.setFontSize(10);
    // eslint-disable-next-line no-plusplus
    for (let j = 1; j < pages + 1; j++) {
      const horizontalPos = pageWidth - 2;
      const verticalPos = pageHeight - 0.5;
      doc.setPage(j);
      doc.text(`${t("page")} ${j} / ${pages}`, horizontalPos, verticalPos);
    }

    // doc.setFontSize(10);

    doc.save(`${t("header")} ${name}.pdf`);
  };

  return (
    <div className="container">
      <h3>{t("header")}</h3>
      <div className="creation">
        <label>{t("header", { ns: "client" })}</label>
        <Select
          options={clientOptions}
          isClearable
          defaultValue={clientOptions[0]}
          placeholder={t("placeholder", { ns: "client" })}
          isSearchable
          className="select"
          onChange={(e) => {
            if (e) {
              setClient(e.value);
            } else {
              setClient({ name: "", address: "", city: "" });
            }
          }}
        />

        <label>{t("name")}</label>
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          type="text"
        />

        <label>{t("startDate")}</label>
        <DatePicker
          selected={startDate}
          onChange={(val) => {
            setStartDate(val);
          }}
        />

        <label>{t("endDate")}</label>
        <DatePicker
          selected={endDate}
          onChange={(val) => {
            setEndDate(val);
          }}
        />
      </div>

      <button onClick={() => generateIncome()} type="button">
        {t("download")}
      </button>
    </div>
  );
};

export default CreateIncome;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["income", "client"])),
      // Will be passed to the page component as props
    },
  };
}
