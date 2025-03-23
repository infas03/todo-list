import { useEffect, useState } from "react";

import { AnalyticCard } from "./analyticCard";
import { AnalyticCardSkeleton } from "./skeleton/analyticsCardSkeleton";
import { User } from "../types";
import api from "../services/api";

export const Analytics = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEmployees = async () => {
    setIsLoading(true);

    try {
      const response = await api.get("/v1/employees");

      setUsers(response.data.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error fetching employees:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold">Task Completion Analytics</h1>
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <AnalyticCardSkeleton />
        ) : (
          users?.map((item) => {
            return <AnalyticCard key={item.id} user={item} />;
          })
        )}
      </div>
    </div>
  );
};
