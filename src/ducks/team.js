import axios from "axios";
import { TEAM_DB_URL, TEAM_IMAGES_URL } from "../config/config";
import createDataSyncDuck from "../lib/create-data-sync-duck/create-data-sync-duck";

function reducer(state = {}, action = {}) {
  const { rawData = [] } = state;
  const data = rawData.map(({ picture, ...member }) => ({
    ...member,
    picture: `${TEAM_IMAGES_URL}/${picture}`
  }));
  switch (action.type) {
    case types.SYNCHRONIZE_DONE:
      return {
        ...state,
        admins: data.filter((member) => member.admin === "TRUE"),
        moderators: data.filter((member) => member.admin !== "TRUE")
      };
    default:
      return state;
  }
}

const dataSyncDuck = createDataSyncDuck(TEAM_DB_URL, reducer, "team");

export const actions = dataSyncDuck.actions;
export const types = dataSyncDuck.types;
export default dataSyncDuck.reducer;
