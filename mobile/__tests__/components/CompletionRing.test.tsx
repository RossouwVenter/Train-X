import React from "react";
import { render, screen } from "@testing-library/react-native";

// Mock react-native-svg
jest.mock("react-native-svg", () => ({
  __esModule: true,
  default: ({ children }: any) => children,
  Circle: "Circle",
}));

import { CompletionRing } from "../../components/progress/CompletionRing";

describe("CompletionRing", () => {
  it("renders completion percentage", () => {
    render(
      <CompletionRing percentage={75} completed={15} total={20} />
    );
    expect(screen.getByText("75%")).toBeTruthy();
    expect(screen.getByText("15/20")).toBeTruthy();
  });

  it("renders 0% when no sessions", () => {
    render(
      <CompletionRing percentage={0} completed={0} total={0} />
    );
    expect(screen.getByText("0%")).toBeTruthy();
    expect(screen.getByText("0/0")).toBeTruthy();
  });

  it("caps at 100%", () => {
    render(
      <CompletionRing percentage={150} completed={30} total={20} />
    );
    expect(screen.getByText("100%")).toBeTruthy();
  });
});
