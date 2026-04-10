import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect, useMemo, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import { createPost } from "../services/postService";
import type { ApiResponse } from "../types";

interface CreatePostFormValues {
  content: string;
  image?: FileList;
}

function CreatePostForm() {
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

  const imageRegister = register("image");

  return (
    <section className="rounded-xl bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-800">Tạo bài viết mới</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
        <div>
          <textarea
            rows={4}
            placeholder="Bạn đang nghĩ gì?"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
            {...register("content", {
              required: "Nội dung bài viết là bắt buộc",
              maxLength: {
                value: 1000,
                message: "Nội dung tối đa 1000 ký tự",
              },
            })}
          />
          {errors.content ? (
            <p className="mt-1 text-red-500 text-sm">
              {errors.content.message}
            </p>
          ) : null}
        </div>

        <div>
          <input
            type="file"
            accept="image/jpeg, image/png, image/webp"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:font-medium file:text-white hover:file:bg-blue-700"
            {...imageRegister}
            ref={(element) => {
              imageRegister.ref(element);
              imageInputRef.current = element;
            }}
          />
        </div>

        {previewUrl ? (
          <div className="relative overflow-hidden rounded-lg border border-gray-200">
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

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {mutation.isPending ? "Đang đăng..." : "Đăng bài"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default CreatePostForm;
