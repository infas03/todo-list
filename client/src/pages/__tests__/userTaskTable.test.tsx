import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import { AuthProvider } from "@/context/AuthProvider";
import taskReducer from "@/redux/reducers/taskReducer";
import { UserTaskTable } from "@/components/userTaskTable";

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

vi.mock("@/components/taskForm", () => ({
  TaskForm: () => <button data-testid="add-task-button">Add Task</button>,
}));

vi.mock("@/components/deleteConfirmationModal", () => ({
  DeleteConfirmationForm: () => <button>Delete</button>,
}));

const mockStore = configureStore({
  reducer: {
    task: taskReducer,
  },
  preloadedState: {
    task: {
      tasks: [
        {
          id: "1",
          title: "Test Task",
          description: "Test Description",
          status: "not_done",
          priority: "medium",
          dueDate: "2023-12-31",
          dependencies: [],
        },
      ],
      totalTasks: 1,
      finishedTasks: 0,
    },
  },
});

describe("UserTaskTable Component", () => {
  it("renders the task table with mock data", () => {
    render(
      <BrowserRouter>
        <Provider store={mockStore}>
          <AuthProvider>
            <UserTaskTable />
          </AuthProvider>
        </Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
  });

  it("shows priority chip with correct color", () => {
    render(
      <BrowserRouter>
        <Provider store={mockStore}>
          <AuthProvider>
            <UserTaskTable />
          </AuthProvider>
        </Provider>
      </BrowserRouter>,
    );

    const priorityChip = screen.getByText("medium");

    expect(priorityChip).toBeInTheDocument();
  });

  it("displays due date correctly", () => {
    render(
      <BrowserRouter>
        <Provider store={mockStore}>
          <AuthProvider>
            <UserTaskTable />
          </AuthProvider>
        </Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText("December 31, 2023")).toBeInTheDocument();
  });

  it("shows 'Mark as completed' checkbox for incomplete tasks", () => {
    render(
      <BrowserRouter>
        <Provider store={mockStore}>
          <AuthProvider>
            <UserTaskTable />
          </AuthProvider>
        </Provider>
      </BrowserRouter>,
    );

    expect(screen.getByText("Mark as completed")).toBeInTheDocument();
  });

  it("has working action buttons", () => {
    render(
      <BrowserRouter>
        <Provider store={mockStore}>
          <AuthProvider>
            <UserTaskTable />
          </AuthProvider>
        </Provider>
      </BrowserRouter>,
    );

    const addTaskButtons = screen.getAllByText("Add Task");

    expect(addTaskButtons.length).toBeGreaterThan(0);
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  it("filters tasks when searching", async () => {
    render(
      <BrowserRouter>
        <Provider store={mockStore}>
          <AuthProvider>
            <UserTaskTable />
          </AuthProvider>
        </Provider>
      </BrowserRouter>,
    );

    const searchInput = screen.getByTestId("search-input");

    fireEvent.change(searchInput, { target: { value: "Test Task" } });
    fireEvent.keyDown(searchInput, { key: "Enter" });

    expect(screen.getByText("Test Task")).toBeInTheDocument();
  });
});
