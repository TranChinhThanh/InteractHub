import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import TextInput from "../components/common/TextInput";
import { useAuth } from "../contexts/AuthContext";

interface LoginFormValues {
  username: string;
  password: string;
}

function LoginPage() {
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMsg("");

    try {
      await login(data.username, data.password);
      navigate("/");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
        return;
      }

      setErrorMsg("Đăng nhập thất bại");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-96 rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-semibold text-gray-800">
          Đăng nhập vào InteractHub
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

          <TextInput
            label="Mật khẩu"
            type="password"
            placeholder="Mật khẩu"
            autoComplete="current-password"
            error={errors.password?.message}
            {...register("password", {
              required: "Mật khẩu là bắt buộc",
              minLength: {
                value: 6,
                message: "Mật khẩu phải có ít nhất 6 ký tự",
              },
            })}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
          </button>

          {errorMsg ? (
            <p className="text-red-500 text-sm" role="alert">
              {errorMsg}
            </p>
          ) : null}

          <p className="text-sm text-gray-600">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
