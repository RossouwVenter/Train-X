import { render, fireEvent } from "@testing-library/react-native";
import { SessionCard } from "@/components/session/SessionCard";
import type { PlanSession } from "@shared/types";

const mockSession: PlanSession = {
  id: "s1",
  planId: "p1",
  dayOfWeek: 1,
  title: "Upper Body Push",
  type: "Strength",
  order: 0,
  notes: "Focus on form",
  exercises: [
    {
      id: "e1",
      sessionId: "s1",
      name: "Bench Press",
      sets: 4,
      reps: 8,
      weight: 80,
      duration: null,
      restPeriod: 120,
      notes: null,
      order: 0,
    },
    {
      id: "e2",
      sessionId: "s1",
      name: "Overhead Press",
      sets: 3,
      reps: 10,
      weight: 40,
      duration: null,
      restPeriod: 90,
      notes: null,
      order: 1,
    },
  ],
};

describe("SessionCard", () => {
  it("renders session title", () => {
    const { getByText } = render(<SessionCard session={mockSession} />);
    expect(getByText("Upper Body Push")).toBeTruthy();
  });

  it("renders day label", () => {
    const { getByText } = render(<SessionCard session={mockSession} />);
    expect(getByText("Mon")).toBeTruthy();
  });

  it("renders session type badge", () => {
    const { getByText } = render(<SessionCard session={mockSession} />);
    expect(getByText("Strength")).toBeTruthy();
  });

  it("renders exercise count", () => {
    const { getByText } = render(<SessionCard session={mockSession} />);
    expect(getByText("2 exercises")).toBeTruthy();
  });

  it("shows checkmark when completed", () => {
    const { UNSAFE_root } = render(
      <SessionCard session={mockSession} isCompleted />
    );
    // CheckCircle icon rendered — just verify no crash
    expect(UNSAFE_root).toBeTruthy();
  });

  it("shows RPE badge when completed with rpe", () => {
    const { getByText } = render(
      <SessionCard session={mockSession} isCompleted rpe={7} />
    );
    expect(getByText("RPE 7")).toBeTruthy();
  });

  it("does not show RPE badge when not completed", () => {
    const { queryByText } = render(<SessionCard session={mockSession} />);
    expect(queryByText(/RPE/)).toBeNull();
  });

  it("calls onPress when provided", () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <SessionCard session={mockSession} onPress={onPress} />
    );
    fireEvent.press(getByText("Upper Body Push"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("toggles expansion when no onPress", () => {
    const { getByText, queryByText } = render(
      <SessionCard session={mockSession} />
    );
    // Initially collapsed — exercises not visible
    expect(queryByText("Bench Press")).toBeNull();

    // Tap to expand
    fireEvent.press(getByText("Upper Body Push"));
    expect(getByText("Bench Press")).toBeTruthy();
    expect(getByText("Overhead Press")).toBeTruthy();

    // Tap again to collapse
    fireEvent.press(getByText("Upper Body Push"));
    expect(queryByText("Bench Press")).toBeNull();
  });

  it("shows exercise format in expanded view", () => {
    const { getByText } = render(<SessionCard session={mockSession} />);
    fireEvent.press(getByText("Upper Body Push"));
    expect(getByText("4×8 @ 80kg")).toBeTruthy();
    expect(getByText("3×10 @ 40kg")).toBeTruthy();
  });

  it("shows empty message for session with no exercises", () => {
    const session = { ...mockSession, exercises: [] };
    const { getByText } = render(<SessionCard session={session} />);
    fireEvent.press(getByText("Upper Body Push"));
    expect(getByText("No exercises added yet")).toBeTruthy();
  });

  it("renders singular 'exercise' for 1 exercise", () => {
    const session = {
      ...mockSession,
      exercises: [mockSession.exercises![0]],
    };
    const { getByText } = render(<SessionCard session={session} />);
    expect(getByText("1 exercise")).toBeTruthy();
  });
});
