import { render, fireEvent } from "@testing-library/react-native";
import { RPESlider } from "@/components/session/RPESlider";
import { MoodSelector } from "@/components/session/MoodSelector";

describe("RPESlider", () => {
  it("renders all 10 RPE values", () => {
    const onChange = jest.fn();
    const { getByText } = render(<RPESlider value={5} onChange={onChange} />);
    for (let i = 1; i <= 10; i++) {
      expect(getByText(String(i))).toBeTruthy();
    }
  });

  it("displays current RPE label", () => {
    const { getByText } = render(<RPESlider value={7} onChange={jest.fn()} />);
    expect(getByText("7 — Very Hard")).toBeTruthy();
  });

  it("calls onChange when a value is tapped", () => {
    const onChange = jest.fn();
    const { getByText } = render(<RPESlider value={5} onChange={onChange} />);
    fireEvent.press(getByText("8"));
    expect(onChange).toHaveBeenCalledWith(8);
  });
});

describe("MoodSelector", () => {
  it("renders all 5 mood options", () => {
    const { getByText } = render(
      <MoodSelector value={null} onChange={jest.fn()} />
    );
    expect(getByText("Great")).toBeTruthy();
    expect(getByText("Good")).toBeTruthy();
    expect(getByText("Okay")).toBeTruthy();
    expect(getByText("Tough")).toBeTruthy();
    expect(getByText("Terrible")).toBeTruthy();
  });

  it("calls onChange when a mood is tapped", () => {
    const onChange = jest.fn();
    const { getByText } = render(
      <MoodSelector value={null} onChange={onChange} />
    );
    fireEvent.press(getByText("🔥"));
    expect(onChange).toHaveBeenCalledWith("GREAT");
  });

  it("shows title text", () => {
    const { getByText } = render(
      <MoodSelector value="GOOD" onChange={jest.fn()} />
    );
    expect(getByText("How did it feel?")).toBeTruthy();
  });
});
