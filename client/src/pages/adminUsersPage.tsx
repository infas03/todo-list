import DefaultLayout from "../layouts/default";

import { UsersTable } from "@/components/usersTable";

export default function AdminUsersPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-5">
        <UsersTable />
      </section>
    </DefaultLayout>
  );
}
