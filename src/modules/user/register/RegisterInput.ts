import { IsEmail, Length } from "class-validator";
import { PasswordInput } from "./../../shared/PasswordInput";
import { Field, InputType } from "type-graphql";
import { IsEmailAlreadyExist } from "./isEmailAlreadyExists";

// GraphQL Input 
@InputType()
export class RegisterInput extends PasswordInput{
    @Field() 
    @Length(1, 255)
    firstName: string;

    @Field()
    // Validation for char length
    @Length(1, 255)
    lastName: string;
    
    @Field()
    // Checks if an emain is actually an email
    @IsEmail()
    @IsEmailAlreadyExist({ message:'User with that email is already exists!' })
    email: string;

    // Extends from PasswordInput:
    // @Field()
    // @Min(5)
    // password: string;
}