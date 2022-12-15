const formulario = document.querySelector('[data-formulario="formulario"]');

const formNome = formulario.querySelector('[data-formulario="nome"]');
const formNomeLabel = formNome.parentElement;

const formQde = formulario.querySelector('[data-formulario="quantidade"]');
const formQdeLabel = formQde.parentElement;

const lista = document.querySelector('[data-lista="lista"]');

const mensagensPadrao = ["Nome", "Quantidade"];
const mensagensNome = ["Nome é obrigatório [X]", "Nome válido [V]", "Nome muito longo [X]"];
const mensagensQde = ["Quantidade é obrigatória [X]", "Quantidade válida [V]", "Quantidade muito longa [X]", "Quantidade muito grande [X]", "Quantidade só aceita números [X]"];

// Funções
    // Desativa botões baseado na posição
    function desativaBotoes(idSobe, idDesce) {
        let botaoSobe = document.querySelectorAll(idSobe);
        let botaoDesce = document.querySelectorAll(idDesce);

        // Desativa o primeiro botão que sobe
        botaoSobe.forEach((v, i, a) => {
            switch(true) {
                case i === 0:
                    v.setAttribute("disabled", "");
                    break;
                default:
                    v.removeAttribute("disabled");
            }
        });
        // Desativa o último botão que desce, reativa os outros
        botaoDesce.forEach((v, i, a) => {
            switch(true) {
                case i === (a.length - 1):
                    v.setAttribute("disabled", "");
                    break;
                default:
                    v.removeAttribute("disabled");
            }
        });
    }

    // Troca os valores entre dois indexes.
    function permutaIndex(array, indexA, indexB) {
        console.log(array);
        let valorTemporario = array[indexA];
        array[indexA] = array[indexB];
        array[indexB] = valorTemporario;
        console.log(array);
    }

    // Limpa todos os inputs e label de um form
    function limpaForm(form, msgArr) {
        let labels = formulario.querySelectorAll("[data-label]");
        formulario.reset();
        labels.forEach((v, i, a) => {
            // Muda o texto do label
            a[i].innerText = msgArr[i];
            // Remove as classes de sucesso e falha
            a[i].parentElement.classList.remove("js-sucesso");
            a[i].parentElement.classList.remove("js-falha");
        });
    }
    // Cria um elemento para a lista
    function criaElemento(nome, qde, index) {
        // Cria o elemento List Item e adiciona a classe Item
        let novoElemento = document.createElement("li");
        novoElemento.classList.add("item");
        novoElemento.dataset.id = index;
        // Cria um elemento strong com a quantidade de itens, e insere no List Item
        let novoQuantidade = document.createElement("strong");
        novoQuantidade.innerText = qde;
        novoQuantidade.dataset.item = "quantidade";
        novoElemento.appendChild(novoQuantidade);
        // Adiciona o nome do item
        let novoNome = document.createElement("span");
        novoNome.dataset.item = "nome";
        novoNome.innerText = nome;
        novoElemento.appendChild(novoNome);
        // Cria o botão de excluir
        let novoBotao = document.createElement("button");
        novoBotao.classList.add("item-deletar");
        novoBotao.innerText = "deletar";
        // Adiciona a funcionalidade de deletar no botão
        novoBotao.addEventListener("click", evento => {
            if(confirm("Deletar?")) {
                listaItens.deletaItem(index);
                evento.target.parentElement.remove();
            }
        });
        // Adiciona o botão
        novoElemento.appendChild(novoBotao);
        // Cria uma div com botões para subir e descer
        let divMover = document.createElement("div");
        divMover.classList.add("item-mover");
            //
            let sobeBotao = document.createElement("button");
            sobeBotao.innerText = "subir";
            sobeBotao.classList.add("item-subir");
            sobeBotao.dataset.botao = "subir";
            sobeBotao.addEventListener("click", event => {
                permutaIndex(listaItens._listaArray, index, index - 1);
                listaItens.atualizaStorage();
                atualizaListaFull();
            });
            //
            let desceBotao = document.createElement("button");
            desceBotao.innerText = "descer";
            desceBotao.classList.add("item-descer");
            desceBotao.dataset.botao = "descer";
            desceBotao.addEventListener("click", event => {
                permutaIndex(listaItens._listaArray, index, index + 1);
                listaItens.atualizaStorage();
                atualizaListaFull();
            });

        
        divMover.appendChild(sobeBotao);
        divMover.appendChild(desceBotao);
        novoElemento.appendChild(divMover);
        // Retorna o item, para ser inserido
        return novoElemento;
    }
    // Valida o nome passado pelo usuário
    function validaNome(string) {
        let resultado;
        switch(true) {
            case string.length === 0:
                resultado = 0;
                break;
            case string.length > 20:
                resultado = 2;
                break;
            default:
                resultado = 1;
        }
        return resultado;
    }
    // Valida a quantidade passada pelo usuário
    function validaQuantidade(integer) {
        let resultado;
        switch(true) {
            case integer.length === 0:
                resultado = 0;
                break;
            case integer.length > 7:
                resultado = 2;
                break;
            case integer > 9999.99:
                resultado = 3;
                break;
            case isNaN(parseInt(integer)):
                resultado = 4;
                break;
            default:
                resultado = 1;
        }
        return resultado;
    }
    // Representa visualmente se os dados estão corretos ou não
    function verValidacao(labelNome, resultadoNome, labelQuantidade, resultadoQuantidade) {
        // Mostra visualmente a validação do nome do item
        labelNome.querySelector("span").innerText = mensagensNome[resultadoNome];
        switch(true) {
            case resultadoNome === 0:
                labelNome.classList.remove("js-sucesso");
                labelNome.classList.add("js-falha");
                break;
            case resultadoNome === 1:
                labelNome.classList.add("js-sucesso");
                labelNome.classList.remove("js-falha");
                break;
            default:
                labelNome.classList.add("js-falha");
                labelNome.classList.remove("js-sucesso");
        }
        // Mostra visualmente a validação da quantidade de itens
        labelQuantidade.querySelector("span").innerText = mensagensQde[resultadoQuantidade];
        switch(true) {
            case resultadoQuantidade === 0:
                labelQuantidade.classList.remove("js-sucesso");
                labelQuantidade.classList.add("js-falha");
                break;
            case resultadoQuantidade === 1:
                labelQuantidade.classList.add("js-sucesso");
                labelQuantidade.classList.remove("js-falha");
                break;
            default:
                labelQuantidade.classList.add("js-falha");
                labelQuantidade.classList.remove("js-sucesso");
        }
    }

