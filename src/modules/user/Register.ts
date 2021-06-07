// User related thing

import { Arg, FieldResolver, Mutation, Query, Resolver, Root } from 'type-graphql'
import * as bcrypt from 'bcryptjs'
import { User } from '../../entity/User'

// Decorator
@Resolver(User)
export class RegisterResolver {
    // Here we define query decorator, and what it will return
    // name - changes the name of query, // description: adds description to docs // nullable: changes strict
    @Query (() => String, {name:'differentName', description:'Say hello', nullable:true})
    async differentName(){
        return 'Hello!'
    }

    // Work with the @Field Decorator
    @FieldResolver()
    async name(@Root() parent: User){
        return `${parent.firstName} ${parent.lastName}`
    }

    // @Mutation(() => User) - Type, that will be shown in the GraphQL
    @Mutation(() => User)
    async register(
        // Pass arguments
        @Arg('firstName') firstName: string,
        @Arg('lastName') lastName: string,
        @Arg('email') email: string,
        @Arg('password') password: string
        // TypeScript type (no deal with GraphQL). It will just throw an error, when we return non-User object
        ):Promise<User>{

        // Hashing password
        const hashedPassword = await bcrypt.hash(password, 12)

        // Create and save user to database
        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword
        }).save()
        return user
    }
}