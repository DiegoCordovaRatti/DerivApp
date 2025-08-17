import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

// Configurar Firebase Admin SDK
const initializeFirebaseAdmin = () => {
  if (!admin.apps.length) {
    // Opción 1: Usar service account key (recomendado para desarrollo)
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID
      });
    } 
    // Opción 2: Usar variables de entorno individuales
    else if (process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        }),
        projectId: process.env.FIREBASE_PROJECT_ID
      });
    }
    // Opción 3: Para entornos de Google Cloud (producción)
    else {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID
      });
    }
    
    console.log('✅ Firebase Admin SDK inicializado');
  }
  
  return admin;
};

const firebaseAdmin = initializeFirebaseAdmin();

export { firebaseAdmin };
export default firebaseAdmin;
