import User from './User'
import { IdeaType } from './enums/IdeaType'

export default interface Idea {
  id: string // UUID
  author: User
  content: string
  type: IdeaType
  tags: string[]
  linked_elements: string[] // UUIDs as strings
}
