import { render, fireEvent } from "@testing-library/react-native";
import { PlanCard } from "@/components/training/PlanCard";
import type { TrainingPlan } from "@shared/types";

const mockPlan: TrainingPlan = {
  id: "p1",
  athleteId: "a1",
  coachId: "c1",
  name: "Strength Block A",
  description: "8-week hypertrophy focus",
  weekStartDate: "2026-05-11",
  status: "ACTIVE",
  sessions: [
    {
      id: "s1",
      planId: "p1",
      dayOfWeek: 1,
      title: "Upper Body",
      type: "Strength",
      order: 0,
      exercises: [],
    },
    {
      id: "s2",
      planId: "p1",
      dayOfWeek: 3,
      title: "Lower Body",
      type: "Strength",
      order: 1,
      exercises: [],
    },
  ],
  createdAt: "2026-05-01T00:00:00Z",
  updatedAt: "2026-05-10T00:00:00Z",
};

describe("PlanCard", () => {
  it("renders plan name", () => {
    const { getByText } = render(
      <PlanCard plan={mockPlan} onPress={jest.fn()} />
    );
    expect(getByText("Strength Block A")).toBeTruthy();
  });

  it("renders plan description", () => {
    const { getByText } = render(
      <PlanCard plan={mockPlan} onPress={jest.fn()} />
    );
    expect(getByText("8-week hypertrophy focus")).toBeTruthy();
  });

  it("renders status badge", () => {
    const { getByText } = render(
      <PlanCard plan={mockPlan} onPress={jest.fn()} />
    );
    expect(getByText("ACTIVE")).toBeTruthy();
  });

  it("renders session count", () => {
    const { getByText } = render(
      <PlanCard plan={mockPlan} onPress={jest.fn()} />
    );
    expect(getByText("2 sessions")).toBeTruthy();
  });

  it("renders singular 'session' for 1 session", () => {
    const plan = { ...mockPlan, sessions: [mockPlan.sessions![0]] };
    const { getByText } = render(
      <PlanCard plan={plan} onPress={jest.fn()} />
    );
    expect(getByText("1 session")).toBeTruthy();
  });

  it("calls onPress when tapped", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <PlanCard plan={mockPlan} onPress={onPress} />
    );
    fireEvent.press(getByText("Strength Block A"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("renders DRAFT status correctly", () => {
    const plan = { ...mockPlan, status: "DRAFT" as const };
    const { getByText } = render(
      <PlanCard plan={plan} onPress={jest.fn()} />
    );
    expect(getByText("DRAFT")).toBeTruthy();
  });

  it("handles plan without description", () => {
    const plan = { ...mockPlan, description: null };
    const { getByText, queryByText } = render(
      <PlanCard plan={plan} onPress={jest.fn()} />
    );
    expect(getByText("Strength Block A")).toBeTruthy();
    expect(queryByText("8-week hypertrophy focus")).toBeNull();
  });
});
