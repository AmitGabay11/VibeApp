import { render, screen } from "@testing-library/react";
import App from "./App";
import '@testing-library/jest-dom/extend-expect';

test("renders welcome message", () => {
  render(<App />);
  expect(screen.getByText(/Welcome/i)).toBeInTheDocument();
});
