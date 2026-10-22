import Link from "next/link";
import { useTranslation } from "next-i18next";
import { withTranslations } from "../utils/i18n";

const NotFound = () => {
  const { t } = useTranslation("common");
  return (
    <div className="container">
      <h3>{t("page_not_found")}</h3>
      <Link href="/" className="status">
        {t("back_home")}
      </Link>
    </div>
  );
};

export default NotFound;

export const getStaticProps = withTranslations();
