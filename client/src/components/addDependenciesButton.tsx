import {
  Button,
  CheckboxGroup,
  Checkbox,
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@heroui/react";
import { useState } from "react";

export function AddDependenciesButton({
  currentTaskId,
  allTasks,
  onDependenciesSelected,
  currentDependencies = [],
}: {
  currentTaskId?: string;
  allTasks: Array<{ id: string; title: string }>;
  onDependenciesSelected: (selectedIds: string[]) => void;
  currentDependencies?: string[];
}) {
  const [selectedDependencies, setSelectedDependencies] =
    useState<string[]>(currentDependencies);
  const [isOpen, setIsOpen] = useState(false);

  const availableTasks = allTasks.filter((task) => task.id !== currentTaskId);

  const handleSubmit = () => {
    onDependenciesSelected(selectedDependencies);
    setIsOpen(false);
  };

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button>Add Dependent Task</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 flex items-start p-4">
        <div className="space-y-4 w-full">
          <h4 className="font-medium">Select dependent tasks</h4>
          <CheckboxGroup
            defaultValue={selectedDependencies}
            onValueChange={setSelectedDependencies}
          >
            <div className="w-full overflow-y-auto space-y-2">
              {availableTasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-2">
                  <Checkbox value={task.id} />
                  <label>{task.title}</label>
                </div>
              ))}
            </div>
          </CheckboxGroup>
          <div className="flex justify-end gap-2">
            <Button variant="bordered" onPress={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onPress={handleSubmit}>Save</Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
