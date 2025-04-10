import { Alert } from "@heroui/react";

import DefaultLayout from "../layouts/default";
import { UserTaskTable } from "../components/userTaskTable";

export default function User() {
  const alertDescription =
    "You can sort your tasks by status, due date or priority. Mark tasks as completed when you finish them.";

  return (
    <DefaultLayout>
      <section
        className="flex flex-col items-center justify-center gap-4 py-8 md:py-0 "
        data-testid="user-page-section"
      >
        <div className="min-w-[900px]" data-testid="user-page-container">
          <h1 className="text-3xl font-bold" data-testid="page-title">
            My Tasks
          </h1>
          <p className="text-lg text-gray-400" data-testid="page-subtitle">
            Manage and track your assigned tasks
          </p>
          <Alert
            className="mt-10"
            color="primary"
            data-testid="user-alert"
            description={alertDescription}
            variant="bordered"
          />
          <UserTaskTable />
        </div>
      </section>
    </DefaultLayout>
  );
}
