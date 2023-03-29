export const initialState = {
  name: "",
  adress: "",
  phone: "",
  website: "",
  client: [],
};

export const CompanyReducer = (state, action) => {
  switch (action.type) {
    case "init_stored": {
      return action.value;
    }
    case "modify_company": {
      return {
        ...action.value,
      };
    }
    case "add_client": {
      if (!state.client.includes(action.value))
        return {
          ...state,
          client: [...state.client, action.value],
        };
    }
    case "remove_client": {
      return {
        ...state,
        client: state.client.filter((item) => item !== action.value),
      };
    }

    case "modify_client": {
      return {
        ...state,
        client: state.client.map((item) => {
          if (item === action.value.old) {
            return action.value.new;
          }
          return item;
        }),
      };
    }

    case "reset": {
      localStorage.clear();
      return initialState;
    }
  }
};
