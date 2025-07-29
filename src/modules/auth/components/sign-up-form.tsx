import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
import { Checkbox } from "@/components/ui/checkbox";

import { signUpSchema, type SignUpSchema } from "../schemas";
import { simulateSignUpApi } from "../api";

export function SignUpForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
      receiveNotifications: false,
    },
  });

  const handleSignUp = async (values: SignUpSchema): Promise<void> => {
    setIsLoading(true);
    try {
      const authResult = await simulateSignUpApi({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        acceptTerms: values.acceptTerms,
        receiveNotifications: values.receiveNotifications,
      });

      if (authResult.success) {
        toast.success(authResult.message);
        localStorage.setItem("token", authResult.token || "");
        localStorage.setItem("userData", JSON.stringify(authResult.data));

        // Navigate to email verification page or dashboard
        navigate("/auth/verify-email", {
          state: { email: values.email, fromSignup: true },
        });
      } else {
        toast.error(authResult.message);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء محاولة إنشاء الحساب");
      console.error("SignUpForm - handleSignUp error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="max-w-md mx-auto p-0 space-y-6"
      aria-label="نموذج إنشاء حساب جديد"
    >
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-primary mb-1">
          إنشاء حساب جديد
        </h2>
        <p className="text-muted-foreground text-sm">
          {`أهلاً وسهلاً بك! `}
          <span className="block">
            {`انضم إلينا واستمتع بالخدمات المتميزة.`}
          </span>
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSignUp)}
          className="space-y-4"
          aria-label="نموذج إنشاء حساب جديد"
        >
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="first-name-input">الاسم الأول</FormLabel>
                  <FormControl>
                    <Input
                      id="first-name-input"
                      type="text"
                      placeholder="أحمد"
                      autoComplete="given-name"
                      {...field}
                      disabled={isLoading}
                      className="text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="last-name-input">الاسم الأخير</FormLabel>
                  <FormControl>
                    <Input
                      id="last-name-input"
                      type="text"
                      placeholder="محمد"
                      autoComplete="family-name"
                      {...field}
                      disabled={isLoading}
                      className="text-right"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

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
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="password-input">كلمة المرور</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="password-input"
                      type={showPassword ? "text" : "password"}
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
                        showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-primary transition"
                      onClick={() => setShowPassword((prev) => !prev)}
                      disabled={isLoading}
                    >
                      {showPassword ? "إخفاء" : "إظهار"}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="confirm-password-input">
                  تأكيد كلمة المرور
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      id="confirm-password-input"
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

          <FormField
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                    id="accept-terms-checkbox"
                    className="mt-1"
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel
                    htmlFor="accept-terms-checkbox"
                    className="text-sm font-normal cursor-pointer"
                  >
                    أوافق على{" "}
                    <Link
                      to="/terms"
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      الشروط والأحكام
                    </Link>{" "}
                    و{" "}
                    <Link
                      to="/privacy"
                      className="text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      سياسة الخصوصية
                    </Link>
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="receiveNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                    id="receive-notifications-checkbox"
                  />
                </FormControl>
                <FormLabel
                  htmlFor="receive-notifications-checkbox"
                  className="text-sm font-normal cursor-pointer"
                >
                  أرغب في تلقي الإشعارات والتحديثات عبر البريد الإلكتروني
                </FormLabel>
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            aria-label="إنشاء الحساب"
          >
            إنشاء الحساب
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">لديك حساب بالفعل؟ </span>
        <Link
          to="/auth/sign-in"
          className="text-primary hover:underline font-medium"
        >
          تسجيل الدخول
        </Link>
      </div>

      <div className="text-center text-xs text-muted-foreground mt-4">
        {`قال الله تعالى: "وَقُل رَّبِّ زِدْنِي عِلْمًا"`}
      </div>
    </div>
  );
}

SignUpForm.displayName = "SignUpForm";
