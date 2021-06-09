import { buildSchema } from "type-graphql";

export const createSchema = () => buildSchema({
    // resolvers:[RegisterResolver, LoginResolver, GetUser, ConfirmUserResolver]

    // autoimport
    // Here we find ALL TS-files, that not have .test. extensions
    resolvers: [__dirname + '/../modules/**/!(*.test).ts']
})