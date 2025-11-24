

// Variáveis globais
const music = document.getElementById('background-music');
const introScreen = document.getElementById('intro-screen');
const mainContent = document.getElementById('main-content');
const weddingDate = new Date('2025-12-12T18:00:00').getTime(); // Data do casamento: 12/12/2025 às 18:00


let allowMusic = false;

// Ativação do áudio somente se allowMusic = true
document.body.addEventListener('click', () => {
    if (allowMusic && music.muted) {
        music.muted = false;
        music.play().catch(() => { });
    }
}, { once: true });

// Botão: Entrar com música
document.querySelector('.btn.primary').addEventListener('click', () => {
    allowMusic = true; // agora é permitido tocar música
    music.muted = false;

    music.play().catch(() => { });
    hideIntroScreen();
});

// Botão: Entrar sem música
document.querySelector('.btn.secondary').addEventListener('click', () => {
    allowMusic = false; // impede a música
    music.pause();
    music.currentTime = 0;
    hideIntroScreen();
});

function hideIntroScreen() {
    // Adiciona a classe hidden e garante a transição
    introScreen.style.opacity = '0';
    setTimeout(() => {
        introScreen.classList.add('hidden');
        mainContent.classList.remove('hidden');
    }, 1000); // 1 segundo para a transição de opacidade
}



// --- 2. Lógica da Contagem Regressiva ---

function updateCountdown() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const countdownMsg = document.getElementById("countdown-message");

    if (distance < 0) {
        clearInterval(countdownInterval);
        countdownMsg.classList.remove("hidden");
        document.getElementById("countdown-timer").classList.add("hidden");
        return;
    }

    // Dias, Horas, Minutos e Segundos
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Função para formatar com 2 dígitos
    const formatTime = (time) => {
        const str = String(time).padStart(2, "0");
        return [str[0], str[1]];
    };

    const [d1, d2] = formatTime(days);
    const [h1, h2] = formatTime(hours);
    const [m1, m2] = formatTime(minutes);
    const [s1, s2] = formatTime(seconds);

    // Atualiza o DOM
    document.getElementById("d1").innerText = d1;
    document.getElementById("d2").innerText = d2;

    document.getElementById("h1").innerText = h1;
    document.getElementById("h2").innerText = h2;

    document.getElementById("m1").innerText = m1;
    document.getElementById("m2").innerText = m2;

    document.getElementById("s1").innerText = s1;
    document.getElementById("s2").innerText = s2;
}

// Roda imediatamente ao abrir a página
updateCountdown();

// Agora atualiza a cada 1 segundo
const countdownInterval = setInterval(updateCountdown, 1000);

// --- 3. Lógica de Modais ---

function openModal(id) {
    document.getElementById(id).classList.remove('hidden');
}

function closeModal(id) {
    document.getElementById(id).classList.add('hidden');
}

// Fechar modais ao clicar fora
document.getElementById('modal-presenca').addEventListener('click', (e) => {
    if (e.target.id === 'modal-presenca') {
        closeModal('modal-presenca');
    }
});
document.getElementById('modal-presentes').addEventListener('click', (e) => {
    if (e.target.id === 'modal-presentes') {
        closeModal('modal-presentes');
    }
});


// --- 4. Lógica do Formulário de Presença com Select2 e WhatsApp ---

$(document).ready(function () {
    // Inicializa o Select2 para o campo de nome
    $('#guest-name').select2({
        dropdownParent: $('#modal-presenca'), // Garante que o dropdown fique dentro do modal
        placeholder: "Pesquisar nome do convidado...",
        allowClear: true // Permite limpar a seleção
    });

    // Lógica de Submissão do Formulário
    $('#presence-form').on('submit', function (e) {
        e.preventDefault();

        const guestName = $('#guest-name').val();
        const status = $('#attendance-status').val(); // Ex: "Confirmação de Presença: Sim"

        if (!guestName) {
            alert('Por favor, selecione seu nome na lista.');
            return;
        }

        const action = status.includes('Sim') ? 'CONFIRMA presença' : 'NÃO CONFIRMA presença';

        // Mensagem formatada
        const message = `Olá! O convidado(a) *${guestName}* ${action} para o casamento de Robson e Railania. Detalhe: ${status}.`;

        // Número do WhatsApp (internacional format)
        const whatsappNumber = '5571984891443';

        // Cria o link do WhatsApp
        const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        // Redireciona
        window.open(whatsappLink, '_blank');

        // Limpa e fecha o modal
        $('#guest-name').val(null).trigger('change'); // Limpa Select2
        document.getElementById('attendance-status').value = 'Confirmação de Presença: Sim';
        closeModal('modal-presenca');

        // Aqui você faria a chamada para o Firebase/Firestore para registrar a presença
        // Exemplo (comentado pois exige inicialização do Firebase):
        // savePresence(guestName, status);
    });
});
// --- 5. AUTO-SCROLL DO ROLO DE CÂMERA ---
const gallery = document.querySelector('.photo-gallery-carousel');

if (gallery) {
    let scrollAmount = 0;

    function autoScrollGallery() {
        if (gallery.scrollWidth - gallery.clientWidth <= scrollAmount) {
            scrollAmount = 0; // Reinicia no começo
        } else {
            scrollAmount += 4; // velocidade do scroll (mude para 1 ou 3 se quiser)
        }

        gallery.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
        });
    }

    setInterval(autoScrollGallery, 50); // intervalo do movimento (mais baixo = mais rápido)
}




document.addEventListener('DOMContentLoaded', () => {
    // Funções de abertura/fechamento
    function openModal(id) {
        const el = document.getElementById(id);
        if (el) el.classList.remove('hidden');
    }

    function closeModal(id) {
        const el = document.getElementById(id);
        if (el) el.classList.add('hidden');
    }

    // Copiar chave PIX
    function copiarPix() {
        const chaveEl = document.getElementById('pix-chave');
        if (!chaveEl) return alert('Chave PIX não encontrada');
        const chave = chaveEl.innerText.trim();
        if (!navigator.clipboard) {
            // fallback
            const input = document.createElement('input');
            input.value = chave;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            alert('Chave PIX copiada!');
            return;
        }
        navigator.clipboard.writeText(chave)
            .then(() => alert('Chave PIX copiada!'))
            .catch(() => alert('Não foi possível copiar a chave'));
    }

    // Expõe globalmente se você chama isso via onclick inline
    window.openModal = openModal;
    window.closeModal = closeModal;
    window.copiarPix = copiarPix;

    // Fecha o modal ao clicar fora (delegação segura)
    const modalPresentes = document.getElementById('modal-presentes');
    if (modalPresentes) {
        modalPresentes.addEventListener('click', (e) => {
            // se clicou exatamente no backdrop (id do wrapper)
            if (e.target === modalPresentes) closeModal('modal-presentes');
        });
    }

    // Caso você tenha botões inline com onclick="openModal('modal-presentes')"
    // não precisa fazer nada aqui. Se quiser ligar por JS:
    const btnPresentes = document.querySelector('[data-open="modal-presentes"]');
    if (btnPresentes) {
        btnPresentes.addEventListener('click', () => openModal('modal-presentes'));
    }

    // IMPORTANTE: se você tiver outros scripts que adicionam listeners (ex: botão "Entrar"),
    // eles também devem rodar após o DOMContentLoaded ou estar antes deste script.
});

function copiarPix() {
    const chave = document.getElementById("pix-chave").innerText;
    navigator.clipboard.writeText(chave).then(() => {
        alert("Chave PIX copiada!");
    });
}



