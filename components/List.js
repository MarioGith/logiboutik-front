/* eslint-disable no-underscore-dangle */

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";

const List = (props) => {
  const { data, url } = props;
  const { t } = useTranslation(url.split("/")[1]);
  const [loading, setLoading] = useState(true);

  const [inputText, setInputText] = useState("");

  const inputHandler = (e) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    setInputText(lowerCase);
  };

  useEffect(() => {
    if (data.length !== 0) {
      setLoading(false);
    }
  }, [data.length]);

  if (loading === false) {
    const header = Object.keys(data[0]);
    header.shift();
    header.pop();

    const filtered_data = data.filter((dat) => {
      return (
        Object.values(dat.article).join(" ").toLowerCase().includes(inputText) +
        dat.date.includes(inputText)
      );
    });

    return (
      <div className="list">
        <div class="search__container">
          <p class="search__title">{"Let's search"}</p>
          <input
            class="search__input"
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
            {filtered_data.map((dat) => {
              return (
                <tr key={dat._id}>
                  {header.map((key) => {
                    if (dat[key]["_id"] !== undefined) {
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
  } else {
    return <div>Data is empty</div>;
  }
};

export default List;
