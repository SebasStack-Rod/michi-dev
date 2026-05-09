// ==========================================
// CONFIGURACIÓN DE AUDIO
// ==========================================
const meowSound = new Audio('music/miau.mp3');
const bgMusic = new Audio('music/fondo_musica.mp3');
bgMusic.volume = 0.15; // Volumen bajito de fondo
bgMusic.loop = true;   // Reproducción en bucle

let musicaIniciada = false;

// ==========================================
// 1. Contador de Mimos y Efectos
// ==========================================
let mimos = 0;
const btnMimo = document.getElementById('btn-mimo');
const displayMimos = document.getElementById('contador-mimos');

btnMimo.addEventListener('click', (e) => {
    // Iniciar la música de fondo al primer clic (para evitar bloqueos del navegador)
    if (!musicaIniciada) {
        bgMusic.play().catch(err => console.log("El navegador bloqueó el autoplay.", err));
        musicaIniciada = true;
    }

    // Reproducir maullido por 1 segundo exacto sin superponer
    meowSound.currentTime = 0; // Reinicia el audio a cero
    meowSound.play();
    setTimeout(() => {
        meowSound.pause();
        meowSound.currentTime = 0;
    }, 1000); // Lo corta justo al segundo

    // Lógica del contador
    mimos++;
    displayMimos.textContent = mimos;
    btnMimo.textContent = "🥰 ¡Gracias!";
    setTimeout(() => btnMimo.textContent = "💖 Dar Caricia", 1000);

    // Efecto de las letritas flotantes "miau"
    crearMiauFlotante(e.pageX, e.pageY);
});

// Función para generar las letras de "miau" que vuelan
function crearMiauFlotante(x, y) {
    const miau = document.createElement('span');
    miau.textContent = 'miau miau miau';
    miau.classList.add('miau-flotante');
    
    // Posición basada en donde hizo clic el mouse, con un poco de aleatoriedad
    const offsetX = (Math.random() - 0.5) * 50;
    miau.style.left = `${x + offsetX}px`;
    miau.style.top = `${y - 20}px`;

    document.body.appendChild(miau);

    // Eliminar el elemento del HTML después de 1 segundo (lo que dura la animación)
    setTimeout(() => {
        miau.remove();
    }, 1000); 
}

// ==========================================
// 2. Generador de Curiosidades (AMPLIADO)
// ==========================================
const curiosidades = [
    "Los gatos tienen 32 músculos en cada oreja.",
    "Un gato puede saltar hasta 6 veces su longitud.",
    "El cerebro de un gato es 90% similar al de un humano.",
    "Los gatos no pueden saborear lo dulce.",
    "Pelusa ha roto 42 líneas de código esta mañana.",
    "El ronroneo de los gatos tiene propiedades curativas para los huesos humanos.",
    "Los gatos pasan el 70% de sus vidas durmiendo.",
    "La nariz de un gato es única, como una huella dactilar humana.",
    "A diferencia de los perros, los gatos sudan por sus patas.",
    "Isaac Newton inventó la primera gatera (puerta para gatos).",
    "Los gatos tienen cinco dedos en las patas delanteras y cuatro en las traseras."
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
// 3. Modo Oscuro
// ==========================================
const btnDark = document.getElementById('btn-dark-mode');
btnDark.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    btnDark.textContent = document.body.classList.contains('dark-mode') ? "☀️ Modo Claro" : "🌙 Modo Michi-Dark";
});

// ==========================================
// 4. Formulario y LocalStorage (Persistencia)
// ==========================================
const formMichi = document.getElementById('form-michi');
const contenedorGaleria = document.getElementById('contenedor-galeria');
const fileInput = document.getElementById('foto-michi');

// Función para cargar los michis guardados al iniciar la página
function cargarMichisGuardados() {
    const michis = JSON.parse(localStorage.getItem('michisNuevos')) || [];
    michis.forEach(michi => agregarMichiAlDOM(michi.nombre, michi.especialidad, michi.imagenBase64));
}

// Función para dibujar un gato nuevo en la galería HTML
function agregarMichiAlDOM(nombre, especialidad, imagenSrc) {
    const nuevaCard = document.createElement('div');
    nuevaCard.classList.add('foto-card');
    
    nuevaCard.innerHTML = `
        <img src="${imagenSrc}" alt="${nombre}">
        <div class="card-info">
            <h4>${nombre}</h4>
            <p>Rol: ${especialidad}</p>
        </div>
    `;
    contenedorGaleria.appendChild(nuevaCard);
}

// Evento al enviar el formulario
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
            alert("¡Michi registrado y guardado exitosamente! 🐈💻");
        };
        reader.readAsDataURL(archivoFoto); 
    } else {
        alert("Por favor, sube una foto válida.");
    }
});

// Cargar al inicio
window.onload = cargarMichisGuardados;