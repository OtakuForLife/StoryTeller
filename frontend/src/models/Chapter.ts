
import Story from './Story'

export default interface Chapter {
  id: string // UUID
  story: Story
  order: number
  title: string
  content: string
}