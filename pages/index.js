import React, { useState, useEffect } from "react";
import { Handler } from "../services";
import { Button } from "../components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { toast } from "react-toastify";
import { useTranslation } from "next-i18next";

const Dashboard = () => {
  const { t } = useTranslation("dashboard");
  const [loaded, setLoaded] = useState(false);
  const [totalSell, setTotalSell] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [backingUp, setBackingUp] = useState(false);

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

  const handleBackup = async () => {
    setBackingUp(true);
    try {
      const backup = await Handler.getBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], {
        type: "application/json",
      });
      const stamp = new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/:/g, "-");
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `logiboutik-backup-${stamp}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast(t("backup_success"), { type: "success" });
    } catch (err) {
      toast(err.message, { type: "error" });
    } finally {
      setBackingUp(false);
    }
  };

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
        <Button
          onClick={handleBackup}
          label={backingUp ? t("backup_running") : t("backup")}
        />
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
