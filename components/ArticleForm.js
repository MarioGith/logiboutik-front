import React from "react";
import Select from "react-select";
import { useTranslation } from "next-i18next";

// Name, price and shop fields, shared by the create and edit pages.
// `article` is { name, price, shop } where shop is the shop id.
export const checkArticle = (article, t) => {
  if (!article.name?.trim()) return t("name_required");
  const price = Number(String(article.price ?? "").replace(",", "."));
  if (article.price === "" || article.price == null || !(price >= 0)) {
    return t("price_required");
  }
  if (!article.shop) return t("shop_required");
  return null;
};

const ArticleForm = ({ article, shopOptions, onChange }) => {
  const { t } = useTranslation("article");
  return (
    <>
      <label htmlFor="name">{t("name")}</label>
      <input
        id="name"
        value={article.name ?? ""}
        onChange={(e) =>
          onChange({ ...article, name: e.target.value.toLowerCase() })
        }
        type="text"
      />

      <label htmlFor="price">{t("price")}</label>
      <input
        id="price"
        value={article.price ?? ""}
        onChange={(e) => onChange({ ...article, price: e.target.value })}
        type="text"
        inputMode="decimal"
      />

      <label htmlFor="shop">{t("shop")}</label>
      <Select
        inputId="shop"
        options={shopOptions}
        value={
          shopOptions.find((option) => option.value === article.shop) ?? null
        }
        isClearable
        isSearchable
        placeholder={t("shop_placeholder")}
        className="select"
        onChange={(option) =>
          onChange({ ...article, shop: option ? option.value : "" })
        }
      />
    </>
  );
};

export default ArticleForm;
