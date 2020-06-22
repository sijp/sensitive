import axios from "axios";
import MockAdapter from "axios-mock-adapter";

import { actions, types } from "../../professionals";

import { MOCK_SIMPLE_TRAINERS } from "../../__mocks__/professionals";

import {
  PROFESSIONALS_DB_URL,
  PROFESSIONALS_DB_TYPES,
  PROFESSIONALS_DB_CACHE_VALIDITY
} from "../../../config/config";

const mockAxios = new MockAdapter(axios);

function mockDBServer(responses = []) {
  mockAxios.reset();
  responses.forEach((response, i) =>
    mockAxios
      .onGet(`${PROFESSIONALS_DB_URL}/${PROFESSIONALS_DB_TYPES[i]}.csv`)
      .reply(200, response)
  );
  mockAxios.onGet(new RegExp(`${PROFESSIONALS_DB_URL}/*`)).reply(200, "");
}

function asyncDispatch(action, state = {}) {
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

describe("synchronize()", () => {
  mockDBServer();
  it("should dispatch SYNCHRONIZE and later SYNCHRONIZE_DONE", async () => {
    mockDBServer();
    const action = actions.synchronize();
    const { calls, actionResult } = asyncDispatch(action);
    expect(calls.length).toEqual(1);

    const syncParams = calls[0];
    expect(syncParams[0].type).toEqual(types.SYNCHRONIZE);

    await actionResult;

    expect(calls.length).toEqual(2);
    const syncDoneParams = calls[1];
    expect(syncDoneParams[0].type).toEqual(types.SYNCHRONIZE_DONE);
  });

  it("should send ajax request cache is old", async () => {
    const { csv: fakeData, json: processedFakeData } = MOCK_SIMPLE_TRAINERS;
    mockDBServer([fakeData]);

    const action = actions.synchronize();
    const state = {
      lastSync: Date.now() - PROFESSIONALS_DB_CACHE_VALIDITY
    };

    const { calls, actionResult } = asyncDispatch(action, state);

    const resolvedActionResult = await actionResult;

    expect(resolvedActionResult).toEqual(processedFakeData);
    const syncDoneParams = calls[1];

    expect(syncDoneParams[0].payload).toEqual(processedFakeData);
  });

  it("should use cache if it is valid", async () => {
    const action = actions.synchronize();
    const rawData = "RAW_DATA";
    const state = {
      lastSync: Date.now(),
      rawData
    };
    const { actionResult } = asyncDispatch(action, state);
    const result = await actionResult;
    expect(result).toEqual(rawData);
  });
});
