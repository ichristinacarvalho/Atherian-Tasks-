//Inicialização do Firebase App
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";

//Serviços
import { getFirestore} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

//Configuração do projeto Atherian Tasks
const firebaseConfig = {
    apiKey: "AIzaSyAv4AzEZsfN-JJ6t6GNmWw0znoXSb_mFAQ",
    authDomain: "atheriantasks.firebaseapp.com",
    projectId: "atheriantasks",
    storageBucket: "atheriantasks.firebasestorage.app",
    messagingSenderId: "894785172692",
    appId: "1:894785172692:web:c6ffb1df4c1f4c04cd3741"
};

//inicializando o Firebase
const app = initializeApp(firebaseConfig);

//Exportação dos serviços
export const db = getFirestore(app);
export const auth = getAuth(app);