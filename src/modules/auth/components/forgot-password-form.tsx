import { useState } from "react";
import { Link } from "react-router-dom";

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

import { forgotPasswordSchema, type ForgotPasswordSchema } from "../schemas";
import { simulateForgotPasswordApi } from "../api";

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const handleForgotPassword = async (
    values: ForgotPasswordSchema
  ): Promise<void> => {
    setIsLoading(true);
    try {
      const result = await simulateForgotPasswordApi(values.email);

      if (result.success) {
        toast.success(result.message);
        setIsSubmitted(true);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء محاولة إرسال رابط إعادة التعيين");
      console.error("ForgotPasswordForm - handleForgotPassword error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div
        dir="rtl"
        className="max-w-md mx-auto p-0 space-y-6 text-center"
        aria-label="رسالة تأكيد إرسال رابط إعادة التعيين"
      >
        <div className="space-y-3">
          <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-primary">تم إرسال الرابط</h2>
          <p className="text-muted-foreground text-sm">
            تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.
            <span className="block mt-2">
              يرجى التحقق من صندوق الوارد وإتباع التعليمات.
            </span>
          </p>
        </div>

        <div className="space-y-3">
          <p className="text-xs text-muted-foreground">
            لم تتلق الرسالة؟ تحقق من مجلد الرسائل غير المرغوب فيها.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setIsSubmitted(false);
              form.reset();
            }}
            className="w-full"
          >
            إرسال مرة أخرى
          </Button>
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
      aria-label="نموذج إعادة تعيين كلمة المرور"
    >
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-primary mb-1">
          إعادة تعيين كلمة المرور
        </h2>
        <p className="text-muted-foreground text-sm">
          أدخل عنوان بريدك الإلكتروني وسنرسل لك رابط لإعادة تعيين كلمة المرور.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleForgotPassword)}
          className="space-y-5"
          aria-label="نموذج إعادة تعيين كلمة المرور"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email-input">البريد الإلكتروني</FormLabel>
                <FormControl>
                  <Input
                    id="email-input"
                    type="email"
                    placeholder="example@example.com"
                    autoComplete="username"
                    {...field}
                    disabled={isLoading}
                    className="text-right"
                    autoFocus
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            aria-label="إرسال رابط إعادة التعيين"
          >
            إرسال رابط إعادة التعيين
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

      <div className="text-center text-xs text-muted-foreground">
        أو{" "}
        <Link to="/auth/sign-up" className="text-primary hover:underline">
          إنشاء حساب جديد
        </Link>
      </div>

      <div className="text-center text-xs text-muted-foreground mt-4">
        {`قال رسول الله ﷺ: "من يسر على مؤمن كربة من كرب الدنيا يسر الله عليه كربة من كرب يوم القيامة"`}
      </div>
    </div>
  );
}

ForgotPasswordForm.displayName = "ForgotPasswordForm";
