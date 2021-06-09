// User related thing
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql'
import bcrypt from 'bcryptjs'
import { User } from '../../entity/User'
import { RegisterInput } from './register/RegisterInput'
import { isAuth } from '../middleware/isAuth'
import { sendEmail } from '../utils/sendEmail'
import { createConfirmationUrl } from '../utils/createConfimationUrl'
import { MyContext } from 'src/types/MyContext'

// Decorator
@Resolver()
export class RegisterResolver {
    // Here we define query decorator, and what it will return
    // name - changes the name of query, // description: adds description to docs // nullable: changes strict
    @Query (() => String, {name:'sayHello', description:'Say hello', nullable:true})
    // Adding middleware to resolver
    @UseMiddleware(isAuth)
    async sayHello(
        @Ctx() ctx:MyContext
    ){
        const user = await User.findOne(ctx.req.session.userId)
        return 'Hello!' + user!.firstName + user!.lastName
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

        await sendEmail(email, createConfirmationUrl(user.id))

        return user
    }
}