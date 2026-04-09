import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
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
    formState: { errors },
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

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
          >
            Đăng nhập
          </button>

          {errorMsg ? (
            <p className="text-red-500 text-sm" role="alert">
              {errorMsg}
            </p>
          ) : null}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
