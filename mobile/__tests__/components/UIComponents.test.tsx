import { render } from "@testing-library/react-native";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { BottomSheet } from "@/components/ui/BottomSheet";
import { Dumbbell } from "lucide-react-native";
import { Text } from "react-native";

describe("Badge", () => {
  it("renders label text", () => {
    const { getByText } = render(<Badge label="ACTIVE" />);
    expect(getByText("ACTIVE")).toBeTruthy();
  });

  it("renders with default variant", () => {
    const { getByText } = render(<Badge label="Test" />);
    expect(getByText("Test")).toBeTruthy();
  });

  it("renders each variant without error", () => {
    const variants = ["success", "warning", "danger", "info", "default"] as const;
    variants.forEach((variant) => {
      const { getByText } = render(
        <Badge label={`Badge-${variant}`} variant={variant} />
      );
      expect(getByText(`Badge-${variant}`)).toBeTruthy();
    });
  });
});

describe("EmptyState", () => {
  it("renders title and description", () => {
    const { getByText } = render(
      <EmptyState
        icon={Dumbbell}
        title="No data"
        description="Nothing to show here"
      />
    );
    expect(getByText("No data")).toBeTruthy();
    expect(getByText("Nothing to show here")).toBeTruthy();
  });

  it("renders without crashing when no action provided", () => {
    const { getByText } = render(
      <EmptyState icon={Dumbbell} title="Empty" description="Desc" />
    );
    expect(getByText("Empty")).toBeTruthy();
  });
});

describe("BottomSheet", () => {
  it("renders children when visible", () => {
    const { getByText } = render(
      <BottomSheet visible onClose={jest.fn()} title="Test Sheet">
        <Text>Sheet Content</Text>
      </BottomSheet>
    );
    expect(getByText("Sheet Content")).toBeTruthy();
    expect(getByText("Test Sheet")).toBeTruthy();
  });

  it("does not render when not visible", () => {
    const { queryByText } = render(
      <BottomSheet visible={false} onClose={jest.fn()} title="Hidden">
        <Text>Hidden Content</Text>
      </BottomSheet>
    );
    expect(queryByText("Hidden Content")).toBeNull();
  });
});
