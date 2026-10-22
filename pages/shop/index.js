import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { List, Button } from "../../components";
import { Handler } from "../../services";
import { capitalize, notifyError } from "../../utils";
import { withTranslations } from "../../utils/i18n";

const ListShop = () => {
  const { t } = useTranslation(["shop", "common"]);
  const router = useRouter();
  const [shops, setShops] = useState(null);

  useEffect(() => {
    Handler.list("shop")
      .then((res) =>
        setShops(res.map((shop) => ({ ...shop, name: capitalize(shop.name) }))),
      )
      .catch((err) => {
        setShops([]);
        notifyError(err, t);
      });
  }, [t]);

  const columns = [
    { key: "name", label: t("name"), link: (row) => `/shop/${row._id}` },
  ];

  return (
    <div className="container">
      <h3>{t("list")}</h3>
      <Button onClick={() => router.push("/shop/create")} label={t("create")} />
      <List data={shops} columns={columns} loading={!shops} />
    </div>
  );
};

export default ListShop;

export const getStaticProps = withTranslations(["shop"]);
