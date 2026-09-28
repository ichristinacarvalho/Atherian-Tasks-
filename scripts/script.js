//CONEXÃO E IMPORTAÇÃO - NÃO APAGAR
import { db } from "./firebase-config.js";
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

"use strict";

//-----------------------------------------------------------------------------------
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

//-----------------------------------------------------------------------------------
function listarMissoes() {

    let areaCards = document.getElementById("area-cards"); //capturando o mural e limpando

    onSnapshot(collection(db, "missoes"), (snapshot) => {
        console.log("O mural foi atualizado na nuvem!");

        areaCards.innerHTML = "";

        snapshot.forEach((doc) => {

            let missao = doc.data();

            //validando a missão
            let textoRiscado = missao.concluida ? "text-decoration-line-through text-muted" : "";
            let textoBotao = missao.concluida ? "Desmarcar" : "Concluir";
            let estiloBotao = missao.concluida ? "btn-outline-secondary" : "btn-outline-success";

            console.log(doc.id, "=>", doc.data());

            areaCards.innerHTML += `
    <div class="col-12 col-md-6 col-lg-4 mb-3">
        <div class="card p-3 shadow-sm h-100">
<h5 class="card-title ${textoRiscado}">${missao.titulo}</h5>
            <div class="mt-2">
                <span class="badge bg-secondary">${missao.categoria}</span>
                <span class="badge bg-primary">${missao.dificuldade}</span>
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

//-----------------------------------------------------------------------------------
function gerenciarConclusao() {
    let mural = document.getElementById("area-cards");

    mural.addEventListener("click", async function (evento) {
        console.log("Você clicou exatamente em:", evento.target);

        if (evento.target.classList.contains("btn-concluir")) {
            let id = evento.target.getAttribute("data-id");
            let statusAtual = (evento.target.getAttribute("data-status") === "true");
            let novoStatus = !statusAtual;

            try {
                let missaoRef = doc(db, "missoes", id);
                await updateDoc(missaoRef, {
                    concluida: novoStatus
                });
                console.log("Atualizado no Firebase com sucesso!");
            } catch (erro) {
                console.error("Erro ao atualizar no Firebase:", erro);
            }
        }
    });
}

//-----------------------------------------------------------------------------------
function gerenciarExclusao() {
    let mural = document.getElementById("area-cards");

    mural.addEventListener("click", async function (evento) {
        console.log("Você clicou exatamente em:", evento.target);

        if (evento.target.classList.contains("btn-excluir")) {
            let id = evento.target.getAttribute("data-id");

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

//chamando eventos
missoes();
listarMissoes();
gerenciarConclusao();
gerenciarExclusao();