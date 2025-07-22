// Fatores de consumo
const fatorConsumoPorTipo = {
    carro: 0.1,       // Litro por KM
    moto: 0.04,       // Litro por KM
    onibus: 0.6,      // Litro por KM
    aviao: 4          // Litro por KM
};

// Fatores de emissão
const fatoresEmissao = {
    gasolina: 2.28,           // kg CO2/litro
    etanol: 1.867,            // kg CO2/litro
    diesel: 3.2,              // kg CO2/litro
    gas_natural: 1.824,       // kg CO2/m³
    querosene_aviacao: 0.12,  // kg CO2/litro
    hibrido: 1.14             // Metade da gasolina
};

// Função para exibir ou ocultar o campo de passageiros
function exibirCampoPassageiros() {
    const tipoVeiculo = document.getElementById('tipoVeiculo').value;
    const campoPassageiros = document.getElementById('campoPassageiros');
    const inputPassageiros = document.getElementById('passageiros');
    const passageirosInfo = document.getElementById('passageirosInfo');
    const combustivelSelect = document.getElementById('combustivel');

    // Limpa os campos de entrada
    document.getElementById('distancia').value = ''; 
    // Limpa a distância
    inputPassageiros.value = ''; 
    // Limpa o número de passageiros
    document.getElementById('diasPorMes').value = ''; 
    // Limpa quantas vezes faz a viagem por mês

    // Se for carro ou moto, permitir edição do número de passageiros
    if (tipoVeiculo === 'carro' || tipoVeiculo === 'moto') {
        campoPassageiros.style.display = 'block';
        inputPassageiros.disabled = false; // Permite a edição
        passageirosInfo.style.display = 'none';
        combustivelSelect.disabled = false; // Habilita o combustível
    }
    // Se for ônibus, definir 40 passageiros e bloquear o campo
    else if (tipoVeiculo === 'onibus') {
        campoPassageiros.style.display = 'block';
        inputPassageiros.value = 40; // Valor fixo para ônibus
        inputPassageiros.disabled = true;
        passageirosInfo.style.display = 'block';
        passageirosInfo.innerText = "Número de passageiros fixado em 40, com base na capacidade média de assentos de um ônibus.";
        
        // Define automaticamente o combustível como diesel e bloqueia o campo
        combustivelSelect.value = 'diesel'; // Seleciona diesel
        combustivelSelect.disabled = true; // Bloqueia a alteração do combustível
    }
    // Se for avião, definir 180 passageiros, bloquear o campo e desabilitar o combustível
    else if (tipoVeiculo === 'aviao') {
        campoPassageiros.style.display = 'block';
        inputPassageiros.value = 180; // Valor fixo para avião
        inputPassageiros.disabled = true;
        passageirosInfo.style.display = 'block';
        passageirosInfo.innerText = "Número de passageiros fixado em 180, com base na capacidade média de assentos de um avião comercial.";
        
        // Define automaticamente o combustível como querosene de aviação e bloqueia o campo
        combustivelSelect.value = 'querosene_aviacao'; // Seleciona querosene de aviação
        combustivelSelect.disabled = true; // Bloqueia a alteração do combustível
    }
    // Se nenhuma opção válida for selecionada, esconder o campo
    else {
        campoPassageiros.style.display = 'none';
        combustivelSelect.disabled = false; // Habilita novamente o combustível se não for avião
    }

    // Atualiza as opções de combustível
    atualizarOpcoesCombustivel(tipoVeiculo);
}

// Função para atualizar as opções de combustível com base no tipo de veículo
function atualizarOpcoesCombustivel(tipoVeiculo) {
    const combustivelSelect = document.getElementById('combustivel');
    combustivelSelect.innerHTML = ''; // Limpa opções existentes

    if (tipoVeiculo === 'aviao') {
        // Adiciona apenas a opção de querosene de aviação
        const option = document.createElement('option');
        option.value = 'querosene_aviacao';
        option.text = 'Querosene de Aviação';
        combustivelSelect.appendChild(option);
        combustivelSelect.disabled = true; // Bloqueia a alteração do combustível
    } else if (tipoVeiculo === 'onibus') {
        // Adiciona apenas a opção de diesel
        const option = document.createElement('option');
        option.value = 'diesel';
        option.text = 'Diesel';
        combustivelSelect.appendChild(option);
        combustivelSelect.disabled = true; // Bloqueia a alteração do combustível
    } else {
        // Adiciona todas as opções de combustível disponíveis, exceto querosene de aviação
        const combustiveis = ['gasolina', 'etanol', 'diesel', 'gas_natural', 'hibrido'];
        combustiveis.forEach(combustivel => {
            const option = document.createElement('option');
            option.value = combustivel;
            option.text = combustivel.charAt(0).toUpperCase() + combustivel.slice(1).replace(/_/g, ' ');
            combustivelSelect.appendChild(option);
        });
        combustivelSelect.disabled = false; // Habilita a alteração do combustível
    }
}

