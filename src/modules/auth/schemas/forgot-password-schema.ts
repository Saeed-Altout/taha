import * as z from "zod";

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "البريد الإلكتروني مطلوب",
    })
    .email({
      message: "يرجى إدخال عنوان بريد إلكتروني صالح",
    })
    .max(100, {
      message: "يجب ألا يزيد البريد الإلكتروني عن 100 حرف",
    }),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
