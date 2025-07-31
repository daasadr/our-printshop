import { NextRequest } from 'next/server'
import { POST } from '../login-directus/route'

// Mock JWT Auth
jest.mock('@/lib/jwt-auth', () => ({
  jwtAuth: {
    loginUser: jest.fn()
  }
}))

// Mock Next.js Response
const mockNextResponse = {
  json: jest.fn((data, options) => ({
    ...data,
    status: options?.status || 200
  }))
}

jest.mock('next/server', () => ({
  NextRequest: jest.fn(),
  NextResponse: mockNextResponse
}))

describe('/api/auth/login-directus', () => {
  let mockRequest: NextRequest

  beforeEach(() => {
    jest.clearAllMocks()
    mockRequest = new NextRequest('http://localhost:3000/api/auth/login-directus')
  })

  it('should login user successfully with valid credentials', async () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      role: 'App_user'
    }

    const mockTokens = {
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token'
    }

    // Mock successful login
    const { jwtAuth } = await import('@/lib/jwt-auth')
    jwtAuth.loginUser.mockResolvedValue({
      user: mockUser,
      access_token: mockTokens.access_token,
      refresh_token: mockTokens.refresh_token
    })

    // Mock request body
    Object.defineProperty(mockRequest, 'json', {
      value: jest.fn().mockResolvedValue({
        email: 'test@example.com',
        password: 'password123'
      })
    })

    const response = await POST(mockRequest)
    const responseData = await response.json()

    expect(jwtAuth.loginUser).toHaveBeenCalledWith('test@example.com', 'password123')
    expect(responseData.user).toEqual(mockUser)
    expect(responseData.access_token).toBe(mockTokens.access_token)
    expect(responseData.refresh_token).toBe(mockTokens.refresh_token)
  })

  it('should return error for missing email', async () => {
    Object.defineProperty(mockRequest, 'json', {
      value: jest.fn().mockResolvedValue({
        password: 'password123'
        // Missing email
      })
    })

    const response = await POST(mockRequest)
    const responseData = await response.json()

    expect(responseData.error).toBe('Email je povinný')
    expect(response.status).toBe(400)
  })

  it('should return error for missing password', async () => {
    Object.defineProperty(mockRequest, 'json', {
      value: jest.fn().mockResolvedValue({
        email: 'test@example.com'
        // Missing password
      })
    })

    const response = await POST(mockRequest)
    const responseData = await response.json()

    expect(responseData.error).toBe('Heslo je povinné')
    expect(response.status).toBe(400)
  })

  it('should return error for invalid credentials', async () => {
    const { jwtAuth } = await import('@/lib/jwt-auth')
    jwtAuth.loginUser.mockRejectedValue(new Error('Neplatný email nebo heslo'))

    Object.defineProperty(mockRequest, 'json', {
      value: jest.fn().mockResolvedValue({
        email: 'test@example.com',
        password: 'wrongpassword'
      })
    })

    const response = await POST(mockRequest)
    const responseData = await response.json()

    expect(responseData.error).toBe('Neplatný email nebo heslo')
    expect(response.status).toBe(401)
  })

  it('should handle server errors gracefully', async () => {
    const { jwtAuth } = await import('@/lib/jwt-auth')
    jwtAuth.loginUser.mockRejectedValue(new Error('Database connection failed'))

    Object.defineProperty(mockRequest, 'json', {
      value: jest.fn().mockResolvedValue({
        email: 'test@example.com',
        password: 'password123'
      })
    })

    const response = await POST(mockRequest)
    const responseData = await response.json()

    expect(responseData.error).toBe('Chyba při přihlašování')
    expect(response.status).toBe(500)
  })
}) 