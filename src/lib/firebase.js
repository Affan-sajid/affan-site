import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyCfhOjVLnsbpaxgz67axICHRCsUb5p_wys",
  authDomain: "affan-site.firebaseapp.com",
  projectId: "affan-site",
  storageBucket: "affan-site.firebasestorage.app",
  messagingSenderId: "354716823116",
  appId: "1:354716823116:web:6c7dd15004d486b672cee9",
  measurementId: "G-CKSY1TPHLP"
};


const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
const analytics = getAnalytics(app)

console.log('[firebase] initialized, projectId:', firebaseConfig.projectId)