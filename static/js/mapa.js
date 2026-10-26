// =====================================================
// mapa.js — Renderização e animação do mapa
// =====================================================

// Estado global do app
let cidadesGlobais = [];
let passosGlobais = [];
let passoAtual = 0;
let animando = false;
let timerAnimacao = null;

// Estado da animação (posições atuais e alvos)
let posicoesAtuais = {}; // { id_cidade: { x, y } }
let posicoesAlvo = {};   // { id_cidade: { x, y } }
let raioAtual = {};      // { id_cidade: número }
let raioAlvo = {};       // { id_cidade: número }
let corCirculoAtual = {}; // { id_cidade: string }
let corCirculoAlvo = {};  // { id_cidade: string }
let corBordaAtual = {};
let corBordaAlvo = {};

let setasAtivas = []; // [{ a_id, b_id, progresso }]
let ordemFinalAtiva = [];


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
 * Desenha o fundo estilo mapa (ruas e quadras).
 */
function desenharFundoMapa() {
    const canvas = document.getElementById('mapa');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#0f2440';
    for (let y = 0; y < canvas.height; y += 60) {
        for (let x = 0; x < canvas.width; x += 80) {
            if ((x + y) % 160 === 0) {
                ctx.fillRect(x + 2, y + 2, 76, 56);
            }
        }
    }

    ctx.strokeStyle = '#1a3a5c';
    ctx.lineWidth = 1;

    for (let y = 0; y < canvas.height; y += 60) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
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
function desenharSeta(ctx, x1, y1, x2, y2, cor, progresso = 1) {
    // Interpola o ponto final da seta (para animar o crescimento)
    const xf = x1 + (x2 - x1) * progresso;
    const yf = y1 + (y2 - y1) * progresso;

    const tamanhoCabeca = 10;
    const angulo = Math.atan2(yf - y1, xf - x1);

    ctx.beginPath();
    ctx.strokeStyle = cor;
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.moveTo(x1, y1);
    ctx.lineTo(xf, yf);
    ctx.stroke();

    // Cabeça da seta
    ctx.beginPath();
    ctx.fillStyle = cor;
    ctx.moveTo(xf, yf);
    ctx.lineTo(
        xf - tamanhoCabeca * Math.cos(angulo - Math.PI / 6),
        yf - tamanhoCabeca * Math.sin(angulo - Math.PI / 6)
    );
    ctx.lineTo(
        xf - tamanhoCabeca * Math.cos(angulo + Math.PI / 6),
        yf - tamanhoCabeca * Math.sin(angulo + Math.PI / 6)
    );
    ctx.closePath();
    ctx.fill();
}


/**
 * Loop de animação contínuo (60fps) — interpola valores.
 */
function loopAnimacao() {
    const canvas = document.getElementById('mapa');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    limparCanvas();
    desenharFundoMapa();

    const escalaX = canvas.width / 100;
    const escalaY = canvas.height / 100;

    // 1. Atualiza as posições/cores atuais em direção aos alvos (lerp)
    for (const cidade of cidadesGlobais) {
        const id = cidade.id;

        if (!posicoesAtuais[id]) {
            posicoesAtuais[id] = { x: cidade.x * escalaX, y: cidade.y * escalaY };
            posicoesAlvo[id] = { x: cidade.x * escalaX, y: cidade.y * escalaY };
            raioAtual[id] = 4 + (cidade.populacao / 100000) * 12;
            raioAlvo[id] = raioAtual[id];
            corCirculoAtual[id] = '#00e5ff';
            corCirculoAlvo[id] = '#00e5ff';
            corBordaAtual[id] = '#00b8d4';
            corBordaAlvo[id] = '#00b8d4';
        }

        // Interpola posição
        posicoesAtuais[id].x += (posicoesAlvo[id].x - posicoesAtuais[id].x) * 0.15;
        posicoesAtuais[id].y += (posicoesAlvo[id].y - posicoesAtuais[id].y) * 0.15;

        // Interpola raio
        raioAtual[id] += (raioAlvo[id] - raioAtual[id]) * 0.15;

        // Interpola cor
        corCirculoAtual[id] = corCirculoAlvo[id]; // cor é instantânea (troca de estado)
        corBordaAtual[id] = corBordaAlvo[id];
    }

    // 2. Desenha setas ativas (amarelas) crescendo
    for (const seta of setasAtivas) {
        if (seta.progresso < 1) {
            seta.progresso = Math.min(1, seta.progresso + 0.08);
        }
        const a = cidadesGlobais.find(c => c.id === seta.a_id);
        const b = cidadesGlobais.find(c => c.id === seta.b_id);
        if (a && b && posicoesAtuais[a.id] && posicoesAtuais[b.id]) {
            const pa = posicoesAtuais[a.id];
            const pb = posicoesAtuais[b.id];
            desenharSeta(ctx, pa.x, pa.y, pb.x, pb.y, '#fbbf24', seta.progresso);
        }
    }

    // 3. Desenha setas verdes (ordem final)
    for (let i = 0; i < ordemFinalAtiva.length - 1; i++) {
        const a = cidadesGlobais.find(c => c.id === ordemFinalAtiva[i]);
        const b = cidadesGlobais.find(c => c.id === ordemFinalAtiva[i + 1]);
        if (a && b && posicoesAtuais[a.id] && posicoesAtuais[b.id]) {
            const pa = posicoesAtuais[a.id];
            const pb = posicoesAtuais[b.id];
            desenharSeta(ctx, pa.x, pa.y, pb.x, pb.y, '#34d399', 1);
        }
    }

    // 4. Desenha as cidades
    for (const cidade of cidadesGlobais) {
        const id = cidade.id;
        const pos = posicoesAtuais[id];
        if (!pos) continue;

        ctx.beginPath();
        ctx.arc(pos.x, pos.y, raioAtual[id], 0, Math.PI * 2);
        ctx.fillStyle = corCirculoAtual[id];
        ctx.fill();
        ctx.strokeStyle = corBordaAtual[id];
        ctx.lineWidth = 2;
        ctx.stroke();

        // Nome
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(cidade.nome, pos.x, pos.y - raioAtual[id] - 8);
    }

    requestAnimationFrame(loopAnimacao);
}


/**
 * Configura as cores-alvo de cada cidade conforme o estado (padrão, destacada, concluída).
 */
function atualizarCores(destacadasIds, concluidasIds) {
    for (const cidade of cidadesGlobais) {
        const id = cidade.id;
        if (concluidasIds.includes(id)) {
            corCirculoAlvo[id] = '#34d399';
            corBordaAlvo[id] = '#10b981';
        } else if (destacadasIds.includes(id)) {
            corCirculoAlvo[id] = '#fbbf24';
            corBordaAlvo[id] = '#f59e0b';
        } else {
            corCirculoAlvo[id] = '#00e5ff';
            corBordaAlvo[id] = '#00b8d4';
        }
    }
}


/**
 * Aplica um passo da animação.
 */
function aplicarPasso(passo) {
    if (!passo) return;

    if (passo.tipo === 'comparar') {
        atualizarCores([passo.a_id, passo.b_id], []);
        setasAtivas = [{ a_id: passo.a_id, b_id: passo.b_id, progresso: 0 }];
        ordemFinalAtiva = [];
    } else if (passo.tipo === 'merge') {
        atualizarCores(passo.resultado_ids, []);
        setasAtivas = [];
    }
}


/**
 * Avança um passo.
 */
function proximoPasso() {
    if (passoAtual >= passosGlobais.length) {
        // Fim: todas as cidades concluídas + setas verdes
        const idsOrdenados = cidadesGlobais
            .slice()
            .sort((a, b) => a.populacao - b.populacao)
            .map(c => c.id);
        atualizarCores([], cidadesGlobais.map(c => c.id));
        setasAtivas = [];
        ordemFinalAtiva = idsOrdenados;
        return false;
    }

    const passo = passosGlobais[passoAtual];
    aplicarPasso(passo);
    passoAtual++;
    return true;
}


/**
 * Inicia a animação contínua.
 */
function play() {
    if (animando) return;
    animando = true;

    const slider = document.getElementById('slider-velocidade');
    const velocidade = slider ? parseInt(slider.value) : 5;
    // 1200ms (lento) a 200ms (rápido)
    const intervalo = 1400 - (velocidade * 120);

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
 * Executa um único passo.
 */
function passoAPasso() {
    pause();
    proximoPasso();
}


/**
 * Reinicia o app.
 */
async function reiniciar() {
    pause();
    passoAtual = 0;

    // Limpa o estado de animação
    posicoesAtuais = {};
    posicoesAlvo = {};
    raioAtual = {};
    raioAlvo = {};
    corCirculoAtual = {};
    corCirculoAlvo = {};
    corBordaAtual = {};
    corBordaAlvo = {};
    setasAtivas = [];
    ordemFinalAtiva = [];

    const dados = await buscarCidades(8);
    if (dados && dados.cidades) {
        cidadesGlobais = dados.cidades;
        passosGlobais = dados.passos;
        atualizarCores([], []);
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

    atualizarCores([], []);
    loopAnimacao(); // inicia o loop de renderização
}


// Inicia quando a página carrega
window.addEventListener('DOMContentLoaded', iniciar);
