import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { resetPasswordSchema, type ResetPasswordSchema } from "../schemas";
import { simulateResetPasswordApi } from "../api";

export function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const resetToken = searchParams.get("token");

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: resetToken || "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  useEffect(() => {
    if (resetToken) {
      form.setValue("token", resetToken);
    }
  }, [resetToken, form]);

  const handleResetPassword = async (
    values: ResetPasswordSchema
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const result = await simulateResetPasswordApi(
        values.token,
        values.newPassword
      );

      if (result.success) {
        toast.success(result.message);

        // Clear any stored auth data
        localStorage.removeItem("token");
        localStorage.removeItem("userData");

        // Navigate to sign in with success message
        navigate("/auth/sign-in", {
          state: {
            message:
              "تم تغيير كلمة المرور بنجاح. يمكنك الآن تسجيل الدخول بكلمة المرور الجديدة.",
          },
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء محاولة تغيير كلمة المرور");
      console.error("ResetPasswordForm - handleResetPassword error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // If no token is provided, show error state
  if (!resetToken) {
    return (
      <div
        dir="rtl"
        className="max-w-md mx-auto p-0 space-y-6 text-center"
        aria-label="خطأ في رمز إعادة التعيين"
      >
        <div className="space-y-3">
          <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-destructive">رابط غير صالح</h2>
          <p className="text-muted-foreground text-sm">
            الرابط المستخدم غير صالح أو منتهي الصلاحية.
            <span className="block mt-2">
              يرجى طلب رابط جديد لإعادة تعيين كلمة المرور.
            </span>
          </p>
        </div>

        <div className="space-y-3">
          <Link to="/auth/forgot-password">
            <Button className="w-full">طلب رابط جديد</Button>
          </Link>
        </div>

        <div className="text-center">
          <Link
            to="/auth/sign-in"
            className="text-primary hover:underline text-sm font-medium"
          >
            العودة إلى تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="max-w-md mx-auto p-0 space-y-6"
      aria-label="نموذج تعيين كلمة مرور جديدة"
    >
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-primary mb-1">
          تعيين كلمة مرور جديدة
        </h2>
        <p className="text-muted-foreground text-sm">
          أدخل كلمة المرور الجديدة للحساب.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleResetPassword)}
          className="space-y-5"
          aria-label="نموذج تعيين كلمة مرور جديدة"
        >
          <FormField
            control={form.control}
            name="token"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="new-password-input">
                  كلمة المرور الجديدة
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="new-password-input"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="********"
                      autoComplete="new-password"
                      {...field}
                      disabled={isLoading}
                      className="text-right pl-12"
                      autoFocus
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={
                        showNewPassword
                          ? "إخفاء كلمة المرور الجديدة"
                          : "إظهار كلمة المرور الجديدة"
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-primary transition"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      disabled={isLoading}
                    >
                      {showNewPassword ? "إخفاء" : "إظهار"}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmNewPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="confirm-new-password-input">
                  تأكيد كلمة المرور الجديدة
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="confirm-new-password-input"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="********"
                      autoComplete="new-password"
                      {...field}
                      disabled={isLoading}
                      className="text-right pl-12"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      aria-label={
                        showConfirmPassword
                          ? "إخفاء تأكيد كلمة المرور"
                          : "إظهار تأكيد كلمة المرور"
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-primary transition"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? "إخفاء" : "إظهار"}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-xs text-muted-foreground space-y-1">
            <p>كلمة المرور يجب أن تحتوي على:</p>
            <ul className="list-disc list-inside space-y-1 text-right">
              <li>8 أحرف على الأقل</li>
              <li>حرف كبير واحد على الأقل</li>
              <li>حرف صغير واحد على الأقل</li>
              <li>رقم واحد على الأقل</li>
              <li>رمز خاص واحد على الأقل (@$!%*?&)</li>
            </ul>
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            aria-label="تعيين كلمة المرور الجديدة"
          >
            تعيين كلمة المرور الجديدة
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <Link
          to="/auth/sign-in"
          className="text-primary hover:underline text-sm font-medium"
        >
          العودة إلى تسجيل الدخول
        </Link>
      </div>

      <div className="text-center text-xs text-muted-foreground mt-4">
        {`قال الله تعالى: "وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا"`}
      </div>
    </div>
  );
}

ResetPasswordForm.displayName = "ResetPasswordForm";
