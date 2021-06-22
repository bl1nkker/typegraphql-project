import 'reflect-metadata'

import { ApolloServer } from 'apollo-server-express'
import Express from 'express'

import { createConnection } from 'typeorm'

import session from 'express-session'
import connectRedis from 'connect-redis'
import { redis } from './redis'
import cors from 'cors'
import { createSchema } from './utils/createSchema'
import { graphqlUploadExpress } from 'graphql-upload'



const main = async() =>{
    // Read ormconfig.json and connect to database
    await createConnection();
    const app = Express()
    const RedisStore = connectRedis(session)

    // GraphQL Schema
    const schema = await createSchema()
    // Connect to ApolloServer
    const apolloServer = new ApolloServer({
        schema,
        context: ({ req, res }: any) => ({ req, res }),
        uploads:false
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
    app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }))
    apolloServer.applyMiddleware({ app })
    app.listen(4000, () => console.log('Server started at http://localhost:4000/graphql'))
}

main()