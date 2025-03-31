import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import User from "../userPage";

import { AuthProvider } from "@/context/AuthProvider";
import taskReducer from "@/redux/reducers/taskReducer";

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
});

const mockStore = configureStore({
  reducer: {
    task: taskReducer,
  },
});

vi.mock("@/components/navbar", () => ({
  Navbar: () => <div>Mock Navbar</div>,
}));

describe("User Component", () => {
  it("renders the page title and subtitle", () => {
    render(
      <BrowserRouter>
        <Provider store={mockStore}>
          <AuthProvider>
            <User />
          </AuthProvider>
        </Provider>
      </BrowserRouter>,
    );

    expect(screen.getByTestId("page-title")).toHaveTextContent("My Tasks");
    expect(screen.getByTestId("page-subtitle")).toHaveTextContent(
      "Manage and track your assigned tasks",
    );
  });

  it("displays the alert with correct description", () => {
    render(
      <BrowserRouter>
        <Provider store={mockStore}>
          <AuthProvider>
            <User />
          </AuthProvider>
        </Provider>
      </BrowserRouter>,
    );

    const alert = screen.getByTestId("user-alert");

    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent(/sort your tasks by status/i);
  });

  it("renders the task table container", () => {
    render(
      <BrowserRouter>
        <Provider store={mockStore}>
          <AuthProvider>
            <User />
          </AuthProvider>
        </Provider>
      </BrowserRouter>,
    );

    expect(screen.getByTestId("task-table-container")).toBeInTheDocument();
  });
});