// Função para calcular a pegada de carbono para um único meio de transporte
function calcularPegadaCarbonoTransporte(distanciaKm, tipoCombustivel, tipoVeiculo, passageiros) {
    const fatorEmissao = fatoresEmissao[tipoCombustivel];
    if (!fatorEmissao) {
        throw new Error(alert("Tipo de combustível desconhecido"));
    }

    if (distanciaKm <= 0) {
        swal("Distância", "A Distância (km) deve ser superior a zero", "error");  // Estilizar o campo de erro com "swal"
        return 0; // Retorna 0 para evitar cálculos incorretos
    }

    const fatorConsumo = fatorConsumoPorTipo[tipoVeiculo];
    if (!fatorConsumo) {
        throw new Error(alert("Tipo de veículo desconhecido"));
    }

    // Calcular o consumo total de combustível com base na distância e no fator de consumo
    const consumoTotalUnidades = distanciaKm * fatorConsumo;
    
    // Calcular a pegada de carbono
    const pegadaCarbono = consumoTotalUnidades * fatorEmissao / passageiros; // Ajusta a pegada de carbono pela quantidade de passageiros

    return pegadaCarbono;  // em kg CO2
}

// Função chamada pelo botão para calcular a pegada de carbono
function calcularPegada() {
    // Obtenha a distância, combustível e tipo de veículo do usuário
    const distanciaKm = parseFloat(document.getElementById('distancia').value) || 0;
    const tipoCombustivel = document.getElementById('combustivel').value;
    const tipoVeiculo = document.getElementById('tipoVeiculo').value;
    const diasPorMes = parseInt(document.getElementById('diasPorMes').value) || 0; // Número de dias ao mês

    // Validar seleção de veículo e combustível
    if (tipoVeiculo === "") {
        swal("Seleção obrigatória", "Você deve selecionar o tipo de veículo antes de calcular", "error");
        return;
    }

    // Validar o combustível se o veículo for ônibus ou avião
    if (tipoVeiculo === 'onibus' && tipoCombustivel !== 'diesel') {
        swal("Combustível inválido", "Para o tipo de veículo 'Ônibus', o combustível deve ser 'Diesel'", "error");
        return;
    } else if (tipoVeiculo === 'aviao' && tipoCombustivel !== 'querosene_aviacao') {
        swal("Combustível inválido", "Para o tipo de veículo 'Avião', o combustível deve ser 'Querosene de Aviação'", "error");
        return;
    } else if (tipoCombustivel === "") {
        swal("Seleção obrigatória", "Você deve selecionar o tipo de combustível antes de calcular", "error");
        return;
    }

    // Validar o número de dias por mês
    if (diasPorMes <= 0 || isNaN(diasPorMes)) {
        swal("Vezes ao mês", "O número de vezes por mês deve ser maior que zero", "error");
        return;
    }

    // Obter o número de passageiros, dependendo do tipo de veículo
    let passageiros = parseInt(document.getElementById('passageiros').value) || 0;

    // Validação específica para moto
    if (tipoVeiculo === 'moto' && (passageiros <= 0 || passageiros >= 3)) {
        swal("Passageiros", "Moto comporta entre 1 e 2 passageiros", "error");
        return;
    }

    // Validação específica para carro
    if (tipoVeiculo === 'carro' && (passageiros <= 0 || passageiros >= 6)) {
        swal("Passageiros", "Carro comporta entre 1 e 5 passageiros", "error");
        return;
    }

    // Para ônibus e avião, usa um valor fixo de passageiros
    if (tipoVeiculo === 'onibus') {
        passageiros = 40;  // Valor fixo para ônibus
    } else if (tipoVeiculo === 'aviao') {
        passageiros = 180;  // Valor fixo para avião
    }

    const pegadaPorViagem = calcularPegadaCarbonoTransporte(distanciaKm, tipoCombustivel, tipoVeiculo, passageiros);

    // Evitar campos vazios ou inválidos
    if (isNaN(pegadaPorViagem) || pegadaPorViagem <= 0) {
        document.getElementById('resultado').innerText = `Campo vazio ou inválido`;
    } else {
        const pegadaTotal = pegadaPorViagem * diasPorMes; // Multiplica pela quantidade de dias
        swal("Cálculo realizado!", document.getElementById('resultado').innerText = `${(pegadaTotal / 1000).toFixed(4)} toneladas de CO₂ ao mês por passageiro.`, "success");
    }
}
