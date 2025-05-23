import User from './User'
import Character from './Character'
import Place from './Place'
import Item from './Item'
import Event from './Event'

export default interface Scene {
  id: string // UUID
  author: User
  short_description: string
  characters: Character[]
  place?: Place
  items: Item[]
  shown_events: Event[]
  told_events: Event[]
  external_conflict: string
  interpersonal_conflict: string
  internal_conflict: string
  time_order: number
}
