/* eslint-disable no-underscore-dangle */

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";

const List = (props) => {
  const { data, url } = props;
  const { t } = useTranslation(url.split("/")[1]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (data.length !== 0) {
      setLoading(false);
    }
  }, [data.length]);

  if (loading === false) {
    const header = Object.keys(data[0]);
    header.shift();
    return (
      <div className="list">
        <table>
          <thead>
            <tr>
              {header.map((head) => (
                <th key={head}>{t(head, { ns: url.split("/")[1] })}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((dat) => {
              return (
                <tr key={dat._id}>
                  {header.map((key) => {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <td key={key}>
                        <Link href={`${url}/${dat._id}`}>{dat[key]}</Link>
                      </td>
                    );
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
