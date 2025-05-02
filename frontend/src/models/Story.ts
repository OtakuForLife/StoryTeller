import Chapter from './Chapter'
import User from './User'

export default interface Story {
  id: string // UUID
  author: User
  title: string
  promise: string
  plot: string
  emotional_matter: string
  universal_truth: string
  logline: string
  chapters: Chapter[]
}