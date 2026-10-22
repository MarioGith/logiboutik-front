import Link from "next/link";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const LINKS = ["transaction", "article", "shop", "income", "stock", "company"];

const Header = () => {
  const { pathname } = useRouter();
  const { t } = useTranslation("common");

  return (
    <header>
      <Link href="/" className="logo">
        Logiboutik
      </Link>

      <nav>
        <ul>
          {LINKS.map((link) => (
            <li key={link}>
              <Link
                href={`/${link}`}
                className={
                  pathname.startsWith(`/${link}`) ? "header-active" : ""
                }
              >
                {t(`menu.${link}`)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
