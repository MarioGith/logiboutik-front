import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { Handler } from "../services";
import { Button } from "../components";
import { formatPrice, notifyError, notifySuccess } from "../utils";
import { withTranslations } from "../utils/i18n";

function downloadJson(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

const Dashboard = () => {
  const { t } = useTranslation(["dashboard", "common"]);
  const [totals, setTotals] = useState(null);
  const [backingUp, setBackingUp] = useState(false);

  useEffect(() => {
    Promise.all([
      Handler.getTotalSell("dashboard"),
      Handler.getTotalIncome("dashboard"),
    ])
      .then(([sell, income]) => setTotals({ sell, income }))
      .catch((err) => notifyError(err, t));
  }, [t]);

  const handleBackup = async () => {
    setBackingUp(true);
    try {
      const stamp = new Date().toISOString().slice(0, 19).replace(/:/g, "-");
      downloadJson(
        await Handler.getBackup(),
        `logiboutik-backup-${stamp}.json`,
      );
      notifySuccess(t("backup_success"));
    } catch (err) {
      notifyError(err, t);
    } finally {
      setBackingUp(false);
    }
  };

  return (
    <div className="container">
      {totals ? (
        <div>
          <h2>
            {t("total_sell")} : {totals.sell}
          </h2>
          <h2>
            {t("total_income")} : {formatPrice(totals.income)}
          </h2>
        </div>
      ) : (
        <p className="status">{t("loading", { ns: "common" })}</p>
      )}
      <Button
        onClick={handleBackup}
        disabled={backingUp}
        label={backingUp ? t("backup_running") : t("backup")}
      />
    </div>
  );
};

export default Dashboard;

export const getStaticProps = withTranslations(["dashboard"]);
