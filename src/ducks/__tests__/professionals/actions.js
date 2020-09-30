import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { actions, types } from "../../professionals";

import { MOCK_PROFESSIONALS_DB_TYPES } from "../../__mocks__/professionals";

import { PROFESSIONALS_DB_URL } from "../../../config/config";

const mockAxios = new MockAdapter(axios);

function mockState(state) {
  return {
    ...state,
    filterTypes: MOCK_PROFESSIONALS_DB_TYPES
  };
}

function mockDBServer(response = []) {
  mockAxios.reset();
  mockAxios
    .onGet(new RegExp(`${PROFESSIONALS_DB_URL}/*`))
    .reply(200, JSON.stringify(response));
}

function asyncDispatch(action, state = mockState({})) {
  const spy = jest.fn();
  const actionResult = action(spy, () => state);
  return {
    actionResult,
    length: spy.mock.calls.length,
    calls: spy.mock.calls,
    spy
  };
}

function assertSync(syncAction) {
  const {
    calls: [syncParams]
  } = asyncDispatch(syncAction);

  expect(syncParams[0].type).toEqual(types.SYNCHRONIZE);
}

describe("setCity()", () => {
  it("should contain correct type and start loading", () => {
    mockDBServer();
    const action = actions.setCity();
    const {
      length,
      calls: [setCityParams, syncDBParams]
    } = asyncDispatch(action);

    expect(length).toEqual(2);
    expect(setCityParams[0].type).toEqual(types.SET_CITY);
    const syncAction = syncDBParams[0];
    assertSync(syncAction);
  });

  it("should contain correct city", () => {
    mockDBServer();
    const action = actions.setCity("Berlin");
    const {
      calls: [params]
    } = asyncDispatch(action);

    expect(params[0].payload).toEqual("Berlin");
  });
});

describe("addType", () => {
  it("should add the type of the professional and start loading", () => {
    mockDBServer();
    const action = actions.addFilter("T1");
    const {
      length,
      calls: [params, syncDBParams]
    } = asyncDispatch(action);

    expect(length).toEqual(2);
    expect(params[0].payload).toEqual("T1");
    expect(params[0].type).toEqual(types.ADD_FILTERS);
    const syncAction = syncDBParams[0];
    assertSync(syncAction);
  });
});

describe("removeType", () => {
  it("should remove the type of the professional and start loading", () => {
    mockDBServer();
    const action = actions.removeFilter("T1");
    const {
      length,
      calls: [params, syncDBParams]
    } = asyncDispatch(action);

    expect(length).toEqual(2);
    expect(params[0].payload).toEqual("T1");
    expect(params[0].type).toEqual(types.REMOVE_FILTERS);
    const syncAction = syncDBParams[0];
    assertSync(syncAction);
  });
});

describe("setShowRemote", () => {
  it("should set the showRemote flag and start loading", () => {
    mockDBServer();
    const action = actions.setShowRemote(true);
    const {
      length,
      calls: [params, syncDBParams]
    } = asyncDispatch(action);

    expect(length).toEqual(2);
    expect(params[0].payload).toEqual(true);
    expect(params[0].type).toEqual(types.SET_SHOW_REMOTE);
    const syncAction = syncDBParams[0];
    assertSync(syncAction);
  });
});
