//CONEXÃO E IMPORTAÇÃO - NÃO APAGAR
//base dedados e serviço de autenticação
import { db, auth } from "./firebase-config.js";

//métodos firestore
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query, where } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

//firebase authentication
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";

//Armazenar o cancelamento do ouvinte em tempo real do Firestore
let desinscreverMural = null;

//cartela de cores categoria
const coresCategoria = {
    "mago": "bg-info text-dark",      // Azul arcano / ciano
    "guerreiro": "bg-danger text-light",          // Vermelho sangue/combate
    "ladino": "bg-dark text-light",    // Sombra / furtividade
    "clerigo": "bg-warning text-dark"  // Dourado / luz sagrada
};

//cartela de cores dificuldade
const coresDificuldade = {
    "comum": "bg-secondary text-light",      // Cinza neutro
    "raro": "bg-primary text-light",          // Azul vibrante
    "lendario": "bg-warning text-dark fw-bold" // Dourado
};

//--- Criação das missões
function missoes() {
    let form = document.getElementById("forja");

    form.addEventListener("submit", async function (evento) {
        evento.preventDefault();

        //trava de segurança
        if (!auth.currentUser) {
            alert("Necessário autenticação para forjar uma missão!")
            return;
        }

        //pegando os valores dos inputs
        let nome = document.getElementById("missao").value;
        let dificuldade = document.getElementById("dificuldade").value;
        let categoria = document.getElementById("categoria").value;

        try {
            let docRef = await addDoc(collection(db, 'missoes'), {
                titulo: nome,
                dificuldade: dificuldade,
                categoria: categoria,
                concluida: false,
                criadaEm: new Date(),
                usuarioId: auth.currentUser.uid
            });

            console.log("Missão salva na nuvem! ID:", docRef.id);
            form.reset();

        } catch (erro) {
            console.error("Erro ao gravar a missão no Firestore!", erro);
            alert("Não foi possível salvar a missão. Tente novamente.");
        }
    });
}

//--- Listando as missões para o usuário
function listarMissoes(usuarioId) {

    let areaCards = document.getElementById("area-cards"); //capturando o mural e limpando

    let consulta = query(collection(db, "missoes"), where("usuarioId", "==", usuarioId));

    // Desativa escuta anterior se ela existir para evitar dados duplicados
    if (desinscreverMural) {
        desinscreverMural();
    }

    desinscreverMural = onSnapshot(consulta, (snapshot) => {
        console.log("O mural foi atualizado na nuvem!");
        areaCards.innerHTML = "";

        snapshot.forEach((doc) => {
            let missao = doc.data();

            //identifica as cores correspondentes
            let corCategoria = coresCategoria[missao.categoria?.toLowerCase()] || "bg-secondary";
            let dificuldadeFormatada = missao.dificuldade ? missao.dificuldade.toLowerCase() : "";
            let corDificuldade = coresDificuldade[dificuldadeFormatada] || "bg-secondary";

            //estilos visuais de validação da missão
            let textoRiscado = missao.concluida ? "text-decoration-line-through text-muted" : "";
            let textoBotao = missao.concluida ? "Desmarcar" : "Concluir";
            let estiloBotao = missao.concluida ? "btn-outline-secondary" : "btn-outline-success";

            //monta os cards na tela
            areaCards.innerHTML += `
    <div class="col-12 col-md-6 col-lg-4 mb-3">
        <div class="card p-3 shadow-sm h-100">
<h5 class="card-title ${textoRiscado}">${missao.titulo}</h5>
            <div class="mt-2">
                <span class="badge ${corCategoria}">${missao.categoria}</span>
                <span class="badge ${corDificuldade}">${missao.dificuldade}</span>
            </div>
            <div class="d-flex gap-2 mt-3">
<button class="btn-concluir btn btn-sm ${estiloBotao}" data-id="${doc.id}" data-status="${missao.concluida}">${textoBotao}</button>        
<button class="btn-excluir btn btn-sm btn-outline-danger" data-id="${doc.id}">Excluir</button>
</div>
</div>
    </div>`;
        });
    });
}

//--- gerenciamento da area-cards
function gerenciarAcoesMural() {
    let mural = document.getElementById("area-cards");

    mural.addEventListener("click", async function (evento) {

        let elementoClicado = evento.target;
        let id = elementoClicado.getAttribute("data-id")

        //concluir
        if (elementoClicado.classList.contains("btn-concluir")) {
            let statusAtual = (elementoClicado.getAttribute("data-status") === "true");
            let novoStatus = !statusAtual;

            try {
                let missaoRef = doc(db, "missoes", id);
                await updateDoc(missaoRef, {
                    concluida: novoStatus
                });
                console.log("Status atualizado no Firebase com sucesso!");
            } catch (erro) {
                console.error("Erro ao atualizar no Firebase:", erro);
            }
        }

        // excluir
        if (elementoClicado.classList.contains("btn-excluir")) {
            try {
                let missaoRef = doc(db, "missoes", id);
                await deleteDoc(missaoRef);
                console.log("Missão eliminada com sucesso! ID:", id);
            } catch (erro) {
                console.error("Erro ao eliminar a missão:", erro);
            }
        }
    });
}

//--- gerenciando a autenticação de usuário
function gerenciarAutenticacao() {
    let login = document.getElementById("btn-login");
    let btnLogout = document.getElementById("btn-logout");
    let infoUsuario = document.getElementById("info-usuario");
    let provedorGoogle = new GoogleAuthProvider();

    //clique para abrir o pop-up
    login.addEventListener("click", async function () {
        try {
            await signInWithPopup(auth, provedorGoogle);
            console.log("Login realizado com sucesso!");
        } catch (erro) {
            console.error("Erro ao fazer login:", erro);
        }
    });

    //Ação de Sair
    btnLogout.addEventListener("click", async function () {
        try {
            await signOut(auth);
            console.log("Sessão encerrada com sucesso!");
        } catch (erro) {
            console.error("Erro ao encerrar sessão:", erro);
        }
    });

    //atualiza a interface automaticamente
    onAuthStateChanged(auth, (usuario) => {
        if (usuario) {
            // Coloca a foto redondinha e o nome na barra superior
            infoUsuario.innerHTML = `
                <img src="${usuario.photoURL}" alt="${usuario.displayName}" class="rounded-circle" width="30" height="30" style="border: 2px solid var(--destaque-ciano);">
                <span class="small fw-semibold text-light">${usuario.displayName}</span>
            `;

            listarMissoes(usuario.uid);

            // Esconde o botão "Entrar" e mostra o botão "Sair"
            login.classList.add("d-none");
            btnLogout.classList.remove("d-none");

        } else {
            // Se NÃO tem ninguém logado (ou se deslogou):
            infoUsuario.innerHTML = `<span class="text-secondary small">Sessão não iniciada</span>`;
            document.getElementById("area-cards").innerHTML = "";

            // Desliga a escuta se houver alguma rodando
            if (desinscreverMural) {
                desinscreverMural();
            }
            // Mostra o botão "Entrar" e esconde o botão "Sair"
            login.classList.remove("d-none");
            btnLogout.classList.add("d-none");
        }
    });
}

//chamando eventos
missoes();
gerenciarAcoesMural();
gerenciarAutenticacao();