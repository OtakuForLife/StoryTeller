import Chapter from "./Chapter"
import Character from "./character"


export default interface Story {
  id: number
  title: string
  description: string
  characters: Character[]
  chapters: Chapter[]
}