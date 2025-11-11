import {z} from "zod";

export const UserToCreate = z.object({
    name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
    lastname: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
    age: z.number().int("La edad debe ser un número entero").positive("La edad debe ser positiva").max(120, "La edad debe ser un máximo de 120 años"),
    identificationNumber: z.number().int("El ID debe ser un número entero").positive("El ID debe ser positivo"),
    phoneNumber: z.number().positive("El número de teléfono debe ser positivo"),
    email: z.email("El formato del correo electrónico es incorrecto"),
    password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres")
});
export type UserToCreateType = z.infer<typeof UserToCreate>;

export type UserType = UserToCreateType & { id: string };

export const UserToLogin = z.object({
    identifier: z.string("El identificador debe ser un string"),
    password: z.string("La contraseña debe ser un string")
});
export type UserToLoginType = z.infer<typeof UserToLogin>;

