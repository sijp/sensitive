import { types, actions } from "../../professionals.v2";

describe("setCity()", () => {
  it("should set city", () => {
    const city = "Berlin";
    const result = actions.setCity(city);
    expect(result).toEqual({
      type: types.SET_CITY,
      payload: city
    });
  });
});

describe("addFilter()", () => {
  it("should add Filter", () => {
    const filter = "Trainer";
    const result = actions.addFilter(filter);
    expect(result).toEqual({
      type: types.ADD_FILTER,
      payload: filter
    });
  });
});

describe("removeFilter()", () => {
  it("should remove Filter", () => {
    const filter = "Trainer";
    const result = actions.removeFilter(filter);
    expect(result).toEqual({
      type: types.REMOVE_FILTER,
      payload: filter
    });
  });
});

describe("setFilters()", () => {
  it("should set filters", () => {
    const filters = ["walker", "trainer"];
    const result = actions.setFilters(filters);
    expect(result).toEqual({
      type: types.SET_FILTERS,
      payload: filters
    });
  });
});

describe("setShowRemote()", () => {
  it("should set Remote", () => {
    const show = true;
    const result = actions.setShowRemote(show);
    expect(result).toEqual({
      type: types.SET_SHOW_REMOTE,
      payload: show
    });
  });
});
