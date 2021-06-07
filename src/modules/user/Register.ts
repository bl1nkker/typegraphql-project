// User related thing

import { Arg, Mutation, Query, Resolver } from 'type-graphql'
import bcrypt from 'bcryptjs'
import { User } from '../../entity/User'
import { RegisterInput } from './register/RegisterInput'

// Decorator
@Resolver()
export class RegisterResolver {
    // Here we define query decorator, and what it will return
    // name - changes the name of query, // description: adds description to docs // nullable: changes strict
    @Query (() => String, {name:'sayHello', description:'Say hello', nullable:true})
    async sayHello(){
        return 'Hello!'
    }

    // Work with the @Field Decorator
    // @FieldResolver()
    // async name(@Root() parent: User){
    //     return `${parent.firstName} ${parent.lastName}`
    // }
    // In User.ts this logic is already written 

    // @Mutation(() => User) - Type, that will be shown in the GraphQL
    @Mutation(() => User)
    async register(
        // Pass arguments
        @Arg('data') { email, firstName, lastName, password }:RegisterInput
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