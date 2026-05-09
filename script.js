// ==========================================
// CONFIGURACIÓN DE AUDIO
// ==========================================
const meowSound = new Audio('music/miau.mp3');
const bgMusic = new Audio('music/fondo_musica.mp3');
bgMusic.volume = 0.15; // Volumen bajito de fondo
bgMusic.loop = true;   // Reproducción en bucle

let musicaIniciada = false;

// ==========================================
// 1. Contador de Mimos y Efectos Originales
// ==========================================
let mimos = 0;
const btnMimo = document.getElementById('btn-mimo');
const displayMimos = document.getElementById('contador-mimos');

btnMimo.addEventListener('click', (e) => {
    // Iniciar la música de fondo al primer clic
    if (!musicaIniciada) {
        bgMusic.play().catch(err => console.log("Autoplay bloqueado.", err));
        musicaIniciada = true;
    }

    meowSound.currentTime = 0; 
    meowSound.play();
    setTimeout(() => {
        meowSound.pause();
        meowSound.currentTime = 0;
    }, 1000); 

    mimos++;
    displayMimos.textContent = mimos;
    btnMimo.textContent = "🥰 ¡Gracias!";
    setTimeout(() => btnMimo.textContent = "💖 Dar Caricia", 1000);

    crearMiauFlotante(e.pageX, e.pageY);
});

function crearMiauFlotante(x, y) {
    const miau = document.createElement('span');
    miau.textContent = 'miau miau miau';
    miau.classList.add('miau-flotante'); // Asegúrate de tener esta clase en CSS si quieres estilizarla
    
    const offsetX = (Math.random() - 0.5) * 50;
    miau.style.position = 'absolute';
    miau.style.left = `${x + offsetX}px`;
    miau.style.top = `${y - 20}px`;
    miau.style.color = '#ff6b77';
    miau.style.fontWeight = 'bold';
    miau.style.zIndex = '9999';

    document.body.appendChild(miau);
    setTimeout(() => miau.remove(), 1000); 
}

// ==========================================
// 2. Generador de Curiosidades
// ==========================================
const curiosidades = [
    "Los gatos tienen 32 músculos en cada oreja.",
    "Un gato puede saltar hasta 6 veces su longitud.",
    "El cerebro de un gato es 90% similar al de un humano.",
    "Los gatos no pueden saborear lo dulce.",
    "Pelusa ha roto 42 líneas de código esta mañana.",
    "El ronroneo de los gatos tiene propiedades curativas para los huesos humanos."
];

const btnFact = document.getElementById('btn-fact');
const factText = document.getElementById('fact-text');

btnFact.addEventListener('click', () => {
    const random = Math.floor(Math.random() * curiosidades.length);
    factText.style.opacity = 0;
    setTimeout(() => {
        factText.textContent = curiosidades[random];
        factText.style.opacity = 1;
    }, 300);
});

// ==========================================
// 3. Modo Oscuro (ARREGLADO PARA ACTIVAR VARIABLES CSS)
// ==========================================
const btnDark = document.getElementById('btn-dark-mode');
btnDark.addEventListener('click', () => {
    // Al añadir 'dark-mode' al body, el CSS cambia las variables :root
    document.body.classList.toggle('dark-mode');
    btnDark.textContent = document.body.classList.contains('dark-mode') ? "☀️ Modo Claro" : "🌙 Modo Michi-Dark";
});

// ==========================================
// 4. Formulario y LocalStorage (Intacto)
// ==========================================
const formMichi = document.getElementById('form-michi');
const contenedorGaleria = document.getElementById('contenedor-galeria');
const fileInput = document.getElementById('foto-michi');

function cargarMichisGuardados() {
    const michis = JSON.parse(localStorage.getItem('michisNuevos')) || [];
    michis.forEach(michi => agregarMichiAlDOM(michi.nombre, michi.especialidad, michi.imagenBase64));
}

function agregarMichiAlDOM(nombre, especialidad, imagenSrc) {
    const nuevaCard = document.createElement('div');
    nuevaCard.classList.add('foto-card');
    
    nuevaCard.innerHTML = `
        <img src="${imagenSrc}" alt="${nombre}" style="transition: transform 0.4s ease;">
        <div class="card-info">
            <h4>${nombre}</h4>
            <p>Rol: ${especialidad}</p>
        </div>
    `;
    
    // Le agregamos el evento de hover por javascript también como extra seguridad
    const img = nuevaCard.querySelector('img');
    img.addEventListener('mouseenter', () => img.style.transform = 'scale(1.08) rotate(2deg)');
    img.addEventListener('mouseleave', () => img.style.transform = 'scale(1) rotate(0deg)');

    contenedorGaleria.appendChild(nuevaCard);
}

formMichi.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre = document.getElementById('nombre-michi').value;
    const especialidad = document.getElementById('especialidad-michi').value;
    const archivoFoto = fileInput.files[0];

    if (archivoFoto) {
        const reader = new FileReader();
        reader.onload = function(evento) {
            const imagenBase64 = evento.target.result;
            agregarMichiAlDOM(nombre, especialidad, imagenBase64);
            
            const michisGuardados = JSON.parse(localStorage.getItem('michisNuevos')) || [];
            michisGuardados.push({ nombre, especialidad, imagenBase64 });
            localStorage.setItem('michisNuevos', JSON.stringify(michisGuardados));

            formMichi.reset();
            alert("¡Michi registrado! 🐈💻");
        };
        reader.readAsDataURL(archivoFoto); 
    }
});

// ==========================================
// 5. NUEVO: BRILLITOS AL DESLIZAR EL DEDO/MOUSE
// ==========================================
// Escucha tanto el movimiento del mouse (PC) como el dedo (Celular)
document.addEventListener('mousemove', crearBrillito);
document.addEventListener('touchmove', (e) => {
    // Tomamos la coordenada del primer dedo tocando la pantalla
    const touch = e.touches[0];
    crearBrillito({ pageX: touch.pageX, pageY: touch.pageY });
});

function crearBrillito(e) {
    // Para no saturar el navegador, creamos un brillito solo con cierta probabilidad
    if (Math.random() > 0.4) return; 

    const brillito = document.createElement('div');
    brillito.classList.add('brillito');
    
    // Posicionamos exactamente donde pasó el cursor/dedo
    brillito.style.left = `${e.pageX}px`;
    brillito.style.top = `${e.pageY}px`;
    
    document.body.appendChild(brillito);

    // El CSS se encarga de animarlo, aquí solo lo borramos del HTML al terminar
    setTimeout(() => {
        brillito.remove();
    }, 600);
}

// ==========================================
// 6. NUEVO: VENTANA EMERGENTE DEL LOGO
// ==========================================
const logoMichiDev = document.getElementById('logo-michidev');
const modalGracias = document.getElementById('modal-gracias');
const btnCerrarModal = document.getElementById('cerrar-modal');

// Abrir el modal
logoMichiDev.addEventListener('click', () => {
    modalGracias.style.display = 'block';
});

// Cerrar con la X
btnCerrarModal.addEventListener('click', () => {
    modalGracias.style.display = 'none';
});

// Cerrar si hace clic afuera del recuadro
window.addEventListener('click', (e) => {
    if (e.target === modalGracias) {
        modalGracias.style.display = 'none';
    }
});

// Cargar estado inicial
window.onload = cargarMichisGuardados;
