import { VisuallyHidden, useSwitch } from "@heroui/react";
import { SwitchProps } from "@heroui/react";

import { DownArrowIcon, UpArrowIcon } from "./icons";

export const FilterSwitch = (props: SwitchProps) => {
  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
    // onValueChange,
  } = useSwitch(props);

  return (
    <div className="flex">
      <Component {...getBaseProps()}>
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <div
          {...getWrapperProps()}
          className={slots.wrapper({
            color: "none" as any,
            class: [
              "w-10 h-10",
              "flex items-center justify-center",
              "rounded-lg bg-transparent hover:bg-default-100",
            ],
          })}
        >
          {isSelected ? <DownArrowIcon /> : <UpArrowIcon />}
        </div>
      </Component>
    </div>
  );
};
