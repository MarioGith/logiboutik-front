import { appWithTranslation } from "next-i18next";
import { ToastContainer } from "react-toastify";
import "../styles/global.scss";
import "../styles/theme.scss";
import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";
import { Layout } from "../components";
import { CompanyWrapper } from "../context/CompanyContext";

function App({ Component, pageProps }) {
  return (
    <>
      <CompanyWrapper>
        <Layout>
          <Component {...pageProps} />
          <ToastContainer />
        </Layout>
      </CompanyWrapper>
    </>
  );
}

export default appWithTranslation(App);
