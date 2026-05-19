import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import { Text } from "react-native";

// Mock expo-haptics
const mockImpactAsync = jest.fn();
const mockSelectionAsync = jest.fn();
const mockNotificationAsync = jest.fn();
jest.mock("expo-haptics", () => ({
  impactAsync: (...args: any[]) => mockImpactAsync(...args),
  selectionAsync: () => mockSelectionAsync(),
  notificationAsync: (...args: any[]) => mockNotificationAsync(...args),
  ImpactFeedbackStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
  NotificationFeedbackType: { Success: "success", Error: "error" },
}));

import { HapticPressable } from "../../components/ui/HapticPressable";

describe("HapticPressable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders children", () => {
    render(
      <HapticPressable>
        <Text>Tap me</Text>
      </HapticPressable>
    );
    expect(screen.getByText("Tap me")).toBeTruthy();
  });

  it("triggers light haptic by default on press", () => {
    const onPress = jest.fn();
    render(
      <HapticPressable onPress={onPress}>
        <Text>Press</Text>
      </HapticPressable>
    );
    fireEvent.press(screen.getByText("Press"));
    expect(mockImpactAsync).toHaveBeenCalledWith("light");
    expect(onPress).toHaveBeenCalled();
  });

  it("triggers medium haptic when specified", () => {
    render(
      <HapticPressable haptic="medium">
        <Text>Medium</Text>
      </HapticPressable>
    );
    fireEvent.press(screen.getByText("Medium"));
    expect(mockImpactAsync).toHaveBeenCalledWith("medium");
  });

  it("triggers selection haptic", () => {
    render(
      <HapticPressable haptic="selection">
        <Text>Select</Text>
      </HapticPressable>
    );
    fireEvent.press(screen.getByText("Select"));
    expect(mockSelectionAsync).toHaveBeenCalled();
  });

  it("triggers success notification haptic", () => {
    render(
      <HapticPressable haptic="success">
        <Text>Success</Text>
      </HapticPressable>
    );
    fireEvent.press(screen.getByText("Success"));
    expect(mockNotificationAsync).toHaveBeenCalledWith("success");
  });
});
