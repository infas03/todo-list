import { addToast } from "@heroui/react";

const ToastBar = {
  success: (description: string) => {
    addToast({ title: "Success", description, color: "success" });
  },

  error: (description: string) => {
    addToast({ title: "Error", description, color: "danger" });
  },

  warning: (description: string) => {
    addToast({ title: "Warning", description, color: "warning" });
  },
};

export default ToastBar;
