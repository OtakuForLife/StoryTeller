
import User from './User'
import Race from './Race'
import { Gender } from './enums/Gender'

export default interface Character {
  id: string // UUID
  author: User
  name: string
  surname: string
  nickname: string
  gender?: Gender
  race?: Race
}
