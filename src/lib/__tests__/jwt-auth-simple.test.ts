import jwt from 'jsonwebtoken'

// Mock environment variables
process.env.JWT_SECRET = 'test-secret-key'

describe('JWT Token Generation and Verification', () => {
  it('should generate and verify JWT tokens', () => {
    const user = {
      id: 'test-user-id',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      role: 'App_user'
    }

    // Generate token
    const token = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '15m' })
    
    expect(token).toBeDefined()
    expect(typeof token).toBe('string')
    expect(token.split('.')).toHaveLength(3) // JWT has 3 parts

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any
    
    expect(decoded).toBeDefined()
    expect(decoded.id).toBe(user.id)
    expect(decoded.email).toBe(user.email)
    expect(decoded.first_name).toBe(user.first_name)
    expect(decoded.last_name).toBe(user.last_name)
    expect(decoded.role).toBe(user.role)
  })

  it('should fail verification with invalid token', () => {
    const invalidToken = 'invalid.token.here'
    
    expect(() => {
      jwt.verify(invalidToken, process.env.JWT_SECRET!)
    }).toThrow()
  })

  it('should fail verification with wrong secret', () => {
    const user = { id: 'test', email: 'test@example.com' }
    const token = jwt.sign(user, 'correct-secret', { expiresIn: '15m' })
    
    expect(() => {
      jwt.verify(token, 'wrong-secret')
    }).toThrow()
  })
})

describe('Password Hashing', () => {
  it('should hash and verify passwords with argon2', async () => {
    const { hash, verify } = require('argon2')
    
    const password = 'testpassword123'
    const hashedPassword = await hash(password)
    
    expect(hashedPassword).toBeDefined()
    expect(typeof hashedPassword).toBe('string')
    expect(hashedPassword).toContain('$argon2id$') // Argon2id format
    
    // Verify password
    const isValid = await verify(hashedPassword, password)
    expect(isValid).toBe(true)
    
    // Verify wrong password
    const isInvalid = await verify(hashedPassword, 'wrongpassword')
    expect(isInvalid).toBe(false)
  })
}) 