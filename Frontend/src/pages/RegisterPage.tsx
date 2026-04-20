import { isAxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import TextInput from "../components/common/TextInput";
import { register as registerUser } from "../services/authService";
import type { ApiResponse, RegisterRequestDto } from "../types";

interface RegisterFormValues {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  barClass: string;
  textClass: string;
}

function getPasswordStrength(password: string): PasswordStrength {
  let score = 0;

  if (password.length >= 6) {
    score += 25;
  }

  if (password.length >= 10) {
    score += 20;
  }

  if (/[A-Z]/.test(password)) {
    score += 20;
  }

  if (/[0-9]/.test(password)) {
    score += 20;
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 15;
  }

  const normalizedScore = Math.min(score, 100);

  if (normalizedScore >= 75) {
    return {
      score: normalizedScore,
      label: "Mạnh",
      barClass: "bg-emerald-500",
      textClass: "text-emerald-600",
    };
  }

  if (normalizedScore >= 40) {
    return {
      score: normalizedScore,
      label: "Trung bình",
      barClass: "bg-amber-400",
      textClass: "text-amber-600",
    };
  }

  return {
    score: normalizedScore,
    label: "Yếu",
    barClass: "bg-rose-500",
    textClass: "text-rose-600",
  };
}

function RegisterPage() {
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>();

  const passwordValue = watch("password");
  const passwordStrength = getPasswordStrength(passwordValue ?? "");

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
          <TextInput
            label="Họ và tên"
            type="text"
            placeholder="Họ và tên"
            autoComplete="name"
            error={errors.fullName?.message}
            {...register("fullName", {
              required: "Họ và tên là bắt buộc",
            })}
          />

          <TextInput
            label="Email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email", {
              required: "Email là bắt buộc",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email không hợp lệ",
              },
            })}
          />

          <TextInput
            label="Username"
            type="text"
            placeholder="Username"
            autoComplete="username"
            error={errors.username?.message}
            {...register("username", {
              required: "Username là bắt buộc",
            })}
          />

          <div className="space-y-2">
            <TextInput
              label="Mật khẩu"
              type="password"
              placeholder="Mật khẩu"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register("password", {
                required: "Mật khẩu là bắt buộc",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                },
              })}
            />

            <div className="space-y-1">
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${passwordStrength.barClass}`}
                  style={{ width: `${passwordStrength.score}%` }}
                />
              </div>
              <p
                className={`text-xs font-medium ${passwordStrength.textClass}`}
              >
                Độ mạnh mật khẩu: {passwordStrength.label} (
                {passwordStrength.score}%)
              </p>
            </div>
          </div>

          <TextInput
            label="Nhập lại mật khẩu"
            type="password"
            placeholder="Nhập lại mật khẩu"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword", {
              required: "Xác nhận mật khẩu là bắt buộc",
              validate: (value) =>
                value === passwordValue || "Mật khẩu xác nhận không khớp",
            })}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
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
