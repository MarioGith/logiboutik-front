import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { List, Button } from "../../components";
import { Handler } from "../../services";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const ListShop = () => {
  const { t } = useTranslation("shop");
  const router = useRouter();
  const [shops, setShops] = useState([]);

  useEffect(() => {
    Handler.list("shop")
      .then((res) => {
        setShops(res);
      })
      .catch((err) => console.log(err));
  }, [shops.length]);

  if (!shops) return <></>;

  return (
    <div className="container">
      <h3>{t("list")}</h3>
      <Button onClick={() => router.push("/shop/create")} label={t("create")} />
      <List data={shops} url="/shop" />
    </div>
  );
};

export default ListShop;

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["shop"])),
    },
  };
}
