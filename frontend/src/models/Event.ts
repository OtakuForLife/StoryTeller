import User from './User'
import Character from './Character'
import Place from './Place'
import Item from './Item'

export default interface Event {
  id: string // UUID
  author: User
  description: string
  characters: Character[]
  place?: Place
  items: Item[]
  time_order: number
}
