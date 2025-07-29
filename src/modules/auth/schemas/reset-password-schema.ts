import * as z from "zod";

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, {
      message: "رمز إعادة تعيين كلمة المرور مطلوب",
    }),
    newPassword: z
      .string()
      .min(8, {
        message: "يجب أن تتكون كلمة المرور الجديدة من 8 أحرف على الأقل",
      })
      .max(128, {
        message: "يجب ألا تزيد كلمة المرور الجديدة عن 128 حرفًا",
      })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        {
          message:
            "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل، وحرف صغير واحد، ورقم واحد، وحرف خاص واحد",
        }
      ),
    confirmNewPassword: z.string().min(1, {
      message: "تأكيد كلمة المرور الجديدة مطلوب",
    }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmNewPassword"],
  });

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
