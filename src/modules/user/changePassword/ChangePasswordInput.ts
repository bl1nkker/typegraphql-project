import { PasswordInput } from "./../../shared/PasswordInput";
import { Field, InputType } from "type-graphql";

// GraphQL Input 
@InputType()
export class ChangePasswordInput extends PasswordInput{
    @Field()
    token:string;

    // Extends from PasswordInput:
    // @Field()
    // @Min(5)
    // password: string;
}