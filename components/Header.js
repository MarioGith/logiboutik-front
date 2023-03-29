import Link from "next/link";
import { useRouter } from "next/router";

const Header = () => {
  const { pathname } = useRouter();
  return (
    <header>
      <Link href="/" className="logo">
        Logiboutik
      </Link>

      <ul>
        <li>
          <Link
            href="/transaction"
            className={pathname === "/transaction" ? "header-active" : ""}
          >
            Transaction
          </Link>
        </li>

        <li>
          <Link
            href="/article"
            className={pathname === "/article" ? "header-active" : ""}
          >
            Article
          </Link>
        </li>

        <li>
          <Link
            href="/shop"
            className={pathname === "/shop" ? "header-active" : ""}
          >
            Shop
          </Link>
        </li>

        <li>
          <Link
            href="/income"
            className={pathname === "/income" ? "header-active" : ""}
          >
            Income
          </Link>
        </li>

        <li>
          <Link
            href="/stock"
            className={pathname === "/stock" ? "header-active" : ""}
          >
            Stock
          </Link>
        </li>

        <li>
          <Link
            href="/company"
            className={pathname === "/company" ? "header-active" : ""}
          >
            Company
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
