// Company details and client list, saved in the browser (localStorage).
export const initialState = {
  name: "",
  adress: "", // historical spelling, kept so existing saved data still loads
  phone: "",
  website: "",
  client: [], // [{ name, address, city }]
};

const sameName = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

export const CompanyReducer = (state, action) => {
  switch (action.type) {
    // Data saved by any older version is completed with the missing fields.
    case "init_stored":
      return { ...initialState, ...action.value };

    // Only the company fields: the client list is left untouched.
    case "modify_company": {
      const { name, adress, phone, website } = action.value;
      return { ...state, name, adress, phone, website };
    }

    case "add_client":
      if (state.client.some((c) => sameName(c.name, action.value.name))) {
        return state;
      }
      return { ...state, client: [...state.client, action.value] };

    case "remove_client":
      return {
        ...state,
        client: state.client.filter((c) => !sameName(c.name, action.value)),
      };

    case "reset":
      return initialState;

    default:
      return state;
  }
};
