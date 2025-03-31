import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import Login from "../loginPage";

const __mocks = vi.hoisted(() => {
  const mockToast = {
    error: vi.fn(),
    success: vi.fn(),
  };

  const mockApi = {
    post: vi.fn(),
  };

  const mockAuth = {
    login: vi.fn(),
  };

  return { mockToast, mockApi, mockAuth };
});

vi.mock("../../services/api", () => ({
  default: __mocks.mockApi,
}));

vi.mock("../../context/AuthProvider", () => ({
  useAuth: () => __mocks.mockAuth,
}));

vi.mock("../../components/toastBar", () => ({
  __esModule: true,
  default: __mocks.mockToast,
}));

describe("Login Component", () => {
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

    vi.stubGlobal("localStorage", {
      store: {} as Record<string, string>,
      setItem: vi.fn((key: string, value: string) => {
        localStorage.store[key] = value;
      }),
      getItem: vi.fn((key: string) => localStorage.store[key]),
      removeItem: vi.fn((key: string) => {
        delete localStorage.store[key];
      }),
      clear: vi.fn(() => {
        localStorage.store = {};
      }),
    });
  });

  const mockStore = configureStore({
    reducer: {
      user: () => ({}),
    },
  });

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("should login successfully and store token", async () => {
    __mocks.mockApi.post.mockResolvedValue({
      data: {
        success: true,
        data: {
          token: "mock-token",
          user: {
            role: "admin",
            name: "Test User",
            email: "test@example.com",
          },
        },
      },
    });

    __mocks.mockAuth.login.mockImplementation((token: string) => {
      localStorage.setItem("token", token);
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );

    fireEvent.change(screen.getByPlaceholderText("Enter email address"), {
      target: { value: "admin@admin.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(__mocks.mockApi.post).toHaveBeenCalledWith("/auth/login", {
        email: "admin@admin.com",
        password: "password",
      });

      expect(localStorage.store.token).toBe("mock-token");

      expect(__mocks.mockAuth.login).toHaveBeenCalledWith(
        "mock-token",
        "admin",
        expect.objectContaining({
          email: "test@example.com",
          name: "Test User",
        }),
      );

      expect(__mocks.mockToast.success).toHaveBeenCalledWith(
        "Login successful",
      );
    });
  });

  it("should show error when login fails", async () => {
    const errorMessage = "Invalid credentials";

    __mocks.mockApi.post.mockRejectedValue({
      response: {
        data: {
          message: errorMessage,
        },
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </Provider>,
    );

    fireEvent.change(screen.getByPlaceholderText("Enter email address"), {
      target: { value: "wrong@email.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(__mocks.mockApi.post).toHaveBeenCalled();
      expect(__mocks.mockToast.error).toHaveBeenCalledWith(errorMessage);
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});
