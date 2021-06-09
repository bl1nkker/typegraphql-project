import { graphql, GraphQLSchema } from "graphql"
import { Maybe } from "graphql/jsutils/Maybe"
import { createSchema } from "./../utils/createSchema"

interface Options {
    source: string,
    variableValues?:Maybe<{[key: string]: any;}>
}

let schema: GraphQLSchema;

// So here we pass resolver(Query or Mutation) and it's values
export const gCall = async({ source, variableValues} : Options) =>{
    if (!schema){
        schema = await createSchema()
    }
    // It requires "source", because it's "graphql" here
    return graphql({
        // Schema where we will call our resolvers
        schema,
        // Actually resolver, that we will call
        source,
        // Some variables
        variableValues
    })
}