import 'reflect-metadata'

import { ApolloServer } from 'apollo-server-express'
import Express from 'express'
import { buildSchema } from 'type-graphql'

import { createConnection } from 'typeorm'

import { RegisterResolver } from './modules/user/Register'



const main = async() =>{
    // Read ormconfig.json and connect to database
    await createConnection();

    const schema = await buildSchema({
        // Can't just pass empty array
        resolvers:[RegisterResolver]
    })
    const apolloServer = new ApolloServer({schema})

    const app = Express()
    apolloServer.applyMiddleware({ app })
    app.listen(4000, () => console.log('Server started at http://localhost:4000/graphql'))
}

main()