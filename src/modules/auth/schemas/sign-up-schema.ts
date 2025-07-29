import * as z from "zod";

export const signUpSchema = z
  .object({
    firstName: z
      .string()
      .min(2, {
        message: "يجب أن يحتوي الاسم الأول على حرفين على الأقل",
      })
      .max(50, {
        message: "يجب ألا يزيد الاسم الأول عن 50 حرفًا",
      })
      .regex(/^[a-zA-Zأ-ي\s]+$/, {
        message: "يجب أن يحتوي الاسم الأول على أحرف فقط",
      }),
    lastName: z
      .string()
      .min(2, {
        message: "يجب أن يحتوي الاسم الأخير على حرفين على الأقل",
      })
      .max(50, {
        message: "يجب ألا يزيد الاسم الأخير عن 50 حرفًا",
      })
      .regex(/^[a-zA-Zأ-ي\s]+$/, {
        message: "يجب أن يحتوي الاسم الأخير على أحرف فقط",
      }),
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
    password: z
      .string()
      .min(8, {
        message: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل",
      })
      .max(128, {
        message: "يجب ألا تزيد كلمة المرور عن 128 حرفًا",
      })
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
        {
          message:
            "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل، وحرف صغير واحد، ورقم واحد، وحرف خاص واحد",
        }
      ),
    confirmPassword: z.string().min(1, {
      message: "تأكيد كلمة المرور مطلوب",
    }),
    acceptTerms: z.boolean().refine((value) => value === true, {
      message: "يجب الموافقة على الشروط والأحكام",
    }),
    receiveNotifications: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "كلمات المرور غير متطابقة",
    path: ["confirmPassword"],
  });

export type SignUpSchema = z.infer<typeof signUpSchema>;
