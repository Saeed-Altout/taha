import * as z from "zod";

export const signInSchema = z.object({
  email: z.string().email({
    message: "يرجى إدخال عنوان بريد إلكتروني صالح",
  }),
  password: z
    .string()
    .min(8, {
      message: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل",
    })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      {
        message:
          "يجب أن تحتوي كلمة المرور على حرف كبير واحد على الأقل، وحرف صغير واحد، ورقم واحد، وحرف خاص واحد",
      }
    ),
  rememberMe: z.boolean().optional(),
});

export type SignInSchema = z.infer<typeof signInSchema>;
