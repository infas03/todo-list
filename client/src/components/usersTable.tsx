import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThunkDispatch } from "redux-thunk";
import { AnyAction } from "redux";

import { EmployerTableSkeleton } from "./skeleton/employerTableSkeleton";
import { UserAddForm } from "./userAddForm";
import { DeleteConfirmationForm } from "./deleteConfirmationModal";

import { employeesTableColumns } from "@/config/staticValue";
import { RootState } from "@/redux/store";
import { getAllUsers, userDelete } from "@/redux/actions/userAction";
import { User } from "@/types";

export const UsersTable = () => {
  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const users = useSelector((state: RootState) => state.user.allUsers) || [];

  const fetchUsers = async () => {
    setIsLoading(true);

    try {
      dispatch(getAllUsers());
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching employees:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteEmployee = async (userId: string) => {
    try {
      dispatch(userDelete(userId));
    } catch {
      throw new Error("Failed to delete employee");
    }
  };

  return (
    <div className="p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        <UserAddForm mode="add" />
      </div>
      <div className="flex flex-col items-center">
        {isLoading ? (
          <div className="w-full">
            <EmployerTableSkeleton />
          </div>
        ) : (
          <>
            <Table
              aria-label="Example table with dynamic content"
              className="max-w-2xl"
            >
              <TableHeader columns={employeesTableColumns}>
                {(column) => (
                  <TableColumn key={column.key}>{column.label}</TableColumn>
                )}
              </TableHeader>
              <TableBody items={users}>
                {(item: User) => (
                  <TableRow key={item._id}>
                    {(columnKey) => (
                      <TableCell>
                        {columnKey === "action" ? (
                          <div className="flex space-x-2 w-full gap-x-5">
                            <UserAddForm
                              initialData={{
                                ...item,
                                password: "",
                              }}
                              mode="update"
                              userId={item?._id}
                            />
                            <DeleteConfirmationForm
                              entityName="user"
                              id={item._id!}
                              onConfirm={handleDeleteEmployee}
                            />
                          </div>
                        ) : (
                          getKeyValue(item, columnKey)
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </>
        )}
      </div>
    </div>
  );
};
