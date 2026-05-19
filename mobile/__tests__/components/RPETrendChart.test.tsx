import React from "react";
import { render, screen } from "@testing-library/react-native";

// Mock react-native-svg
jest.mock("react-native-svg", () => ({
  __esModule: true,
  default: ({ children }: any) => children,
  Polyline: "Polyline",
  Line: "Line",
  Circle: "Circle",
}));

import { RPETrendChart } from "../../components/progress/RPETrendChart";

describe("RPETrendChart", () => {
  it("shows empty state when no data", () => {
    render(<RPETrendChart data={[]} />);
    expect(screen.getByText("No RPE data yet")).toBeTruthy();
  });

  it("shows empty state when all avgRpe are 0", () => {
    const data = [
      { week: "2025-05-05", avgRpe: 0, count: 0 },
      { week: "2025-05-12", avgRpe: 0, count: 0 },
    ];
    render(<RPETrendChart data={data} />);
    expect(screen.getByText("No RPE data yet")).toBeTruthy();
  });

  it("renders week labels when data is present", () => {
    const data = [
      { week: "2025-05-05", avgRpe: 5, count: 3 },
      { week: "2025-05-12", avgRpe: 7, count: 4 },
    ];
    render(<RPETrendChart data={data} />);
    expect(screen.getByText("May 5")).toBeTruthy();
    expect(screen.getByText("May 12")).toBeTruthy();
  });
});
