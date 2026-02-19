import Dexie, { type EntityTable } from 'dexie'
import type { User } from '@/common/types/user'

class AppDB extends Dexie {
  users!: EntityTable<User, 'id'>

  constructor() {
    super('AppDB')
    this.version(1).stores({
      // id is autoincrement primary key, email is unique index
      users: '++id, &email',
    })
  }
}

export const db = new AppDB()
