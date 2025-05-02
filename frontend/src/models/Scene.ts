import User from './User'
import Character from './Character'
import Place from './Place'
import Items from './Item'

export default interface Scene {
  id: string // UUID
  author: User
  short_description: string
  characters: Character[]
  place?: Place
  items: Items[]
  external_conflict: string
  interpersonal_conflict: string
  internal_conflict: string
  time_order: number
}
