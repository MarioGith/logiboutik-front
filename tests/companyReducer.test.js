import { describe, expect, it } from "vitest";
import { CompanyReducer, initialState } from "../context/CompanyReducer";

const client = (name) => ({ name, address: "1 rue", city: "Paris" });

describe("CompanyReducer", () => {
  it("completes data saved by an older version", () => {
    const state = CompanyReducer(initialState, {
      type: "init_stored",
      value: { name: "Boutik" },
    });
    expect(state.client).toEqual([]);
    expect(state.name).toBe("Boutik");
  });

  it("keeps the clients when the company details are saved", () => {
    let state = CompanyReducer(initialState, {
      type: "add_client",
      value: client("a"),
    });
    state = CompanyReducer(state, {
      type: "modify_company",
      value: { ...initialState, name: "Boutik" },
    });
    expect(state.client).toEqual([client("a")]);
    expect(state.name).toBe("Boutik");
  });

  it("refuses duplicate clients and removes by name", () => {
    let state = CompanyReducer(initialState, {
      type: "add_client",
      value: client("a"),
    });
    state = CompanyReducer(state, { type: "add_client", value: client("A ") });
    expect(state.client).toHaveLength(1);
    state = CompanyReducer(state, { type: "remove_client", value: "a" });
    expect(state.client).toEqual([]);
  });
});
