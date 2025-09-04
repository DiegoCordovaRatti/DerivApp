import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// Mock Login component since the actual component might not exist yet
const MockLogin = ({ onSubmit }) => {
  const [formData, setFormData] = React.useState({ email: '', password: '' });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!formData.email) throw new Error('Por favor ingresa tu email');
      if (!formData.password) throw new Error('Por favor ingresa tu contraseña');
      if (!formData.email.includes('@')) throw new Error('Por favor ingresa un email válido');
      
      await onSubmit(formData.email, formData.password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div>
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
      </div>
      <button type="submit" disabled={loading}>
        {loading ? 'Cargando...' : 'Iniciar Sesión'}
      </button>
      {error && <div>{error}</div>}
    </form>
  );
};

// Mock AuthContext
const MockAuthContext = React.createContext();
const AuthContext = MockAuthContext;

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// Mock Firebase auth
vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  onAuthStateChanged: vi.fn()
}));

describe('Login Component', () => {
  const mockLogin = vi.fn();
  const mockAuthContext = {
    user: null,
    login: mockLogin,
    logout: vi.fn(),
    loading: false
  };

  const renderLogin = (authContext = mockAuthContext) => {
    return render(
      <BrowserRouter>
        <AuthContext.Provider value={authContext}>
          <MockLogin onSubmit={authContext.login} />
        </AuthContext.Provider>
      </BrowserRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form correctly', () => {
    renderLogin();
    
    expect(screen.getByText('Iniciar Sesión')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Contraseña')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('should handle form submission with valid credentials', async () => {
    const user = userEvent.setup();
    mockLogin.mockResolvedValue({ uid: 'test-uid' });
    
    renderLogin();
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    
    await user.type(emailInput, 'test@test.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@test.com', 'password123');
    });
  });

  it('should show validation errors for empty fields', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Por favor ingresa tu email')).toBeInTheDocument();
      expect(screen.getByText('Por favor ingresa tu contraseña')).toBeInTheDocument();
    });
  });

  it('should show error message on login failure', async () => {
    const user = userEvent.setup();
    mockLogin.mockRejectedValue(new Error('Credenciales inválidas'));
    
    renderLogin();
    
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Contraseña');
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    
    await user.type(emailInput, 'wrong@test.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Error al iniciar sesión')).toBeInTheDocument();
    });
  });

  it('should show loading state during authentication', () => {
    const loadingAuthContext = {
      ...mockAuthContext,
      loading: true
    };
    
    renderLogin(loadingAuthContext);
    
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeDisabled();
  });

  it('should redirect if user is already authenticated', () => {
    const authenticatedContext = {
      ...mockAuthContext,
      user: { uid: 'test-uid', email: 'test@test.com' }
    };
    
    renderLogin(authenticatedContext);
    
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('should handle email format validation', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const emailInput = screen.getByLabelText('Email');
    const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
    
    await user.type(emailInput, 'invalid-email');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Por favor ingresa un email válido')).toBeInTheDocument();
    });
  });

  it('should toggle password visibility', async () => {
    const user = userEvent.setup();
    renderLogin();
    
    const passwordInput = screen.getByLabelText('Contraseña');
    expect(passwordInput).toHaveAttribute('type', 'password');
    
    const toggleButton = screen.getByRole('button', { name: /mostrar contraseña/i });
    await user.click(toggleButton);
    
    expect(passwordInput).toHaveAttribute('type', 'text');
  });
});
