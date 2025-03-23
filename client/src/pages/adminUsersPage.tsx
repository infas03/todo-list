import { UserTaskTable } from "../components/userTaskTable";
import DefaultLayout from "../layouts/default";

export default function AdminUsersPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-5">
        <UserTaskTable />
      </section>
    </DefaultLayout>
  );
}
