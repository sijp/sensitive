import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import createDataSyncDuck from "../create-data-sync-duck";

const mockAxios = new MockAdapter(axios);
const DB_URL = "http://test/";
const DB_CACHE_VALIDITY = 5 * 60;

function mockDBServer(response = [], url = DB_URL) {
  mockAxios.reset();
  mockAxios.onGet(url).reply(200, JSON.stringify(response));
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

describe("synchronize()", () => {
  it("should dispatch SYNCHRONIZE and later SYNCHRONIZE_DONE", async () => {
    mockDBServer([], new RegExp(`${DB_URL}/*`));
    const { actions, types } = createDataSyncDuck(DB_URL);
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

  it("should do nothing if predicate returns false", async () => {
    const { actions } = createDataSyncDuck(
      DB_URL,
      undefined,
      undefined,
      () => false
    );
    const action = actions.synchronize();
    const state = {};
    const { calls, actionResult } = asyncDispatch(action, state);
    await actionResult;
    expect(calls.length).toEqual(0);
  });

  it("should send ajax request cache is old", async () => {
    const { actions } = createDataSyncDuck(DB_URL);
    const fakeData = {
      mock: [1, 2, 3]
    };
    mockDBServer(fakeData);

    const action = actions.synchronize();
    const state = {
      lastSync: new Date(Date.now() - DB_CACHE_VALIDITY * 1001)
    };

    const { calls, actionResult } = asyncDispatch(action, state);

    const resolvedActionResult = await actionResult;
    expect(resolvedActionResult).toEqual(fakeData);
    const syncDoneParams = calls[1];

    expect(syncDoneParams[0].payload).toEqual(fakeData);
  });

  it("should use cache if it is valid", async () => {
    const { actions } = createDataSyncDuck(DB_URL);
    const action = actions.synchronize();
    const rawData = "RAW_DATA";
    const state = {
      SYNC: { lastSync: new Date(), rawData }
    };
    const { actionResult } = asyncDispatch(action, state);
    const result = await actionResult;
    expect(result).toEqual(rawData);
  });
});
