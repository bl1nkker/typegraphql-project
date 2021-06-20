import { testConnection } from "./../../../test-utils/testConnection"
import { Connection } from "typeorm"
import {describe, beforeAll, afterAll, it} from '@jest/globals'
import { gCall } from "./../../../test-utils/gCall";
import { User } from "../../../entity/User";
import faker from 'faker'

let connection:Connection;
// Executes BEFORE all tests
beforeAll( async() => {
    // Creates new connection (without db drops)
   connection = await testConnection()
})
// Executes AFTER all tests
afterAll(async() => { 
  await connection.close()
})


const getUserQuery = `
{
    getUser{
      id
      firstName
      lastName
      email
      name
    }
  }
`

// describe(name, fn) creates a block that groups together several related tests
describe('Get User', () => {
    // First test, named "create user"
    it("get current user", async () =>{
        const user = await User.create({
            firstName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            email: faker.internet.email(),
            password: faker.internet.password()
        }).save()
        // In this test we will call some resolver
        const response = await gCall({
            source: getUserQuery,
            userId: user.id
        })
        
        // That's for tests
        expect(response).toMatchObject({
        // Expecting our response to match this object:
            data: {
                getUser:{
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
            }
            }
        })
    })

    it('expecting nullable user', async() =>{
        const response = await gCall({
            source: getUserQuery
        })
        expect(response).toMatchObject({
            data:{
                getUser:null
            }
        })
    })
})

