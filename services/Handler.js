import APIHelper from "./APIHelper";

const Handler = {};

Handler.list = async (url) => {
  const docs = await APIHelper.get(`/${url}`);
  return docs.data;
};

Handler.get = async (url, _id) => {
  const docs = await APIHelper.get(`/${url}/${_id}`);
  return docs.data;
};

Handler.create = async (url, newObject) => {
  const docs = await APIHelper.post(`/${url}`, newObject);
  return docs;
};

Handler.update = async (url, _id, updatedObject) => {
  // eslint-disable-next-line no-underscore-dangle
  const docs = await APIHelper.post(`/${url}/${_id}`, updatedObject);
  return docs;
};

Handler.delete = async (url, _id) => {
  const docs = await APIHelper.delete(`/${url}/${_id}`);
  return docs;
};

Handler.getTotalIncome = async (url) => {
  const docs = await APIHelper.get(`/${url}/income`);
  return docs.data;
};

Handler.getTotalSell = async (url) => {
  const docs = await APIHelper.get(`/${url}/sell`);
  return docs.data;
};

Handler.getIncome = async (startDate, endDate) => {
  const docs = await APIHelper.get("/income", {
    params: { startDate, endDate },
  });
  return docs.data;
};

Handler.getStock = async () => {
  const docs = await APIHelper.get("/stock");
  return docs.data;
};

export default Handler;
