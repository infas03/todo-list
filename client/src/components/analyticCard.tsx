import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Progress,
} from "@heroui/react";
import { User } from "../types";

interface AnalyticCardProps {
  user?: User;
}

export const AnalyticCard = ({ user }: AnalyticCardProps) => {
  const taskFinished =
    user?.totalTasks === 0 || user?.finishedTasks === 0
      ? 0
      : ((user?.finishedTasks ?? 0) / (user?.totalTasks ?? 0)) * 100;

  return (
    <Card className="min-w-[250px]">
      <CardHeader className="flex gap-3">
        <div className="flex flex-col">
          <p className="text-lg font-bold">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="text-small text-default-500 font-medium">
            {user?.department}
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="flex justify-between mb-2">
          <p>Task Completion</p>
          <p>{taskFinished}%</p>
        </div>

        <Progress
          aria-label="Loading..."
          className="w-full"
          value={taskFinished}
        />
      </CardBody>
      <Divider />
      <CardFooter>
        <div>
          {user?.finishedTasks} of {user?.totalTasks} tasks completed
        </div>
      </CardFooter>
    </Card>
  );
};
