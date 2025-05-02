import User from './User'
import Character from './Character'

export default interface Item {
  id: string // UUID
  author: User
  name: string
  origin: string
  owners: Character[]
}
