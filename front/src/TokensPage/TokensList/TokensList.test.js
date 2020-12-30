import React from "react";
import { shallow } from "enzyme";
import renderer from "react-test-renderer";
import TokensList from "./index";

describe("<TokensList />", () => {
  const mockEpicTokenStore = {
    tokens: [{ index: 0, epic: ["#fff", "#000"] }]
  };
  const mockModalStore = {
    modalStore: jest.fn()
  };

  it("renders and matches the snapshot", () => {
    const component = renderer.create(
      <TokensList.wrappedComponent
        epicTokenStore={mockEpicTokenStore}
        modalStore={mockModalStore}
      />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
