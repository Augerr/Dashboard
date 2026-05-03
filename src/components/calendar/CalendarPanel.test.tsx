import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import CalendarPanel from "./CalendarPanel";

describe("CalendarPanel", () => {
  it("switches between weekly and monthly calendar views", async () => {
    const user = userEvent.setup();
    render(<CalendarPanel events={[]} daily={[]} eventColor="" />);

    expect(screen.getByRole("button", { name: "Week" })).toBeInTheDocument();
    expect(screen.getByText("12 PM")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Month" }));

    expect(screen.getByText("Sun")).toBeInTheDocument();
    expect(screen.queryByText("12 PM")).not.toBeInTheDocument();
  });
});
