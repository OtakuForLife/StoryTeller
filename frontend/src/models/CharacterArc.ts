import User from './User'
import Character from './Character'
import { CharacterArcType } from './enums/CharacterArcType'

export default interface CharacterArc {
  id: string // UUID
  character: Character
  author: User
  description: string
  arc_type: CharacterArcType
  start_trait: string
  end_trait: string
  change_trigger: string
}
