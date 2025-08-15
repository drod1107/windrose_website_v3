import { render, screen } from "@testing-library/react";
import React from "react";
import SubscribePage from "../src/app/subscribe/page";

describe("SubscribePage", () => {
  it("renders heading and privacy note", () => {
    render(<SubscribePage />);
    expect(screen.getByText(/stay updated/i)).toBeInTheDocument();
    expect(screen.getByText(/privacy/i)).toBeInTheDocument();
  });
});
