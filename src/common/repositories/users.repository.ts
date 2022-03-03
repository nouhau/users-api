import { EntityManager, EntityRepository } from 'typeorm'
import { User } from '../entities/Users'

@EntityRepository(User)
export class UserRepository {
    private manager: EntityManager;

    constructor (manager: EntityManager) {
      this.manager = manager
    }

    getAll = async (): Promise<User[]> => {
      return await this.manager.find(User)
    }

    getById = async (userId: string): Promise<User> => {
      return await this.manager.findOne(User, {
        where: {
          user_id: userId
        }
      })
    }

    save = async (user: User): Promise<User> => {
      return await this.manager.save(user)
    }

    findAuthUser = async (email: string): Promise<User> => {
      return await this.manager.findOne(User, {
        where: {
          email
        }
      })
    }
}
