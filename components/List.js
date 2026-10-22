import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";

// Table of documents with a search box.
// `columns`: [{ key, label, link }] where `link(row)` returns the URL a cell
// points to. A cell shows `row[key]`, or `row[key].name` for a populated
// relation (e.g. the shop of an article).
const cellText = (value) => {
  if (value == null) return "";
  if (typeof value === "object") return value.name ?? "";
  return String(value);
};

const List = ({ data, columns, loading = false }) => {
  const { t } = useTranslation("common");
  const [search, setSearch] = useState("");

  if (loading) return <p className="status">{t("loading")}</p>;
  if (!data || data.length === 0) {
    return <p className="status">{t("empty")}</p>;
  }

  const query = search.trim().toLowerCase();
  const rows = data.filter((row) =>
    columns.some(({ key }) => cellText(row[key]).toLowerCase().includes(query)),
  );

  return (
    <div className="list">
      <div className="search__container">
        <label className="search__title" htmlFor="list-search">
          {t("search")}
        </label>
        <input
          id="list-search"
          className="search__input"
          type="search"
          placeholder={t("search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr>
            {columns.map(({ key, label }) => (
              <th key={key}>{label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row._id}>
              {columns.map(({ key, link }) => {
                const href = link?.(row);
                const text = cellText(row[key]);
                return (
                  <td key={key}>
                    {href ? <Link href={href}>{text}</Link> : text}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="status">{t("no_result")}</p>}
    </div>
  );
};

export default List;
