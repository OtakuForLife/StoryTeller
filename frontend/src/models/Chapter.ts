
import Story from './Story'
import Scene from './Scene'

export default interface Chapter {
  id: string // UUID
  story: Story
  included_scenes: Scene[]
  order: number
  title: string
  content: string
}