import { UserType } from "../schemas/users.schemas";
import { ValidationError } from "../errors/ExternalErrors";

export class User {
    private readonly _id: string;
    private _name: string;
    private _lastname: string;
    private _age: number;
    private _identificationNumber: number;
    private _phoneNumber: number;
    private _email: string;
    private _password: string;
    
    constructor(userProperties: UserType) {
        this._id = userProperties.id;
        this._name = userProperties.name;
        this._lastname = userProperties.lastname;
        this._age = userProperties.age;
        this._identificationNumber = userProperties.identificationNumber;
        this._phoneNumber = userProperties.phoneNumber;
        this._email = userProperties.email;
        this._password = userProperties.password;
    }

    set name(newName: string) {
        this._name = newName;
    }

    set lastname(newLastname: string) {
        this._lastname = newLastname;
    }

    set age(newAge: number) {
        if (newAge <= 0 || newAge > 120) {
            throw new ValidationError("La edad debe ser un número positivo y menor o igual a 120");
        }
        this._age = newAge;
    }

    set identificationNumber(newIdentificationNumber: number) {
        if (newIdentificationNumber <= 0) {
            throw new ValidationError("El número de identificación debe ser un número positivo");
        }   
        this._identificationNumber = newIdentificationNumber;
    }

    set phoneNumber(newPhoneNumber: number) {
        if (newPhoneNumber <= 0) {
            throw new ValidationError("El número de teléfono debe ser un número positivo");
        }
        this._phoneNumber = newPhoneNumber;
    }

    set email(newEmail: string) {
        if (!/\S+@\S+\.\S+/.test(newEmail)) {
            throw new ValidationError("El formato del correo electrónico es incorrecto");
        }
        this._email = newEmail;
    }

    set password(newPassword: string) {
        if (newPassword.length < 8) {
            throw new ValidationError("La contraseña debe tener al menos 8 caracteres");
        }
        this._password = newPassword;
    }

    get id(): string {
        return this._id;
    }
    
    get name(): string {
        return this._name;
    }

    get lastname(): string {
        return this._lastname;
    }

    get age(): number {
        return this._age;
    }      

    get identificationNumber(): number {
        return this._identificationNumber;
    }      
    get phoneNumber(): number {
        return this._phoneNumber;
    }      

    get email(): string {
        return this._email;
    }      

    get password(): string {
        return this._password;
    } 
}   