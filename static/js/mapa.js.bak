// =====================================================
// mapa.js — Renderização e animação do mapa
// =====================================================

// Estado global do app
let cidadesGlobais = [];
let passosGlobais = [];
let passoAtual = 0;
let animando = false;
let timerAnimacao = null;


/**
 * Limpa todo o conteúdo do canvas.
 */
function limparCanvas() {
    const canvas = document.getElementById('mapa');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Desenha um fundo estilo mapa (ruas, quadras) no canvas.
 * Chamado antes de desenhar as cidades, pra dar sensação de mapa.
 */
function desenharFundoMapa() {
    const canvas = document.getElementById('mapa');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Fundo base escuro
    ctx.fillStyle = '#0a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Quadras (preenchimento sutil de "quarteirões")
    ctx.fillStyle = '#0f2440';
    for (let y = 0; y < canvas.height; y += 60) {
        for (let x = 0; x < canvas.width; x += 80) {
            if ((x + y) % 160 === 0) {
                ctx.fillRect(x + 2, y + 2, 76, 56);
            }
        }
    }

    // Ruas (linhas)
    ctx.strokeStyle = '#1a3a5c';
    ctx.lineWidth = 1;

    // Ruas horizontais
    for (let y = 0; y < canvas.height; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Ruas verticais
    for (let x = 0; x < canvas.width; x += 80) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
}

/**
 * Desenha uma seta entre dois pontos.
 */
function desenharSeta(ctx, x1, y1, x2, y2, cor = '#fbbf24') {
    const tamanhoCabeca = 10;
    const angulo = Math.atan2(y2 - y1, x2 - x1);

    // Linha
    ctx.beginPath();
    ctx.strokeStyle = cor;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    // Cabeça da seta
    ctx.beginPath();
    ctx.fillStyle = cor;
    ctx.moveTo(x2, y2);
    ctx.lineTo(
        x2 - tamanhoCabeca * Math.cos(angulo - Math.PI / 6),
        y2 - tamanhoCabeca * Math.sin(angulo - Math.PI / 6)
    );
    ctx.lineTo(
        x2 - tamanhoCabeca * Math.cos(angulo + Math.PI / 6),
        y2 - tamanhoCabeca * Math.sin(angulo + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
}


/**
 * Converte coordenadas (0-100) do mapa pra pixels do canvas.
 */
function paraPixel(cidade, canvas) {
    return {
        px: cidade.x * (canvas.width / 100),
        py: cidade.y * (canvas.height / 100),
    };
}


/**
 * Desenha as cidades no canvas.
 * @param {Array} cidades — lista de cidades
 * @param {Array} destacadasIds — IDs sendo comparados (amarelo)
 * @param {Array} concluidasIds — IDs já ordenados (verde)
 * @param {Array} setasComparacao — lista de [a_id, b_id] pra desenhar setas amarelas
 * @param {Array} ordemFinal — IDs na ordem final (pra desenhar setas verdes)
 */
function desenharCidades(cidades, destacadasIds = [], concluidasIds = [], setasComparacao = [], ordemFinal = []) {
    const canvas = document.getElementById('mapa');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    limparCanvas();
    desenharFundoMapa();

    const escalaX = canvas.width / 100;
    const escalaY = canvas.height / 100;

    // --- 1. Setas de comparação (amarelo) ---
    for (const [a_id, b_id] of setasComparacao) {
        const a = cidades.find(c => c.id === a_id);
        const b = cidades.find(c => c.id === b_id);
        if (a && b) {
            desenharSeta(ctx, a.x * escalaX, a.y * escalaY, b.x * escalaX, b.y * escalaY, '#fbbf24');
        }
    }

    // --- 2. Setas da ordem final (verde) ---
    if (ordemFinal.length > 1) {
        for (let i = 0; i < ordemFinal.length - 1; i++) {
            const a = cidades.find(c => c.id === ordemFinal[i]);
            const b = cidades.find(c => c.id === ordemFinal[i + 1]);
            if (a && b) {
                desenharSeta(ctx, a.x * escalaX, a.y * escalaY, b.x * escalaX, b.y * escalaY, '#34d399');
            }
        }
    }

    // --- 3. Cidades (círculos + nomes) ---
    for (const cidade of cidades) {
        const px = cidade.x * escalaX;
        const py = cidade.y * escalaY;
        const raio = 4 + (cidade.populacao / 100000) * 12;

        let corCirculo = '#00e5ff'; // ciano (destaca bem no fundo escuro)
        let corBorda = '#00b8d4';

        if (concluidasIds.includes(cidade.id)) {
            corCirculo = '#34d399';
            corBorda = '#10b981';
        } else if (destacadasIds.includes(cidade.id)) {
            corCirculo = '#fbbf24';
            corBorda = '#f59e0b';
        }
        
        ctx.beginPath();
        ctx.arc(px, py, raio, 0, Math.PI * 2);
        ctx.fillStyle = corCirculo;
        ctx.fill();
        ctx.strokeStyle = corBorda;
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#e8e8e8';
        ctx.font = '12px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText(cidade.nome, px, py - raio - 6);
    }
}


/**
 * Aplica um passo do Merge Sort no canvas.
 */
function aplicarPasso(passo) {
    if (!passo) return;

    if (passo.tipo === 'comparar') {
        // Destaca as duas cidades e desenha seta amarela entre elas
        desenharCidades(
            cidadesGlobais,
            [passo.a_id, passo.b_id],
            [],
            [[passo.a_id, passo.b_id]]
        );
    } else if (passo.tipo === 'merge') {
        // Destaca o resultado do merge (sem setas)
        desenharCidades(cidadesGlobais, passo.resultado_ids);
    }
}


/**
 * Executa o próximo passo da animação.
 */
function proximoPasso() {
    if (passoAtual >= passosGlobais.length) {
        // Fim: cidades em verde + setas verdes conectando em ordem de população
        const ordemFinal = cidadesGlobais
            .slice()
            .sort((a, b) => a.populacao - b.populacao)
            .map(c => c.id);
        desenharCidades(cidadesGlobais, [], cidadesGlobais.map(c => c.id), [], ordemFinal);
        return false;
    }

    const passo = passosGlobais[passoAtual];
    aplicarPasso(passo);
    passoAtual++;
    return true;
}


/**
 * Inicia a animação contínua (botão Play).
 */
function play() {
    if (animando) return;
    animando = true;

    const slider = document.getElementById('slider-velocidade');
    const velocidade = slider ? parseInt(slider.value) : 5;
    const intervalo = 1100 - (velocidade * 100);

    timerAnimacao = setInterval(() => {
        const continua = proximoPasso();
        if (!continua) {
            pause();
        }
    }, intervalo);
}


/**
 * Pausa a animação.
 */
function pause() {
    animando = false;
    if (timerAnimacao) {
        clearInterval(timerAnimacao);
        timerAnimacao = null;
    }
}


/**
 * Executa um único passo (botão Passo a passo).
 */
function passoAPasso() {
    pause();
    proximoPasso();
}


/**
 * Reinicia tudo: busca cidades novas e reseta o estado.
 */
async function reiniciar() {
    pause();
    passoAtual = 0;

    const dados = await buscarCidades(8);
    if (dados && dados.cidades) {
        cidadesGlobais = dados.cidades;
        passosGlobais = dados.passos;
        desenharCidades(cidadesGlobais);
        console.log(`Reiniciado: ${cidadesGlobais.length} cidades, ${passosGlobais.length} passos.`);
    }
}


/**
 * Inicializa o app.
 */
async function iniciar() {
    const dados = await buscarCidades(8);

    cidadesGlobais = dados.cidades;
    passosGlobais = dados.passos;
    passoAtual = 0;

    console.log(`Recebidas ${cidadesGlobais.length} cidades e ${passosGlobais.length} passos.`);

    desenharCidades(cidadesGlobais);
}


// Chama iniciar() quando a página carrega
window.addEventListener('DOMContentLoaded', iniciar);
