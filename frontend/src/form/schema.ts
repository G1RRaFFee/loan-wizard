// Обоснование библиотек:
// - react-hook-form + zod: быстрая и надёжная валидация на каждом шаге с тайпингами.
// - @tanstack/react-query: кэшируем список категорий (мест работы) и переиспользуем его на нескольких шагах без повторных запросов.
// - react-input-mask: дешёвая и точная маска телефона без самописной логики парсинга.

import { z } from "zod";

export const GENDERS = [
  { value: "male", label: "Мужской" },
  { value: "female", label: "Женский" },
] as const;

export const formSchema = z.object({
  phone: z
    .string({ required_error: "Телефон обязателен" })
    .regex(/^0\d{3}\s\d{3}\s\d{3}$/, "Формат: 0XXX XXX XXX"),
  firstName: z
    .string({ required_error: "Имя обязательно" })
    .trim()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(50, "Имя не должно превышать 50 символов")
    .regex(
      /^[а-яёА-ЯЁa-zA-Z\s-]+$/,
      "Имя может содержать только буквы, пробелы и дефисы"
    ),
  lastName: z
    .string({ required_error: "Фамилия обязательна" })
    .trim()
    .min(2, "Фамилия должна содержать минимум 2 символа")
    .max(50, "Фамилия не должна превышать 50 символов")
    .regex(
      /^[а-яёА-ЯЁa-zA-Z\s-]+$/,
      "Фамилия может содержать только буквы, пробелы и дефисы"
    ),
  gender: z.enum(["male", "female"], { required_error: "Выберите пол" }),

  workPlace: z
    .string({ required_error: "Выберите место работы" })
    .trim()
    .min(1, "Выберите место работы"),
  address: z
    .string({ required_error: "Адрес обязателен" })
    .trim()
    .min(5, "Адрес должен содержать минимум 5 символов")
    .max(200, "Адрес не должен превышать 200 символов"),

  amount: z
    .number({ required_error: "Укажите сумму" })
    .min(200, "Минимальная сумма: $200")
    .max(1000, "Максимальная сумма: $1000"),
  termDays: z
    .number({ required_error: "Укажите срок" })
    .min(10, "Минимальный срок: 10 дней")
    .max(30, "Максимальный срок: 30 дней"),
});

export type FormValues = z.infer<typeof formSchema>;

export const step1Fields: Array<keyof FormValues> = [
  "phone",
  "firstName",
  "lastName",
  "gender",
];

export const step2Fields: Array<keyof FormValues> = ["workPlace", "address"];

export const step3Fields: Array<keyof FormValues> = ["amount", "termDays"];

export const defaultValues: FormValues = {
  phone: "",
  firstName: "",
  lastName: "",
  gender: "male",
  workPlace: "",
  address: "",
  amount: 200,
  termDays: 10,
};
