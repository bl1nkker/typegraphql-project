// import { ChangePasswordResolver } from "../modules/user/ChangePassword";
// import { ConfirmUserResolver } from "../modules/user/ConfirmUser";
// import { ForgotPasswordResolver } from "../modules/user/ForgotPassword";
// import { GetUser } from "../modules/user/GetUser";
// import { LoginResolver } from "../modules/user/Login";
// import { LogOutResolver } from "../modules/user/LogOut";
// import { RegisterResolver } from "../modules/user/Register";
import { buildSchema } from "type-graphql";

export const createSchema = () => buildSchema({
    // resolvers:[
    //     RegisterResolver, 
    //     LoginResolver, 
    //     GetUser, 
    //     ChangePasswordResolver,
    //     ConfirmUserResolver,
    //     ForgotPasswordResolver,
    //     LogOutResolver]

    // autoimport
    // Here we find ALL TS-files, that not have .test. extensions
    resolvers: [__dirname + '/../modules/**/!(*.test).ts']
})