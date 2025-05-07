
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


export function generateRandomName () {
  const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'Logan', 
                      'Aria', 'Lucas', 'Mia', 'Jackson', 'Riley', 'Aiden', 'Zoe', 'Caden', 'Lily', 'Grayson']
  const surnames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia', 'Rodriguez', 'Wilson',
                    'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Hernandez', 'Moore', 'Martin', 'Jackson', 'Thompson', 'White']
  
  const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const randomSurname = surnames[Math.floor(Math.random() * surnames.length)]
  
  return { firstName: randomFirstName, surname: randomSurname }
}