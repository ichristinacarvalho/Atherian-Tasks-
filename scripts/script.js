//CONEXÃO - NÃO APAGAR
import { db } from "./firebase-config.js";
import { collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

"use strict";

function missoes() {
    let form = document.getElementById("forja");

    form.addEventListener("submit", async function (evento) {
        evento.preventDefault();

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
                criadaEm: new Date()
            });
            console.log("Missão salva na nuvem! ID:", docRef.id);
            form.reset();
        } catch (erro) {
            console.error("Erro ao enviar para o Firebase!")
        }
    });
}

function listarMissoes() {

    let areaCards = document.getElementById("area-cards"); //capturando o mural e limpando

    onSnapshot(collection(db, "missoes"), (snapshot) => {
        console.log("O mural foi atualizado na nuvem!");

        areaCards.innerHTML = "";

        snapshot.forEach((doc) => {

            let missao = doc.data();

            console.log(doc.id, "=>", doc.data());

            areaCards.innerHTML += `
    <div class="col-12 col-md-6 col-lg-4 mb-3">
        <div class="card p-3 shadow-sm h-100">
            <h5 class="card-title">${missao.titulo}</h5>
            <div class="mt-2">
                <span class="badge bg-secondary">${missao.categoria}</span>
                <span class="badge bg-primary">${missao.dificuldade}</span>
            </div>
        </div>
    </div>`;
        });
    });
}

//chamando eventos
missoes();
listarMissoes();
