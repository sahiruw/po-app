import renderer from "react-test-renderer";
import LoginScreen from "./LoginScreen";

describe("Login", () => {
  it("has 1 child", () => {
    const tree = renderer.create(<LoginScreen />).toJSON();
    expect(tree.children.length).toBe(1);
  });

  it("renders correctly", () => {
    const tree = renderer.create(<LoginScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
