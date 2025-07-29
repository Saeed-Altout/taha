import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";

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

import { verifyEmailSchema, type VerifyEmailSchema } from "../schemas";
import { simulateVerifyEmailApi, simulateResendVerificationApi } from "../api";

export function VerifyEmailForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [resendCooldown, setResendCooldown] = useState<number>(0);
  const [digitValues, setDigitValues] = useState<string[]>(Array(6).fill(""));

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Get email from navigation state or localStorage
  const email =
    location.state?.email ||
    JSON.parse(localStorage.getItem("userData") || "{}")?.email ||
    "";
  const fromSignup = location.state?.fromSignup || false;

  const form = useForm<z.infer<typeof verifyEmailSchema>>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: {
      verificationCode: "",
      email: email,
    },
  });

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleDigitChange = (index: number, value: string) => {
    // Only allow digits
    const numericValue = value.replace(/[^0-9]/g, "");
    if (numericValue.length > 1) return;

    const newDigitValues = [...digitValues];
    newDigitValues[index] = numericValue;
    setDigitValues(newDigitValues);

    // Update form value
    const verificationCode = newDigitValues.join("");
    form.setValue("verificationCode", verificationCode);

    // Auto-focus next input
    if (numericValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits are filled
    if (verificationCode.length === 6) {
      handleVerifyEmail({ verificationCode, email });
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digitValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const numericData = pastedData.replace(/[^0-9]/g, "").slice(0, 6);

    if (numericData.length > 0) {
      const newDigitValues = Array(6).fill("");
      for (let i = 0; i < numericData.length; i++) {
        newDigitValues[i] = numericData[i];
      }
      setDigitValues(newDigitValues);
      form.setValue("verificationCode", numericData.padEnd(6, ""));

      // Focus the next empty input or the last input
      const nextIndex = Math.min(numericData.length, 5);
      inputRefs.current[nextIndex]?.focus();
    }
  };

  const handleVerifyEmail = async (
    values: VerifyEmailSchema
  ): Promise<void> => {
    if (values.verificationCode.length !== 6) {
      toast.error("يرجى إدخال رمز التحقق كاملاً");
      return;
    }

    setIsLoading(true);
    try {
      const result = await simulateVerifyEmailApi(
        values.verificationCode,
        values.email
      );

      if (result.success) {
        toast.success(result.message);

        // Update user data to reflect email verification
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        userData.emailVerified = true;
        localStorage.setItem("userData", JSON.stringify(userData));

        // Navigate to dashboard or appropriate page
        navigate("/", {
          state: {
            message: "تم تفعيل بريدك الإلكتروني بنجاح! مرحباً بك.",
          },
        });
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء محاولة التحقق من البريد الإلكتروني");
      console.error("VerifyEmailForm - handleVerifyEmail error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async (): Promise<void> => {
    if (!email) {
      toast.error("عنوان البريد الإلكتروني غير متوفر");
      return;
    }

    setIsResending(true);
    try {
      const result = await simulateResendVerificationApi(email);

      if (result.success) {
        toast.success(result.message);
        setResendCooldown(60); // 60 seconds cooldown

        // Clear current input
        setDigitValues(Array(6).fill(""));
        form.setValue("verificationCode", "");
        inputRefs.current[0]?.focus();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء محاولة إعادة إرسال رمز التحقق");
      console.error("VerifyEmailForm - handleResendVerification error:", error);
    } finally {
      setIsResending(false);
    }
  };

  // If no email is provided, show error state
  if (!email) {
    return (
      <div
        dir="rtl"
        className="max-w-md mx-auto p-0 space-y-6 text-center"
        aria-label="خطأ في عنوان البريد الإلكتروني"
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
          <h2 className="text-2xl font-bold text-destructive">
            عنوان بريد إلكتروني غير صالح
          </h2>
          <p className="text-muted-foreground text-sm">
            لم يتم العثور على عنوان بريد إلكتروني للتحقق منه.
            <span className="block mt-2">
              يرجى تسجيل الدخول أو إنشاء حساب جديد.
            </span>
          </p>
        </div>

        <div className="space-y-3">
          <Link to="/auth/sign-up">
            <Button className="w-full">إنشاء حساب جديد</Button>
          </Link>
          <Link to="/auth/sign-in">
            <Button variant="outline" className="w-full">
              تسجيل الدخول
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="max-w-md mx-auto p-0 space-y-6"
      aria-label="نموذج تحقق البريد الإلكتروني"
    >
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-bold text-primary mb-1">
          تحقق من بريدك الإلكتروني
        </h2>
        <p className="text-muted-foreground text-sm">
          أدخل رمز التحقق المرسل إلى
        </p>
        <p className="text-primary font-medium text-sm">{email}</p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleVerifyEmail)}
          className="space-y-5"
          aria-label="نموذج تحقق البريد الإلكتروني"
        >
          <FormField
            control={form.control}
            name="verificationCode"
            render={() => (
              <FormItem>
                <FormLabel className="text-center block">رمز التحقق</FormLabel>
                <FormControl>
                  <div
                    className="flex gap-2 justify-center"
                    onPaste={handlePaste}
                  >
                    {Array.from({ length: 6 }, (_, index) => (
                      <Input
                        key={index}
                        ref={(el) => {
                          inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digitValues[index]}
                        onChange={(e) =>
                          handleDigitChange(index, e.target.value)
                        }
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        disabled={isLoading}
                        className="w-12 h-12 text-center text-lg font-bold"
                        autoFocus={index === 0}
                        aria-label={`رقم ${index + 1} من رمز التحقق`}
                      />
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={digitValues.join("").length !== 6}
            aria-label="تحقق من البريد الإلكتروني"
          >
            تحقق من البريد الإلكتروني
          </Button>
        </form>
      </Form>

      <div className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">لم تتلق رمز التحقق؟</p>

        <Button
          variant="outline"
          onClick={handleResendVerification}
          disabled={isResending || resendCooldown > 0}
          isLoading={isResending}
          className="w-full"
        >
          {resendCooldown > 0
            ? `إعادة الإرسال خلال ${resendCooldown} ثانية`
            : "إعادة إرسال رمز التحقق"}
        </Button>
      </div>

      <div className="text-center text-xs text-muted-foreground">
        تحقق من مجلد الرسائل غير المرغوب فيها إذا لم تجد الرسالة في صندوق
        الوارد.
      </div>

      {!fromSignup && (
        <div className="text-center">
          <Link
            to="/auth/sign-in"
            className="text-primary hover:underline text-sm font-medium"
          >
            العودة إلى تسجيل الدخول
          </Link>
        </div>
      )}

      <div className="text-center text-xs text-muted-foreground mt-4">
        {`قال رسول الله ﷺ: "إن الله يحب إذا عمل أحدكم عملاً أن يتقنه"`}
      </div>
    </div>
  );
}

VerifyEmailForm.displayName = "VerifyEmailForm";
