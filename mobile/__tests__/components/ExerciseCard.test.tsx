import { render } from "@testing-library/react-native";
import { ExerciseCard } from "@/components/session/ExerciseCard";
import type { SessionExercise } from "@shared/types";

const mockExercise: SessionExercise = {
  id: "e1",
  sessionId: "s1",
  name: "Bench Press",
  sets: 4,
  reps: 8,
  weight: 80,
  duration: null,
  restPeriod: 120,
  notes: "Control the negative",
  order: 0,
};

describe("ExerciseCard", () => {
  it("renders exercise name", () => {
    const { getByText } = render(
      <ExerciseCard exercise={mockExercise} index={0} />
    );
    expect(getByText("Bench Press")).toBeTruthy();
  });

  it("renders index number (1-based)", () => {
    const { getByText } = render(
      <ExerciseCard exercise={mockExercise} index={0} />
    );
    expect(getByText("1")).toBeTruthy();
  });

  it("renders prescribed format", () => {
    const { getByText } = render(
      <ExerciseCard exercise={mockExercise} index={0} />
    );
    expect(getByText("4×8 @ 80kg")).toBeTruthy();
  });

  it("renders rest period", () => {
    const { getByText } = render(
      <ExerciseCard exercise={mockExercise} index={0} />
    );
    expect(getByText("Rest: 120s")).toBeTruthy();
  });

  it("renders notes", () => {
    const { getByText } = render(
      <ExerciseCard exercise={mockExercise} index={0} />
    );
    expect(getByText("Control the negative")).toBeTruthy();
  });

  it("renders actual values when provided", () => {
    const { getByText } = render(
      <ExerciseCard
        exercise={mockExercise}
        index={0}
        actual={{ sets: 4, reps: 7, weight: 75 }}
      />
    );
    expect(getByText("4×7 @ 75kg")).toBeTruthy();
  });

  it("hides rest period when not set", () => {
    const ex = { ...mockExercise, restPeriod: null };
    const { queryByText } = render(
      <ExerciseCard exercise={ex} index={0} />
    );
    expect(queryByText(/Rest:/)).toBeNull();
  });

  it("hides notes when not set", () => {
    const ex = { ...mockExercise, notes: null };
    const { queryByText } = render(
      <ExerciseCard exercise={ex} index={0} />
    );
    expect(queryByText("Control the negative")).toBeNull();
  });

  it("renders duration when set", () => {
    const ex = { ...mockExercise, duration: 60, weight: null };
    const { getByText } = render(
      <ExerciseCard exercise={ex} index={0} />
    );
    expect(getByText("4×8 · 60s")).toBeTruthy();
  });

  it("renders without weight", () => {
    const ex = { ...mockExercise, weight: null };
    const { getByText } = render(
      <ExerciseCard exercise={ex} index={0} />
    );
    expect(getByText("4×8")).toBeTruthy();
  });
});
