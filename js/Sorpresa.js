// Carta
const regalo = document.querySelector(".regalo");
const regalos = document.querySelector(".regalos");
const modalCarta = document.getElementById("modalCarta");
const carta = document.querySelector(".carta");
const videoCarta = document.getElementById("videoCarta");
const videoError = document.getElementById("videoError");

function extraerIdYouTube(url) {
  if (!url || url === "PEGA_TU_ENLACE_AQUI") return null;

  const texto = url.trim();

  if (/^[\w-]{11}$/.test(texto)) return texto;

  const patrones = [
    /(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtu\.be\/)([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
  ];

  for (const patron of patrones) {
    const coincidencia = texto.match(patron);
    if (coincidencia) return coincidencia[1];
  }

  return null;
}

const youtubeId = extraerIdYouTube(YOUTUBE_VIDEO_URL);

function urlEmbedYouTube(id) {
  const params = new URLSearchParams({
    rel: "0",
    enablejsapi: "1",
    modestbranding: "1",
  });

  if (window.location.protocol.startsWith("http")) {
    params.set("origin", window.location.origin);
  }

  return `https://www.youtube.com/embed/${id}?${params}`;
}

const youtubeEmbedBase = youtubeId ? urlEmbedYouTube(youtubeId) : "";

if (youtubeEmbedBase) {
  videoCarta.src = youtubeEmbedBase;
  videoError.hidden = true;
} else {
  videoError.hidden = false;
}

function comandoYouTube(func) {
  if (!youtubeEmbedBase) return;
  videoCarta.contentWindow.postMessage(
    JSON.stringify({ event: "command", func, args: "" }),
    "*"
  );
}

function abrirCarta() {
  document.body.classList.add("carta-abierta");
  modalCarta.classList.add("activo");
  if (youtubeEmbedBase) {
    videoCarta.src = youtubeEmbedBase;
  }
}

function cerrarCarta() {
  document.body.classList.remove("carta-abierta");
  modalCarta.classList.remove("activo");
  comandoYouTube("pauseVideo");
}

regalo.addEventListener("click", abrirCarta);
regalos.addEventListener("click", abrirCarta);

modalCarta.addEventListener("click", (e) => {
  if (e.target === modalCarta) cerrarCarta();
});

carta.addEventListener("click", (e) => e.stopPropagation());

// Todo Oscuro + Soplido + Canción
const overlay = document.querySelector(".overlay");
const soplido = document.getElementById("soplido");
const cancion = document.getElementById("cancion");
const llama = document.querySelector(".llama");

llama.addEventListener("click", () => {
  soplido.currentTime = 0;
  soplido.play();

  llama.style.animation = "apagar 0.5s forwards";

  setTimeout(() => {
    cancion.currentTime = 0;
    cancion.play();
    overlay.classList.add("hidden");
  }, 1000);
});
