import { JWTAuth } from '../jwt-auth'

// Mock Directus SDK
jest.mock('@directus/sdk', () => ({
  createDirectus: jest.fn(() => ({
    with: jest.fn(() => ({
      login: jest.fn(),
      logout: jest.fn(),
      readItems: jest.fn(),
      createItem: jest.fn(),
      updateItem: jest.fn(),
    })),
  })),
}))

describe('JWTAuth', () => {
  let jwtAuth: JWTAuth

  beforeEach(() => {
    jwtAuth = new JWTAuth()
    jest.clearAllMocks()
  })

  describe('generateAccessToken', () => {
    it('should generate a valid access token', () => {
      const user = {
        id: 'test-user-id',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        role: 'App_user'
      }

      const token = jwtAuth.generateAccessToken(user)
      
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
    })
  })

  describe('generateRefreshToken', () => {
    it('should generate a valid refresh token', () => {
      const user = {
        id: 'test-user-id',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        role: 'App_user'
      }

      const token = jwtAuth.generateRefreshToken(user)
      
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3)
    })
  })

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const user = {
        id: 'test-user-id',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        role: 'App_user'
      }

      const token = jwtAuth.generateAccessToken(user)
      const payload = jwtAuth.verifyToken(token)
      
      expect(payload).toBeDefined()
      expect(payload?.id).toBe(user.id)
      expect(payload?.email).toBe(user.email)
    })

    it('should return null for invalid token', () => {
      const payload = jwtAuth.verifyToken('invalid-token')
      expect(payload).toBeNull()
    })
  })

  describe('registerUser', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'newuser@example.com',
        password: 'password123',
        first_name: 'New',
        last_name: 'User'
      }

      // Mock successful user creation
      const mockCreateItem = jest.fn().mockResolvedValue({
        id: 'new-user-id',
        email: userData.email,
        first_name: userData.first_name,
        last_name: userData.last_name,
        role: 'public'
      })

      const mockUpdateItem = jest.fn().mockResolvedValue({
        id: 'new-user-id',
        role: 'App_user'
      })

      // Mock Directus clients
      jest.doMock('../directus-public', () => ({
        directusPublic: {
          with: jest.fn(() => ({
            createItem: mockCreateItem
          }))
        }
      }))

      jest.doMock('../directus', () => ({
        directus: {
          with: jest.fn(() => ({
            updateItem: mockUpdateItem
          }))
        }
      }))

      const result = await jwtAuth.registerUser(userData)
      
      expect(result).toBeDefined()
      expect(result.id).toBe('new-user-id')
      expect(result.email).toBe(userData.email)
      expect(result.role).toBe('App_user')
    })

    it('should throw error for missing required fields', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'password123'
        // Missing first_name and last_name
      }

      await expect(jwtAuth.registerUser(userData as any)).rejects.toThrow()
    })
  })

  describe('loginUser', () => {
    it('should login user with valid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      }

      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        first_name: 'Test',
        last_name: 'User',
        role: 'App_user',
        password: '$argon2id$v=19$m=65536,t=3,p=4$...' // Mock hashed password
      }

      // Mock user lookup
      const mockReadItems = jest.fn().mockResolvedValue([mockUser])
      
      jest.doMock('../directus-public', () => ({
        directusPublic: {
          with: jest.fn(() => ({
            readItems: mockReadItems
          }))
        }
      }))

      // Mock argon2 verification
      jest.doMock('argon2', () => ({
        verify: jest.fn().mockResolvedValue(true)
      }))

      const result = await jwtAuth.loginUser(credentials.email, credentials.password)
      
      expect(result).toBeDefined()
      expect(result.user.id).toBe(mockUser.id)
      expect(result.access_token).toBeDefined()
      expect(result.refresh_token).toBeDefined()
    })

    it('should throw error for invalid credentials', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      }

      const mockUser = {
        id: 'test-user-id',
        email: 'test@example.com',
        password: '$argon2id$v=19$m=65536,t=3,p=4$...'
      }

      const mockReadItems = jest.fn().mockResolvedValue([mockUser])
      
      jest.doMock('../directus-public', () => ({
        directusPublic: {
          with: jest.fn(() => ({
            readItems: mockReadItems
          }))
        }
      }))

      // Mock argon2 verification to return false
      jest.doMock('argon2', () => ({
        verify: jest.fn().mockResolvedValue(false)
      }))

      await expect(jwtAuth.loginUser(credentials.email, credentials.password))
        .rejects.toThrow('Neplatný email nebo heslo')
    })
  })
}) 