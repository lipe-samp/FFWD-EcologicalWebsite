// Variável de controle para verificar se o cálculo das árvores foi feito
let calculoArvoresRealizado = false;

// Função para calcular o número de árvores necessárias
function calcularArvore() {
    // Busca o valor do resultado da calculadora de pegada de carbono
    const pegadaTotalTexto = document.getElementById('resultado').innerText;
    
    // Verifica se o valor está correto
    if (!pegadaTotalTexto || pegadaTotalTexto.trim() === "") {
        swal("Pulou uma etapa", "Por favor, faça o cálculo da pegada de carbono primeiro.", "error");
        return;
    }

    // Extrai a quantidade de toneladas de CO₂ do resultado
    const pegadaToneladas = parseFloat(pegadaTotalTexto.split(" ")[0]);

    // Verifica se o valor da pegada é válido
    if (isNaN(pegadaToneladas) || pegadaToneladas <= 0) {
        swal("Pulou uma etapa", "O cálculo da pegada de carbono está incorreto ou vazio.", "error");
        return;
    }

    // Converte a pegada de toneladas para kg (1 tonelada = 1000 kg)
    const pegadaKg = pegadaToneladas * 1000;

    // Calcula o número de árvores (1 tonelada de CO₂ = 7 árvores, ou seja, 7 árvores a cada 1000 kg)
    const arvoresNecessarias = (pegadaKg / 1000) * 7;

    // Arredondar para cima
    const arvoresNecessariasArredondado = Math.ceil(arvoresNecessarias);

    // Exibe a mensagem com o número de árvores no swal
    swal("Árvores Necessárias", `Precisaria plantar cerca de ${arvoresNecessariasArredondado} árvore(s) por passageiro.`, "success");

    // Exibe o resultado no elemento <h4 id="resultado-arvores">
    document.getElementById('resultado-arvores').innerText =
        `Com base na emissão de ${pegadaToneladas.toFixed(4)} toneladas de CO₂, para compensar seria necessário plantar cerca de ${arvoresNecessariasArredondado} árvore(s) por passageiro.`;

    document.getElementById('resultado-arvores-grande').innerText =
        `${arvoresNecessariasArredondado} árvore(s) por passageiro`;

    // Marcar que o cálculo das árvores foi realizado
    calculoArvoresRealizado = true; 
}


// Função para calcular os créditos de carbono
function calcularCredito() {
    // Verifica se o resultado da árvore foi calculado
    const resultadoArvores = document.getElementById('resultado-arvores').innerText;
    if (resultadoArvores === '') {
        swal("Pulou uma etapa", "Por favor, faça o cálculo das árvores primeiro.", "error");
        return; // Interrompe a execução da função
    }

    const pegadaCarbono = parseFloat(document.getElementById('resultado').innerText) * 1000; // Converte toneladas para kg
    const valorCreditoCarbono = 53.80; // Valor de cada crédito em R$

    let resultadoCredito = '';
    let quantidadeCreditos = 0;
    let custoTotal = 0;

    if (pegadaCarbono < 1000) {
        resultadoCredito = `Cada passageiro não emitiu o suficiente para comprar 1 crédito de carbono.`;
        document.getElementById('resultado-credito-grande').innerText = 'Abaixo de 1 tonelada por passageiro'; // Mensagem informativa
    } else {
        quantidadeCreditos = Math.floor(pegadaCarbono / 1000);
        custoTotal = quantidadeCreditos * valorCreditoCarbono;
        resultadoCredito = `Com base na emissão de ${(pegadaCarbono / 1000).toFixed(4)} toneladas de carbono, seriam necessários ${quantidadeCreditos} Crédito(s) de Carbono por passageiro.<br><br>
        Custo por passageiro R$ ${custoTotal.toFixed(2)}`;
        
        // Exibe o número de créditos e o custo no h2
        document.getElementById('resultado-credito-grande').innerText = `${quantidadeCreditos} Crédito(s) de Carbono por passageiro`;
    }

    // Exibe o resultado no h4
    document.getElementById('resultado-credito').innerHTML = resultadoCredito; // Alterado para innerHTML
    // Exibe a mensagem no swal
    swal("Créditos de Carbono", `${quantidadeCreditos} Crédito(s) de Carbono por passageiro.`, "success");
}