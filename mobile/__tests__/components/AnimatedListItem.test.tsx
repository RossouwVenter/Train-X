import React from "react";
import { render, screen } from "@testing-library/react-native";

// Mock moti
jest.mock("moti", () => ({
  MotiView: ({ children }: { children: React.ReactNode }) => children,
}));

import { AnimatedListItem } from "../../components/ui/AnimatedListItem";

import { Text } from "react-native";

describe("AnimatedListItem", () => {
  it("renders children", () => {
    render(
      <AnimatedListItem index={0}>
        <Text>Test Content</Text>
      </AnimatedListItem>
    );
    expect(screen.getByText("Test Content")).toBeTruthy();
  });

  it("renders with custom delay prop", () => {
    render(
      <AnimatedListItem index={2} delay={100}>
        <Text>Delayed</Text>
      </AnimatedListItem>
    );
    expect(screen.getByText("Delayed")).toBeTruthy();
  });
});
