import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock Firebase
const mockFirebase = {
  initializeApp: vi.fn(),
  getAuth: vi.fn(() => ({
    onAuthStateChanged: vi.fn(),
    signInWithEmailAndPassword: vi.fn(),
    signOut: vi.fn(),
    currentUser: null
  })),
  getFirestore: vi.fn(() => ({
    collection: vi.fn(),
    doc: vi.fn(),
    getDoc: vi.fn(),
    getDocs: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    deleteDoc: vi.fn()
  }))
};

vi.mock('firebase/app', () => mockFirebase);
vi.mock('firebase/auth', () => mockFirebase);
vi.mock('firebase/firestore', () => mockFirebase);

// Mock Ant Design components that might cause issues in tests
vi.mock('antd', async () => {
  const actual = await vi.importActual('antd');
  return {
    ...actual,
    message: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn()
    },
    notification: {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn(),
      info: vi.fn()
    }
  };
});

// Global test setup
global.mockFirebase = mockFirebase;

