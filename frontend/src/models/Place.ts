
import User from './User'

export default interface Place {
  id: string // UUID
  author: User
  name: string
  parent?: Place
  adjectives: string
}