import { Field, ID, ObjectType, Root } from "type-graphql";
import {Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm";

// Like models in MongoDB i think
@ObjectType()
@Entity()
export class User extends BaseEntity{

    // Required. MongoDB automatically provide ID, but Postgres is not
    // @PrimaryGeneratedColumn() creates a primary column which value will be automatically generated with an auto-increment value.
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    // Each entity class property you marked with @Column will be mapped to a database table column.

    // @Field - GraphQL will see it
    // @Column - Database will see it
    @Field()
    @Column()
    firstName: string;

    @Field()
    @Column()
    lastName: string;

    // unique:true - Users can't pass the same emails
    @Field()
    @Column("text", { unique:true })
    email: string;

    // This prop will not be shown in the database
    @Field()
    name(@Root() parent: User ): string{
        return `${parent.firstName} ${parent.lastName}`
    }

    // This prop will not be shown in the graphql
    @Column()
    password: string;

    @Column("bool", { default:false })
    confirmed: boolean

}