import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Configurar Firebase Admin SDK
const initializeFirebaseAdmin = () => {
  if (!admin.apps.length) {
    try {
      // Opción 1: Service Account Key como JSON string
      if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
          projectId: process.env.FIREBASE_PROJECT_ID
        });
        console.log('✅ Firebase Admin SDK inicializado con Service Account Key');
      }
      // Opción 2: Variables individuales
      else if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
        admin.initializeApp({
          credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
          }),
          projectId: process.env.FIREBASE_PROJECT_ID
        });
        console.log('✅ Firebase Admin SDK inicializado con variables individuales');
      }
      // Opción 3: Para entornos de Google Cloud (producción)
      else if (process.env.FIREBASE_PROJECT_ID) {
        admin.initializeApp({
          projectId: process.env.FIREBASE_PROJECT_ID
        });
        console.log('✅ Firebase Admin SDK inicializado con credenciales por defecto');
      }
      // Modo desarrollo sin Firebase Admin
      else {
        console.log('⚠️ Firebase Admin SDK no configurado - modo desarrollo');
        // Crear un mock básico para desarrollo
        return {
          auth: () => ({
            createUser: () => Promise.reject(new Error('Firebase Admin no configurado')),
            getUserByEmail: () => Promise.reject(new Error('Firebase Admin no configurado')),
            verifyIdToken: () => Promise.reject(new Error('Firebase Admin no configurado')),
            createCustomToken: () => Promise.reject(new Error('Firebase Admin no configurado'))
          }),
          app: () => ({ options: { projectId: 'development-mode' } })
        };
      }
    } catch (error) {
      console.error('❌ Error inicializando Firebase Admin SDK:', error.message);
      console.log('⚠️ Continuando en modo desarrollo sin Firebase Admin');
      
      // Retornar mock para desarrollo
      return {
        auth: () => ({
          createUser: () => Promise.reject(new Error('Firebase Admin no configurado')),
          getUserByEmail: () => Promise.reject(new Error('Firebase Admin no configurado')),
          verifyIdToken: () => Promise.reject(new Error('Firebase Admin no configurado')),
          createCustomToken: () => Promise.reject(new Error('Firebase Admin no configurado'))
        }),
        app: () => ({ options: { projectId: 'development-mode' } })
      };
    }
  }
  
  return admin;
};

const firebaseAdmin = initializeFirebaseAdmin();

export { firebaseAdmin };
export default firebaseAdmin;
