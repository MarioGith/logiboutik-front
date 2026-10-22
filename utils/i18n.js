import { serverSideTranslations } from "next-i18next/serverSideTranslations";

// getStaticProps shared by every page: loads the page's translation files
// plus "common" (menu, buttons, error messages).
export const withTranslations =
  (namespaces = []) =>
  async ({ locale }) => ({
    props: {
      ...(await serverSideTranslations(locale, ["common", ...namespaces])),
    },
  });

// Pages with an id in the URL are rendered on demand, not at build time.
export const onDemandPaths = async () => ({ paths: [], fallback: "blocking" });
