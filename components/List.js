/* eslint-disable no-underscore-dangle */

import React, { useState } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";

const List = (props) => {
  const { data = [], url } = props;
  const { t } = useTranslation(url.split("/")[1]);

  const [inputText, setInputText] = useState("");

  const inputHandler = (e) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  const rows = Array.isArray(data) ? data : [];

  if (rows.length === 0) {
    return <div>Data is empty</div>;
  }

  const header = Object.keys(rows[0]);
  header.shift();
  header.pop();

  return (
    <div className="list">
      <div className="search__container">
        <p className="search__title">{"Let's search"}</p>
        <input
          className="search__input"
          type="text"
          placeholder="Search"
          onChange={inputHandler}
        />
      </div>

      <table>
        <thead>
          <tr>
            {header.map((head) => (
              <th key={head}>{t(head, { ns: url.split("/")[1] })}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((dat) => {
            return (
              <tr key={dat._id}>
                {header.map((key) => {
                  if (dat[key] != null && dat[key]["_id"] !== undefined) {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <td key={key}>
                        <Link href={`${key}/${dat[key]["_id"]}`}>
                          {dat[key]["name"]}
                        </Link>
                      </td>
                    );
                  } else {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <td key={key}>
                        <Link href={`${url}/${dat._id}`}>{dat[key]}</Link>
                      </td>
                    );
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default List;
