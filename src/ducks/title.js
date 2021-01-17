import { WEBSITE_TITLE } from "../config/config";

export const types = {
  SET_TITLE: "sensitive/title/SET_TITLE"
};

export const actions = {
  setTitle(title) {
    return {
      type: types.SET_TITLE,
      payload: title
    };
  }
};

const DEFAULT_STATE = {
  defaultTitle: WEBSITE_TITLE
};

export default function reducer(state = DEFAULT_STATE, action) {
  switch (action.type) {
    case types.SET_TITLE:
      return {
        ...state,
        title: action.payload
      };
    default:
      return state;
  }
}
