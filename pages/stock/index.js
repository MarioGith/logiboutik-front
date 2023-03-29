import React, { useState, useEffect } from "react";
import Select from "react-select";
import "jspdf-autotable";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Handler } from "../../services";
import { generatePDF } from "../../utils";
import { useCompanyContext } from "../../context/CompanyContext";

const CreateStock = () => {
  const { state, dispatch } = useCompanyContext();

  const { t } = useTranslation("stock");
  const [name, setName] = useState("");
  const [client, setClient] = useState({
    name: "",
    address: "",
    city: "",
  });
  const [loaded, setLoaded] = useState(false);
  const [stock, setStock] = useState([]);

  useEffect(() => {
    async function loadData() {
      try {
        const listStock = await Handler.getStock();
        setStock(listStock);
      } catch (err) {}
    }
    loadData();
    setLoaded(true);
  }, []);

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
    doc.text(t("stock_for") + " :", 1.5, 6.3);
    doc.setFontSize(20);
    doc.text(client.name, 1.5, 7.2);
    doc.setFontSize(10);
    doc.text(client.address, 1.5, 7.9);
    doc.text(client.city, 1.5, 8.6);

    // Name
    doc.setFontSize(20);
    const widthName = doc.getTextWidth(`${t("stock_name")} : ${name}`);
    doc.text(`${t("stock_name")} : ${name}`, pageWidth - widthName - 1.5, 7.2);

    // Format data
    const stockRowsMapped = stock.map((article) => {
      return {
        name: article.name[0].toUpperCase() + article.name.substring(1),
        priceTTC: `${article.price} €`,
        quantity: article.quantity,
        sellQuantity: 0,
        retrieveQuantity: 0,
      };
    });
    const stockRows = stockRowsMapped.map((article) => {
      return Object.values(article);
    });

    // Handle Table
    doc.autoTable({
      head: [
        [
          t("article"),
          t("price_ttc"),
          t("actual_quantity"),
          t("sell_quantity"),
          t("retrieve_quantity"),
        ],
      ],
      body: stockRows,
      columnStyles: {
        1: { halign: "center" },
        2: { halign: "center" },
        3: { halign: "center" },
        4: { halign: "center" },
      },
      startY: 9.3,
      headStyles: {
        fillColor: "#FECD08",
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
      doc.text(`Page ${j} / ${pages}`, horizontalPos, verticalPos);
    }

    // doc.setFontSize(10);

    doc.save(`Stock ${name}.pdf`);
  };
  if (loaded) {
    return (
      <div className="container">
        <h3>{t("create")}</h3>
        <div className="creation">
          <label>{t("client")}</label>
          <Select
            options={clientOptions}
            isClearable
            placeholder={t("client_placeholder")}
            className="select"
            isSearchable
            onChange={(e) => {
              if (e) {
                setClient(e.value);
              } else {
                setClient({ name: "", address: "" });
              }
            }}
          />
          <label>{t("stock_name")}</label>
          <input
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            type="text"
          />
        </div>
        <button onClick={() => generateIncome()} type="button">
          {t("download")}
        </button>
      </div>
    );
  }
  return <></>;
};

export default CreateStock;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["stock"])),
    },
  };
}