// Classes
    // Lista de itens
    class Lista {
        constructor() {
            this._listaArray = [];
        }

        adicionaItem(item) {
            this._listaArray.push(item);
            this.atualizaStorage();
        }

        atualizaItem(nome, qde, index) {
            if(nome !== null) {
                this._listaArray[index]._nome = nome;
            }
            if(qde !== null) {
                this._listaArray[index]._quantidade = qde;
            }
            this.atualizaStorage();
        }

        deletaItem(index) {
            this._listaArray.splice(index, 1);
            this.atualizaStorage();
        }

        atualizaStorage() {
            localStorage.setItem("lista", JSON.stringify(this._listaArray));
        }
    }

    // Item individual
    class ListaItem {
        constructor(nome, quantidade) {
            this._nome = nome;
            this._quantidade = quantidade;
        }
    }
    // Cria a array de lista de itens
    let listaItens = new Lista();
    // Recria a lista completamente quando chamada
    function atualizaListaFull() {
        listaItens = new Lista();
        document.querySelectorAll('[data-lista="lista"]>[data-id]').forEach((e, i, a) => {
            a[i].remove();
        });
        let tempLista = JSON.parse(localStorage.getItem("lista"));
        for(let i = 0; i < tempLista.length; i++) {
            listaItens.adicionaItem(new ListaItem(tempLista[i]._nome, tempLista[i]._quantidade));
            lista.appendChild(criaElemento(listaItens._listaArray[i]._nome, listaItens._listaArray[i]._quantidade, listaItens._listaArray.length - 1));
        }
        desativaBotoes('[data-botao="subir"]', '[data-botao="descer"]');
    }

    // Se já existe dados no localStorage, recrie a lista anterior.
    if(localStorage.getItem("lista") !== null) {
        atualizaListaFull();
    }

// Execução instantânea



// Event listeners
    // Evento ao enviar formulário
    formulario.addEventListener("submit", event => {
        event.preventDefault();

        const nome = event.target.elements['nome'].value;
        const nomeResultado = validaNome(nome);
        const qde = event.target.elements['quantidade'].value;
        const qdeResultado = validaQuantidade(qde);

        // Checa se o item já existe
        const existe = (() => {
            let resultado = {
                index: -1,
                value: false
            }
            for(let i = 0; i < listaItens._listaArray.length && resultado.value === false; i++) {
                if(nome.toLocaleLowerCase() === listaItens._listaArray[i]._nome.toLocaleLowerCase()) {
                    resultado.index = i;
                    resultado.value = true;
                }
            }
            return resultado;
        })();

        if(nomeResultado === 1 && qdeResultado === 1) {
            if(existe.value) {
                lista.querySelector(`[data-id="${existe.index}"]>[data-item="quantidade"]`).innerText = qde;
                listaItens.atualizaItem(null, qde, existe.index);
                limpaForm(formulario, mensagensPadrao);
            } else {
                listaItens.adicionaItem(new ListaItem(nome, qde));
                lista.appendChild(criaElemento(nome, qde, listaItens._listaArray.length - 1));
                limpaForm(formulario, mensagensPadrao);
            }
        } else {
            // Se incorreto, update nos labels com mensagem de erro
            verValidacao(formNomeLabel, nomeResultado, formQdeLabel, qdeResultado);
        }
    });