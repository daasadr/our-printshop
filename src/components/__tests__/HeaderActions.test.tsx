import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { HeaderActions } from '../main-header/HeaderActions'

// Mock Next.js router
const mockPush = jest.fn()
const mockRefresh = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh
  }),
  useParams: () => ({ lang: 'cs' })
}))

// Mock useLocale
jest.mock('@/context/LocaleContext', () => ({
  useLocale: () => ({ locale: 'cs' })
}))

// Mock useCart
jest.mock('@/hooks/useCart', () => ({
  useCart: () => ({ items: [] })
}))

// Mock useWishlist
jest.mock('@/context/WishlistContext', () => ({
  useWishlist: () => ({ totalItems: 0 })
}))

// Mock LocaleSwitch
jest.mock('@/components/LocaleSwitch', () => {
  return function MockLocaleSwitch() {
    return <div data-testid="locale-switch">Locale Switch</div>
  }
})

// Mock DarkModeToggle
jest.mock('@/components/ui/DarkModeToggle', () => ({
  HeaderDarkModeToggle: () => <div data-testid="dark-mode-toggle">Dark Mode Toggle</div>
}))

describe('HeaderActions', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('should show user name when user is logged in', () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User'
    }

    localStorage.setItem('user_data', JSON.stringify(mockUser))

    render(<HeaderActions isMenuOpen={false} setIsMenuOpen={jest.fn()} />)
    
    expect(screen.getByText('Test')).toBeInTheDocument()
  })

  it('should show only user icon when user is not logged in', () => {
    render(<HeaderActions isMenuOpen={false} setIsMenuOpen={jest.fn()} />)
    
    // User icon should be present (link without specific name)
    expect(screen.getByRole('link', { name: '' })).toBeInTheDocument()
    
    // But no user name should be shown
    expect(screen.queryByText('Test')).not.toBeInTheDocument()
  })

  it('should update user state when auth-status-changed event is fired', async () => {
    render(<HeaderActions isMenuOpen={false} setIsMenuOpen={jest.fn()} />)
    
    // Initially no user
    expect(screen.queryByText('Test')).not.toBeInTheDocument()
    
    // Simulate user login
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User'
    }
    
    localStorage.setItem('user_data', JSON.stringify(mockUser))
    
    // Fire auth status changed event
    window.dispatchEvent(new Event('auth-status-changed'))
    
    await waitFor(() => {
      expect(screen.getByText('Test')).toBeInTheDocument()
    })
  })

  it('should clear user state when user logs out', async () => {
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User'
    }

    localStorage.setItem('user_data', JSON.stringify(mockUser))

    render(<HeaderActions isMenuOpen={false} setIsMenuOpen={jest.fn()} />)
    
    // Initially user is shown
    expect(screen.getByText('Test')).toBeInTheDocument()
    
    // Simulate logout
    localStorage.removeItem('user_data')
    
    // Fire auth status changed event
    window.dispatchEvent(new Event('auth-status-changed'))
    
    await waitFor(() => {
      expect(screen.queryByText('Test')).not.toBeInTheDocument()
    })
  })

  it('should handle storage events from other tabs', async () => {
    render(<HeaderActions isMenuOpen={false} setIsMenuOpen={jest.fn()} />)
    
    // Initially no user
    expect(screen.queryByText('Test')).not.toBeInTheDocument()
    
    // Simulate storage event from another tab
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      first_name: 'Test',
      last_name: 'User'
    }
    
    const storageEvent = new StorageEvent('storage', {
      key: 'user_data',
      newValue: JSON.stringify(mockUser),
      oldValue: null,
      url: 'http://localhost:3000'
    })
    
    window.dispatchEvent(storageEvent)
    
    await waitFor(() => {
      expect(screen.getByText('Test')).toBeInTheDocument()
    })
  })
}) 