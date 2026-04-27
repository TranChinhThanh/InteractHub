/* eslint-disable react-refresh/only-export-components */

import {
  useCallback,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";

type DialogTone = "default" | "danger" | "warning" | "info";

interface ConfirmDialogOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  tone?: DialogTone;
}

interface PromptDialogOptions extends ConfirmDialogOptions {
  placeholder?: string;
  initialValue?: string;
  requireNonEmpty?: boolean;
  maxLength?: number;
}

interface DialogContextType {
  confirm: (options: ConfirmDialogOptions) => Promise<boolean>;
  prompt: (options: PromptDialogOptions) => Promise<string | null>;
}

interface ConfirmDialogState {
  kind: "confirm";
  options: Required<ConfirmDialogOptions>;
  resolve: (result: boolean) => void;
}

interface PromptDialogState {
  kind: "prompt";
  options: Required<PromptDialogOptions>;
  resolve: (result: string | null) => void;
}

type DialogState = ConfirmDialogState | PromptDialogState;

interface DialogProviderProps {
  children: ReactNode;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

const confirmDefaults = {
  title: "Xác nhận",
  confirmText: "Đồng ý",
  cancelText: "Hủy",
  tone: "default" as DialogTone,
};

const promptDefaults = {
  ...confirmDefaults,
  title: "Nhập thông tin",
  confirmText: "Xác nhận",
  placeholder: "",
  initialValue: "",
  requireNonEmpty: false,
  maxLength: 500,
};

const toneClasses: Record<
  DialogTone,
  {
    iconBg: string;
    iconSymbol: string;
    confirmBtn: string;
  }
> = {
  default: {
    iconBg: "bg-slate-100 text-slate-700",
    iconSymbol: "info",
    confirmBtn:
      "bg-slate-700 text-white hover:bg-slate-800 disabled:bg-slate-400",
  },
  info: {
    iconBg: "bg-blue-100 text-blue-700",
    iconSymbol: "notifications",
    confirmBtn: "bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300",
  },
  warning: {
    iconBg: "bg-amber-100 text-amber-700",
    iconSymbol: "warning",
    confirmBtn:
      "bg-amber-600 text-white hover:bg-amber-700 disabled:bg-amber-300",
  },
  danger: {
    iconBg: "bg-red-100 text-red-700",
    iconSymbol: "delete",
    confirmBtn: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
  },
};

function DialogProvider({ children }: DialogProviderProps) {
  const [activeDialog, setActiveDialog] = useState<DialogState | null>(null);
  const [promptValue, setPromptValue] = useState("");
  const [promptError, setPromptError] = useState("");

  useEffect(() => {
    if (!activeDialog) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      event.preventDefault();
      if (activeDialog.kind === "confirm") {
        activeDialog.resolve(false);
      } else {
        activeDialog.resolve(null);
      }

      setActiveDialog(null);
      setPromptError("");
      setPromptValue("");
    };

    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [activeDialog]);

  const confirm = useCallback((options: ConfirmDialogOptions) => {
    return new Promise<boolean>((resolve) => {
      setActiveDialog({
        kind: "confirm",
        options: {
          ...confirmDefaults,
          ...options,
        },
        resolve,
      });
    });
  }, []);

  const prompt = useCallback((options: PromptDialogOptions) => {
    return new Promise<string | null>((resolve) => {
      const normalizedOptions: Required<PromptDialogOptions> = {
        ...promptDefaults,
        ...options,
      };

      setPromptValue(normalizedOptions.initialValue);
      setPromptError("");
      setActiveDialog({
        kind: "prompt",
        options: normalizedOptions,
        resolve,
      });
    });
  }, []);

  const closeDialog = () => {
    setActiveDialog(null);
    setPromptError("");
    setPromptValue("");
  };

  const handleConfirmResult = (result: boolean) => {
    if (!activeDialog || activeDialog.kind !== "confirm") {
      return;
    }

    activeDialog.resolve(result);
    closeDialog();
  };

  const handlePromptCancel = () => {
    if (!activeDialog || activeDialog.kind !== "prompt") {
      return;
    }

    activeDialog.resolve(null);
    closeDialog();
  };

  const handlePromptSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!activeDialog || activeDialog.kind !== "prompt") {
      return;
    }

    const normalizedValue = promptValue.trim();

    if (activeDialog.options.requireNonEmpty && normalizedValue.length === 0) {
      setPromptError("Vui lòng nhập nội dung.");
      return;
    }

    activeDialog.resolve(normalizedValue);
    closeDialog();
  };

  const value = useMemo(
    () => ({
      confirm,
      prompt,
    }),
    [confirm, prompt],
  );

  const activeTone = activeDialog ? activeDialog.options.tone : "default";
  const dialogToneStyle = toneClasses[activeTone];

  return (
    <DialogContext.Provider value={value}>
      {children}

      {activeDialog ? (
        <div className="fixed inset-0 z-[70] bg-slate-950/45 px-4">
          <div className="mx-auto flex min-h-full max-w-2xl items-start justify-center pt-24">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl">
              <div className="mb-4 flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${dialogToneStyle.iconBg}`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {dialogToneStyle.iconSymbol}
                  </span>
                </span>

                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {activeDialog.options.title}
                  </h3>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-600">
                    {activeDialog.options.message}
                  </p>
                </div>
              </div>

              {activeDialog.kind === "prompt" ? (
                <form onSubmit={handlePromptSubmit} className="space-y-3">
                  <input
                    type="text"
                    autoFocus
                    value={promptValue}
                    maxLength={activeDialog.options.maxLength}
                    onChange={(event) => {
                      setPromptValue(event.target.value);
                      if (promptError.length > 0) {
                        setPromptError("");
                      }
                    }}
                    placeholder={activeDialog.options.placeholder}
                    className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                  />

                  {promptError.length > 0 ? (
                    <p className="text-sm text-red-600">{promptError}</p>
                  ) : null}

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handlePromptCancel}
                      className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                    >
                      {activeDialog.options.cancelText}
                    </button>

                    <button
                      type="submit"
                      className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${dialogToneStyle.confirmBtn}`}
                    >
                      {activeDialog.options.confirmText}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleConfirmResult(false)}
                    className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                  >
                    {activeDialog.options.cancelText}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleConfirmResult(true)}
                    className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${dialogToneStyle.confirmBtn}`}
                  >
                    {activeDialog.options.confirmText}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </DialogContext.Provider>
  );
}

function useDialog() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }

  return context;
}

export { DialogProvider, useDialog };
export type { ConfirmDialogOptions, PromptDialogOptions, DialogTone };
