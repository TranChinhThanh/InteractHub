import { isAxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { register as registerUser } from "../services/authService";
import type { ApiResponse, RegisterRequestDto } from "../types";

interface RegisterFormValues {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

function RegisterPage() {
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>();

  const passwordValue = watch("password");

  const onSubmit = async (data: RegisterFormValues) => {
    setErrorMsg("");

    const payload: RegisterRequestDto = {
      fullName: data.fullName,
      email: data.email,
      username: data.username,
      password: data.password,
    };

    try {
      const response = await registerUser(payload);

      if (!response.success) {
        const apiErrors = response.errors?.length
          ? response.errors
          : ["Đăng ký thất bại"];
        setErrorMsg(apiErrors.join(" | "));
        return;
      }

      window.alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login");
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        const errorPayload = error.response?.data as
          | ApiResponse<unknown>
          | undefined;
        const apiErrors = errorPayload?.errors;

        if (Array.isArray(apiErrors) && apiErrors.length > 0) {
          setErrorMsg(apiErrors.join(" | "));
          return;
        }
      }

      setErrorMsg("Đăng ký thất bại");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-96 rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Đăng ký tài khoản InteractHub
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Họ và tên"
              className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              {...register("fullName", {
                required: "Họ và tên là bắt buộc",
              })}
            />
            {errors.fullName ? (
              <p className="mt-1 text-red-500 text-sm">
                {errors.fullName.message}
              </p>
            ) : null}
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              {...register("email", {
                required: "Email là bắt buộc",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Email không hợp lệ",
                },
              })}
            />
            {errors.email ? (
              <p className="mt-1 text-red-500 text-sm">
                {errors.email.message}
              </p>
            ) : null}
          </div>

          <div>
            <input
              type="text"
              placeholder="Username"
              className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              {...register("username", {
                required: "Username là bắt buộc",
              })}
            />
            {errors.username ? (
              <p className="mt-1 text-red-500 text-sm">
                {errors.username.message}
              </p>
            ) : null}
          </div>

          <div>
            <input
              type="password"
              placeholder="Mật khẩu"
              className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              {...register("password", {
                required: "Mật khẩu là bắt buộc",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                },
              })}
            />
            {errors.password ? (
              <p className="mt-1 text-red-500 text-sm">
                {errors.password.message}
              </p>
            ) : null}
          </div>

          <div>
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              className="w-full rounded-md border border-gray-300 px-4 py-2 outline-none focus:border-blue-500"
              {...register("confirmPassword", {
                required: "Xác nhận mật khẩu là bắt buộc",
                validate: (value) =>
                  value === passwordValue || "Mật khẩu xác nhận không khớp",
              })}
            />
            {errors.confirmPassword ? (
              <p className="mt-1 text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Đăng ký
          </button>

          {errorMsg ? <p className="text-red-500">{errorMsg}</p> : null}
        </form>

        <p className="mt-4 text-sm text-gray-600">
          Đã có tài khoản?{" "}
          <Link
            to="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Đăng nhập ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
