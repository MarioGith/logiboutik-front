import React, { useState, useEffect } from "react";
import { Handler } from "../services";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";

const Dashboard = () => {
  const { t } = useTranslation("dashboard");
  const [loaded, setLoaded] = useState(false);
  const [totalSell, setTotalSell] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const income = await Handler.getTotalIncome("dashboard");
        const sell = await Handler.getTotalSell("dashboard");
        setTotalIncome(income);
        setTotalSell(sell);
        setLoaded(true);
      } catch (err) {
        toast(err.message, { type: "error" });
      }
    }
    loadData();
  }, []);

  if (loaded) {
    return (
      <div className="container">
        <div>
          <h2>
            {t("total_sell")} : {totalSell}
          </h2>
          <h2>
            {t("total_income")} : {totalIncome.toFixed(2)} €
          </h2>
        </div>
      </div>
    );
  }

  return <div className="loader"></div>;
};

export default Dashboard;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["dashboard"])),
      // Will be passed to the page component as props
    },
  };
}
