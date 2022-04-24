import { createConnection, getConnection } from 'typeorm'

const mockConnection = {
  async create () {
    return await createConnection({
      name: 'test',
      type: 'sqlite',
      database: './src/__mocks__/database.test.sqlite'
    })
  },

  get () {
    return getConnection('test')
  },

  async close () {
    await getConnection('test').close()
  },

  async clear () {
    const connection = getConnection('test')
    const entities = connection.entityMetadatas

    await Promise.all(entities.map(async (entity) => {
      const repository = connection.getRepository(entity.name)
      await repository.query(`DELETE FROM ${entity.tableName}`)
    }))
  }
}

export default mockConnection
