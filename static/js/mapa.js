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
 * Desenha as cidades no canvas.
 * @param {Array} cidades — lista de cidades
 * @param {Array} destacadasIds — IDs das cidades que devem ficar destacadas (opcional)
 * @param {Array} ordenadasIds — IDs das cidades já ordenadas (pra desenhar linha final)
 */
function desenharCidades(cidades, destacadasIds = [], ordenadasIds = []) {
    const canvas = document.getElementById('mapa');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    limparCanvas();

    const escalaX = canvas.width / 100;
    const escalaY = canvas.height / 100;

    for (const cidade of cidades) {
        const px = cidade.x * escalaX;
        const py = cidade.y * escalaY;

        // Tamanho do círculo proporcional à população
        const raio = 4 + (cidade.populacao / 100000) * 12;

        // Cor: destaque (amarelo) se estiver sendo comparada
        const destacada = destacadasIds.includes(cidade.id);
        const corCirculo = destacada ? '#fbbf24' : '#a78bfa';
        const corBorda = destacada ? '#f59e0b' : '#6c63ff';

        // Círculo
        ctx.beginPath();
        ctx.arc(px, py, raio, 0, Math.PI * 2);
        ctx.fillStyle = corCirculo;
        ctx.fill();
        ctx.strokeStyle = corBorda;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Nome acima
        ctx.fillStyle = '#e8e8e8';
        ctx.font = '12px Segoe UI';
        ctx.textAlign = 'center';
        ctx.fillText(cidade.nome, px, py - raio - 6);
    }

    // Se tem IDs ordenados, desenha a linha final conectando
    if (ordenadasIds.length > 1) {
        ctx.beginPath();
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 4]);

        let primeiro = true;
        for (const id of ordenadasIds) {
            const cidade = cidades.find(c => c.id === id);
            if (!cidade) continue;
            const px = cidade.x * escalaX;
            const py = cidade.y * escalaY;
            if (primeiro) {
                ctx.moveTo(px, py);
                primeiro = false;
            } else {
                ctx.lineTo(px, py);
            }
        }
        ctx.stroke();
        ctx.setLineDash([]);
    }
}


/**
 * Aplica um passo do Merge Sort no canvas.
 */
function aplicarPasso(passo) {
    if (!passo) return;

    if (passo.tipo === 'comparar') {
        // Destaca as duas cidades sendo comparadas
        desenharCidades(cidadesGlobais, [passo.a_id, passo.b_id]);
    } else if (passo.tipo === 'merge') {
        // Destaca o resultado do merge
        desenharCidades(cidadesGlobais, passo.resultado_ids);
    }
}


/**
 * Executa o próximo passo da animação.
 * Retorna true se ainda tem passos, false se acabou.
 */
function proximoPasso() {
    if (passoAtual >= passosGlobais.length) {
        // Fim: desenha o estado final (linha conectando)
        const idsOrdenados = cidadesGlobais
            .slice()
            .sort((a, b) => a.populacao - b.populacao)
            .map(c => c.id);
        desenharCidades(cidadesGlobais, [], idsOrdenados);
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
    const intervalo = 1100 - (velocidade * 100); // 1000ms (lento) a 100ms (rápido)

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
