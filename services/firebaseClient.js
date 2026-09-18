// Configuração central do Firebase para o app (site e mobile).
// Estes valores são PÚBLICOS por natureza — o Firebase foi desenhado para
// que este arquivo possa aparecer no código do app sem problema. Quem
// protege os dados de verdade são as REGRAS (firestore.rules e
// storage.rules), não o segredo deste arquivo.
//
// Preencha com os valores que aparecem em:
// Console Firebase > Configurações do projeto > Geral > Seus apps > (Web)
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const storage = getStorage(firebaseApp);
