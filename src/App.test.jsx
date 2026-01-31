import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

describe("App", () => {
  it("renders login selection screen", () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );

    // Heading
    expect(
      screen.getByRole("heading", { name: /welcome/i })
    ).toBeInTheDocument();

    // Buttons
    expect(
      screen.getByRole("button", { name: /admin login/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /direct order login/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /distributor login/i })
    ).toBeInTheDocument();
  });
});
