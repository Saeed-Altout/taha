import * as z from "zod";

export const verifyEmailSchema = z.object({
  verificationCode: z
    .string()
    .min(6, {
      message: "يجب أن يتكون رمز التحقق من 6 أرقام",
    })
    .max(6, {
      message: "يجب أن يتكون رمز التحقق من 6 أرقام",
    })
    .regex(/^\d{6}$/, {
      message: "يجب أن يحتوي رمز التحقق على أرقام فقط",
    }),
  email: z
    .string()
    .email({
      message: "يرجى إدخال عنوان بريد إلكتروني صالح",
    })
    .optional(),
});

export const resendVerificationSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "البريد الإلكتروني مطلوب",
    })
    .email({
      message: "يرجى إدخال عنوان بريد إلكتروني صالح",
    }),
});

export type VerifyEmailSchema = z.infer<typeof verifyEmailSchema>;
export type ResendVerificationSchema = z.infer<typeof resendVerificationSchema>;
