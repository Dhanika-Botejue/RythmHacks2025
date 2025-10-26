// Simple hardcoded user authentication
const USERS = {
  henry: { username: 'henry', password: 'henry123', userType: 'student', age: 8 },
  roy: { username: 'roy', password: 'roy123', userType: 'student', age: 7 },
  aiden: { username: 'aiden', password: 'aiden123', userType: 'student', age: 9 },
  dhanika: { username: 'dhanika', password: 'dhanika123', userType: 'teacher', age: 25 }
}

export function signin(username: string, password: string) {
  const user = USERS[username.toLowerCase() as keyof typeof USERS]
  
  if (!user) {
    throw new Error('User not found')
  }
  
  if (user.password !== password) {
    throw new Error('Invalid password')
  }
  
  return {
    username: user.username,
    age: user.age,
    userType: user.userType,
    token: 'mock-token-' + username
  }
}

export function signup(username: string, password: string, age: number, userType: string) {
  // Just for UI, won't actually create user
  if (USERS[username.toLowerCase() as keyof typeof USERS]) {
    throw new Error('Username already exists')
  }
  
  return {
    username,
    age,
    userType,
    token: 'mock-token-' + username
  }
}

export function getAuthToken() {
  return localStorage.getItem('auth_token')
}

export function clearAuthToken() {
  localStorage.removeItem('auth_token')
}
