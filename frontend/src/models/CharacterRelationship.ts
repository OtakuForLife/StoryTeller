import Character from './Character'
import { RelationshipType } from './enums/RelationshipType'

export default interface CharacterRelationship {
  id: string // UUID
  character1: Character
  character2: Character
  relationship_type: RelationshipType
  description: string
}
