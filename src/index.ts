import 'reflect-metadata'

import { ApolloServer } from 'apollo-server-express'
import Express from 'express'
import { buildSchema } from 'type-graphql'

import { createConnection } from 'typeorm'

import { RegisterResolver } from './modules/user/Register'
import session from 'express-session'
import connectRedis from 'connect-redis'
import { redis } from './redis'
import cors from 'cors'
import { LoginResolver } from './modules/user/Login'
import { GetUser } from './modules/user/GetUser'



const main = async() =>{
    // Read ormconfig.json and connect to database
    await createConnection();
    const app = Express()
    const RedisStore = connectRedis(session)

    // GraphQL Schema
    const schema = await buildSchema({
        resolvers:[RegisterResolver, LoginResolver, GetUser]
    })
    // Connect to ApolloServer
    const apolloServer = new ApolloServer({
        schema,
        context: ({ req }: any) => ({ req })
    })

    // That is need for storing session in cookies
    // const sessionOption: session.SessionOptions = ;
      // Apply middleware
    app.use(cors({
        credentials: true,
        origin: "http://localhost:3000"
    }))
    app.use(session({
        // Define a Redis Store, where data will be stored (mb cookies)
        store: new RedisStore({
          client: redis as any
        }),
        // Name of the property
        name: "qid",
        secret: "123",
        // With this it won't create new sessions
        resave: false,
        saveUninitialized: false,
        // Cookies config
        cookie: {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
        },
      }));

    apolloServer.applyMiddleware({ app })
    app.listen(4000, () => console.log('Server started at http://localhost:4000/graphql'))
}

main()