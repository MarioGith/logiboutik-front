const setForSelect = (data) => {
  const options = data.map((art) => {
    // eslint-disable-next-line no-underscore-dangle
    return { value: art._id, label: art.name };
  });
  return options;
};

export default setForSelect;
