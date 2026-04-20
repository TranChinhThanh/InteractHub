import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useMemo, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import FileInput from "./common/FileInput";
import { useAuth } from "../contexts/AuthContext";
import { createPost } from "../services/postService";
import type { ApiResponse } from "../types";

interface CreatePostFormValues {
  content: string;
  image?: FileList;
}

function CreatePostForm() {
  const { user } = useAuth();
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();

  const {
    control,
    register,
    handleSubmit,
    reset,
    resetField,
    formState: { errors },
  } = useForm<CreatePostFormValues>({
    defaultValues: {
      content: "",
    },
  });

  const imageFiles = useWatch({
    control,
    name: "image",
  });

  const selectedImage = imageFiles?.[0];

  const previewUrl = useMemo(() => {
    if (!selectedImage) {
      return null;
    }

    return URL.createObjectURL(selectedImage);
  }, [selectedImage]);

  useEffect(() => {
    if (!previewUrl) {
      return;
    }

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const mutation = useMutation({
    mutationFn: (formData: FormData) => createPost(formData),
    onSuccess: () => {
      window.alert("Đăng bài thành công!");
      reset({
        content: "",
        image: undefined,
      });

      if (imageInputRef.current) {
        imageInputRef.current.value = "";
      }

      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const onSubmit = (data: CreatePostFormValues) => {
    const formData = new FormData();
    formData.append("Content", data.content.trim());

    const imageFile = data.image?.[0];
    if (imageFile) {
      formData.append("Image", imageFile);
    }

    mutation.mutate(formData);
  };

  const handleRemoveImage = () => {
    resetField("image");

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const mutationErrorMessage = (() => {
    if (!mutation.isError) {
      return "";
    }

    if (isAxiosError(mutation.error)) {
      const payload = mutation.error.response?.data as
        | ApiResponse<unknown>
        | undefined;
      const message = payload?.errors?.[0];

      if (message) {
        return message;
      }
    }

    return "Đăng bài thất bại.";
  })();

  const { ref: imageFieldRef, ...imageFieldProps } = register("image");
  const userInitial = user?.username?.trim().charAt(0).toUpperCase() || "U";

  return (
    <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-sky-400 text-sm font-semibold text-white">
            {userInitial}
          </div>

          <div className="w-full">
            <textarea
              rows={3}
              placeholder="Bạn đang nghĩ gì...?"
              className="min-h-[96px] w-full rounded-2xl border border-transparent bg-gray-100 px-4 py-3 text-gray-700 outline-none transition focus:border-blue-300 focus:bg-white"
              {...register("content", {
                required: "Nội dung bài viết là bắt buộc",
                maxLength: {
                  value: 1000,
                  message: "Nội dung tối đa 1000 ký tự",
                },
              })}
            />
            {errors.content ? (
              <p className="mt-1 text-sm text-red-500">
                {errors.content.message}
              </p>
            ) : null}
          </div>
        </div>

        <FileInput
          id="create-post-image"
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
          {...imageFieldProps}
          ref={(element) => {
            imageFieldRef(element);
            imageInputRef.current = element;
          }}
        />

        {previewUrl ? (
          <div className="relative overflow-hidden rounded-2xl border border-gray-200">
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-sm font-semibold text-white hover:bg-black/75"
              aria-label="Xóa ảnh đã chọn"
            >
              X
            </button>
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-[380px] w-full object-cover"
            />
          </div>
        ) : null}

        {mutationErrorMessage ? (
          <p className="text-red-500 text-sm" role="alert">
            {mutationErrorMessage}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={mutation.isPending}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[18px] text-blue-500">
                image
              </span>
              Thêm ảnh
            </button>

            <button
              type="button"
              disabled
              className="inline-flex cursor-default items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium text-gray-500"
            >
              {/* <span className="material-symbols-outlined text-[18px] text-amber-500">
                mood
              </span>
              Cảm xúc */}
            </button>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-full bg-[#2f4b82] px-6 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#274276] disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {mutation.isPending ? "Đang đăng..." : "Đăng bài"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default CreatePostForm;
