
# Database Model

Story
- id: UUID
- title: String
- promise: Text
- plot: Text # What happens?
- emotional_matter: Text # Why does this matter to the protagonist
- universal_truth: Text # what universal truth does this reveal about human nature
- logline: Text # When [inciting incident] happens to [protagonis]. they must [objective], or else [stakes] - but [obstacle] stands in their way
- author: User

Chapter
- id: UUID
- story: Story
- order: Integer
- title: Text
- content: Text

Scene
- id: UUID
- author: User
- short_description: Text
- characters: Character[]
- place: Place
- items: Items[]
- external_conflict: Text
- interpersonal_conflict: Text
- internal_conflict: Text
- time_order: Integer

Gender
	Male
	Female

Character
- id: UUID
- author: User
- name: String
- surname: String
- nickname: String
- gender: Gender
- race: Race
- arcs: CharacterArc[]

RelationshipType
	Friend
	Enemy
	Mentor
	Lover
	Family
	

CharacterRelationship
- id: UUID
- from_character: Character
- to_character: Character
- type: RelationshipType[]
- description: Text

CharacterArcType
	Positive
	Negative
	Flat

CharacterArc
- id: UUID
- author: User
- description: Text
- arc_type: CharacterArcType
- start_trait: Text
- end_trait: Text
- change_trigger: Text

Place
- id: UUID
- author: User
- name: String
- places: Place[]
- adjectives: Text

Items
- id: UUID
- author: User
- name
- origin: Text
- owner: Character[]

IdeaType
	Character
	Place
	Item
	Scene
	Conflict
	Dialogue
	Concept
	World Detail
	Plot Twist

Idea
- id: UUID
- author: User
- content: Text
- type: IdeaType
- tags: String[]
- linked_elements: UUID[]

Race
- id: UUID
- name: String
- description: Text

CharacterTrait
- id: UUID
- name: String
- description: Text