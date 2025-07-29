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

import { signInSchema, type SignInSchema } from "../schemas";
import { simulateLoginApi } from "../api";

export function SignInForm() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleSignIn = async (values: SignInSchema): Promise<void> => {
    setIsLoading(true);
    try {
      const authResult = await simulateLoginApi(values.email, values.password);

      if (authResult.success) {
        toast.success(authResult.message);
        localStorage.setItem("token", authResult.token || "");
        navigate("/");
      } else {
        toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء محاولة تسجيل الدخول");
      console.error("SignInForm - handleSignIn error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="max-w-md mx-auto p-0 space-y-6"
      aria-label="نموذج تسجيل الدخول"
    >
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-primary mb-1">
          السلام عليكم ورحمة الله وبركاته
        </h2>
        <p className="text-muted-foreground text-sm">
          {`مرحبًا بعودتك! `}
          <span className="block">
            {`نسأل الله لك التوفيق والسداد في أعمالك.`}
          </span>
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSignIn)}
          className="space-y-5"
          aria-label="نموذج تسجيل الدخول"
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
                      autoComplete="current-password"
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
                <div className="mt-1 text-left">
                  <Link
                    to="/auth/forgot-password"
                    className="text-xs text-primary hover:underline"
                    tabIndex={isLoading ? -1 : 0}
                  >
                    هل نسيت كلمة المرور؟
                  </Link>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center gap-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                    id="remember-me-checkbox"
                  />
                </FormControl>
                <FormLabel
                  htmlFor="remember-me-checkbox"
                  className="text-sm font-normal"
                >
                  تذكرني
                </FormLabel>
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            aria-label="تسجيل الدخول"
          >
            تسجيل الدخول
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <span className="text-muted-foreground">ليس لديك حساب؟ </span>
        <Link
          to="/auth/sign-up"
          className="text-primary hover:underline font-medium"
        >
          إنشاء حساب جديد
        </Link>
      </div>

      <div className="text-center text-xs text-muted-foreground mt-4">
        {`قال رسول الله ﷺ: "من سلك طريقًا يلتمس فيه علمًا سهّل الله له به طريقًا إلى الجنة"`}
      </div>
    </div>
  );
}
SignInForm.displayName = "SignInForm";
