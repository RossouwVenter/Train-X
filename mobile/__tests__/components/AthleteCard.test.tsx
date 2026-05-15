import { render, fireEvent } from "@testing-library/react-native";
import { AthleteCard } from "@/components/training/AthleteCard";
import type { AthleteWithProfile } from "@shared/types";

const mockAthlete: AthleteWithProfile = {
  id: "a1",
  name: "John Doe",
  email: "john@example.com",
  athleteProfile: {
    id: "ap1",
    userId: "a1",
    sport: "Running",
    level: "Intermediate",
    goals: "Run a marathon",
    injuries: null,
  },
  lastActivity: new Date().toISOString(),
};

describe("AthleteCard", () => {
  it("renders athlete name", () => {
    const { getByText } = render(
      <AthleteCard athlete={mockAthlete} onPress={jest.fn()} />
    );
    expect(getByText("John Doe")).toBeTruthy();
  });

  it("renders sport from profile", () => {
    const { getByText } = render(
      <AthleteCard athlete={mockAthlete} onPress={jest.fn()} />
    );
    expect(getByText("Running")).toBeTruthy();
  });

  it("renders initials in avatar", () => {
    const { getByText } = render(
      <AthleteCard athlete={mockAthlete} onPress={jest.fn()} />
    );
    expect(getByText("J")).toBeTruthy();
  });

  it("calls onPress when tapped", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <AthleteCard athlete={mockAthlete} onPress={onPress} />
    );
    fireEvent.press(getByText("John Doe"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("shows 'No activity yet' when lastActivity is null", () => {
    const athlete = { ...mockAthlete, lastActivity: null };
    const { getByText } = render(
      <AthleteCard athlete={athlete} onPress={jest.fn()} />
    );
    expect(getByText("No activity yet")).toBeTruthy();
  });

  it("handles athlete with no sport", () => {
    const athlete = {
      ...mockAthlete,
      athleteProfile: { ...mockAthlete.athleteProfile, sport: null },
    };
    const { getByText, queryByText } = render(
      <AthleteCard athlete={athlete as any} onPress={jest.fn()} />
    );
    expect(getByText("John Doe")).toBeTruthy();
    expect(queryByText("Running")).toBeNull();
  });
});
