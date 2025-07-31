import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import LoginForm from '../auth/LoginForm'

// Mock Next.js router
const mockPush = jest.fn()
const mockRefresh = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh
  })
}))

// Mock fetch
global.fetch = jest.fn()

const mockDict = {
  title: 'Přihlášení',
  subtitle: 'Přihlaste se ke svému účtu',
  email: 'E-mail',
  password: 'Heslo',
  loginButton: 'Přihlásit',
  forgotPassword: 'Zapomněli jste heslo?',
  registerLink: 'Nemáte účet? Registrujte se',
  errors: {
    required: 'Toto pole je povinné',
    invalidCredentials: 'Neplatný e-mail nebo heslo',
    general: 'Nastala chyba při přihlašování'
  }
}

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('renders login form correctly', () => {
    render(<LoginForm dict={mockDict} />)
    
    expect(screen.getByText('Přihlášení')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Heslo')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Přihlásit' })).toBeInTheDocument()
  })

  it('shows validation error for empty form submission', async () => {
    render(<LoginForm dict={mockDict} />)
    
    const submitButton = screen.getByRole('button', { name: 'Přihlásit' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Toto pole je povinné')).toBeInTheDocument()
    })
  })

  it('handles successful login', async () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User',
      role: 'App_user'
    }

    const mockResponse = {
      user: mockUser,
      access_token: 'mock-access-token',
      refresh_token: 'mock-refresh-token'
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    })

    render(<LoginForm dict={mockDict} />)
    
    // Fill form
    fireEvent.change(screen.getByLabelText('E-mail'), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText('Heslo'), {
      target: { value: 'password123' }
    })
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: 'Přihlásit' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/login-directus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      })
    })

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('access_token', 'mock-access-token')
      expect(localStorage.setItem).toHaveBeenCalledWith('refresh_token', 'mock-refresh-token')
      expect(localStorage.setItem).toHaveBeenCalledWith('user_data', JSON.stringify(mockUser))
    })

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/cs/ucet')
      expect(mockRefresh).toHaveBeenCalled()
    })
  })

  it('handles login error', async () => {
    const mockError = {
      error: 'Neplatný e-mail nebo heslo'
    }

    ;(fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => mockError
    })

    render(<LoginForm dict={mockDict} />)
    
    // Fill form
    fireEvent.change(screen.getByLabelText('E-mail'), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText('Heslo'), {
      target: { value: 'wrongpassword' }
    })
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: 'Přihlásit' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Neplatný e-mail nebo heslo')).toBeInTheDocument()
    })
  })

  it('handles network error', async () => {
    ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

    render(<LoginForm dict={mockDict} />)
    
    // Fill form
    fireEvent.change(screen.getByLabelText('E-mail'), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText('Heslo'), {
      target: { value: 'password123' }
    })
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: 'Přihlásit' })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText('Nastala chyba při přihlašování')).toBeInTheDocument()
    })
  })

  it('shows loading state during form submission', async () => {
    ;(fetch as jest.Mock).mockImplementationOnce(() => 
      new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ user: {}, access_token: 'token', refresh_token: 'refresh' })
      }), 100))
    )

    render(<LoginForm dict={mockDict} />)
    
    // Fill form
    fireEvent.change(screen.getByLabelText('E-mail'), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText('Heslo'), {
      target: { value: 'password123' }
    })
    
    // Submit form
    const submitButton = screen.getByRole('button', { name: 'Přihlásit' })
    fireEvent.click(submitButton)
    
    // Check loading state
    expect(screen.getByText('Přihlašuji...')).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
  })
}) 