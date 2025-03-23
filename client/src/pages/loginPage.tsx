import { useState } from "react";
import { Form, Input, Button } from "@heroui/react";

import {
  EyeFilledIcon,
  EyeSlashFilledIcon,
  Logo,
  PasswordIcon,
  UserIcon,
} from "../components/icons";
import { useAuth } from "../context/AuthProvider";
import { LoginFormData } from "../types";
import api from "../services/api";
import DefaultLayout from "../layouts/default";

export default function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();

  const toggleVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const data = Object.fromEntries(
      new FormData(e.currentTarget)
    ) as unknown as LoginFormData;

    try {
      const response = await api.post("/v1/auth/login", data);

      if (response.data.success) {
        const { token, data } = response.data;

        login(token, data.role, data);
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError("Invalid credentials.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <section className="flex items-center justify-center p-5 md:p-0">
        <Form
          className="w-full max-w-lg flex flex-col items-center gap-4 p-7 md:p-10 rounded-xl shadow-lg dark:bg-gray-900"
          onSubmit={(e) => handleLogin(e)}
        >
          <div className="flex flex-col items-center mb-5">
            <Logo size={100} />
            <h1 className="text-2xl font-bold text-center -mt-4">
              Task Management System
            </h1>
            <p className="text-base font-medium text-center text-gray-400">
              Sign in to access your dashboard
            </p>
          </div>
          <Input
            isRequired
            errorMessage="Please enter a valid username"
            label="Username"
            name="username"
            placeholder="Enter username"
            startContent={
              <UserIcon className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
            }
            type="text"
            variant="bordered"
          />
          <Input
            isRequired
            endContent={
              <button
                aria-label="toggle password visibility"
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isPasswordVisible ? (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            errorMessage="Please enter a valid password"
            label="Password"
            name="password"
            placeholder="Enter your password"
            startContent={
              <PasswordIcon className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
            }
            type={isPasswordVisible ? "text" : "password"}
            variant="bordered"
          />
          {error && (
            <div className="w-full text-center text-sm text-red-500">
              {error}
            </div>
          )}
          <div className="flex gap-2 w-full">
            <Button
              className="w-full h-12 font-medium text-base"
              color="primary"
              disabled={isLoading}
              isLoading={isLoading}
              type="submit"
            >
              {isLoading ? "" : "Sign in"}
            </Button>
          </div>
          <div className="text-sm text-gray-400 text-center">
            <p className="text-gray-500">Demo Account</p>
            <p>admin / password</p>
            <p>infas / password</p>
            <p>andy / password</p>
          </div>
        </Form>
      </section>
    </DefaultLayout>
  );
}
