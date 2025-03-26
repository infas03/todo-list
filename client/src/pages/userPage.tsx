import { Alert } from "@heroui/react";

import DefaultLayout from "../layouts/default";
import { UserTaskTable } from "../components/userTaskTable";

export default function User() {
  const alertDescription =
    "You can sort your tasks by status, due date or priority. Mark tasks as completed when you finish them.";

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 ">
        <div className="min-w-[900px]">
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <p className="text-lg text-gray-400">
            Manage and track your assigned tasks
          </p>
          <Alert
            className="mt-10"
            color="primary"
            description={alertDescription}
            variant="bordered"
          />
          <UserTaskTable />
        </div>
      </section>
    </DefaultLayout>
  );
}
