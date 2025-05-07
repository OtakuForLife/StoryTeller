import Chapter from './Chapter'
import Event from './Event'
import User from './User'

export default interface Story {
  id: string // UUID
  author?: User
  title: string
  promise: string
  plot: string
  emotional_matter: string
  universal_truth: string
  logline: string
  events: Event[]
  chapters: Chapter[]
}

export const generateRandomTitle = () => {
  const adjectives = ['lost', 'found', 'forgotten', 'remembered', 'hidden', 'revealed', 'forgiven', 'betrayed', 'loved', 'hated']
  const nouns = ['heart', 'mind', 'soul', 'spirit', 'body', 'life', 'death', 'love', 'hate', 'hope']
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)]
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)]
  return `${randomAdjective}-${randomNoun}`
}
