import { IsEmail, Length } from "class-validator";
import { Field, InputType } from "type-graphql";
import { IsEmailAlreadyExist } from "./isEmailAlreadyExists";

// GraphQL Input 
@InputType()
export class RegisterInput{
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

    @Field()
    password: string;

}