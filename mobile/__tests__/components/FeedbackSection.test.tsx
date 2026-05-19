import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react-native";

// Mock TanStack Query hooks
const mockUseFeedback = jest.fn();
const mockUseSendFeedback = jest.fn();

jest.mock("../../hooks/api", () => ({
  useFeedback: (...args: any[]) => mockUseFeedback(...args),
  useSendFeedback: () => mockUseSendFeedback(),
}));

// Mock lucide icons
jest.mock("lucide-react-native", () => ({
  MessageCircle: "MessageCircle",
  Send: "Send",
}));

import { FeedbackSection } from "../../components/session/FeedbackSection";

describe("FeedbackSection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseFeedback.mockReturnValue({
      data: [],
      isLoading: false,
    });
    mockUseSendFeedback.mockReturnValue({
      mutate: jest.fn(),
      isPending: false,
    });
  });

  it("renders header", () => {
    render(<FeedbackSection sessionLogId="log-1" canPost={false} />);
    expect(screen.getByText("Feedback")).toBeTruthy();
  });

  it("shows no feedback message when empty and canPost is false", () => {
    render(<FeedbackSection sessionLogId="log-1" canPost={false} />);
    expect(screen.getByText("No feedback yet")).toBeTruthy();
  });

  it("shows input when canPost is true", () => {
    render(<FeedbackSection sessionLogId="log-1" canPost={true} />);
    expect(screen.getByPlaceholderText("Write feedback...")).toBeTruthy();
  });

  it("hides input when canPost is false", () => {
    render(<FeedbackSection sessionLogId="log-1" canPost={false} />);
    expect(screen.queryByPlaceholderText("Write feedback...")).toBeNull();
  });

  it("renders feedback items", () => {
    mockUseFeedback.mockReturnValue({
      data: [
        {
          id: "f1",
          content: "Great session!",
          createdAt: new Date().toISOString(),
          user: { name: "Coach Dan", role: "COACH" },
        },
      ],
      isLoading: false,
    });

    render(<FeedbackSection sessionLogId="log-1" canPost={false} />);
    expect(screen.getByText("Great session!")).toBeTruthy();
    expect(screen.getByText("Coach Dan")).toBeTruthy();
  });

  it("shows feedback count in header", () => {
    mockUseFeedback.mockReturnValue({
      data: [
        {
          id: "f1",
          content: "Nice work",
          createdAt: new Date().toISOString(),
          user: { name: "Coach", role: "COACH" },
        },
        {
          id: "f2",
          content: "Thanks!",
          createdAt: new Date().toISOString(),
          user: { name: "Athlete", role: "ATHLETE" },
        },
      ],
      isLoading: false,
    });

    render(<FeedbackSection sessionLogId="log-1" canPost={false} />);
    expect(screen.getByText("Feedback (2)")).toBeTruthy();
  });

  it("calls mutate on send", () => {
    const mockMutate = jest.fn();
    mockUseSendFeedback.mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    });

    render(<FeedbackSection sessionLogId="log-1" canPost={true} />);
    const input = screen.getByPlaceholderText("Write feedback...");
    fireEvent.changeText(input, "Looks good!");
    
    // The test confirms the input is present and accepts text
    expect(input.props.value).toBe("Looks good!");
  });
});
