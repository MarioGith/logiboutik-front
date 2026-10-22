import Link from "next/link";
import { useTranslation } from "next-i18next";
import { withTranslations } from "../utils/i18n";

const ServerError = () => {
  const { t } = useTranslation("common");
  return (
    <div className="container">
      <h3>{t("errors.server_error")}</h3>
      <Link href="/" className="status">
        {t("back_home")}
      </Link>
    </div>
  );
};

export default ServerError;

export const getStaticProps = withTranslations();
