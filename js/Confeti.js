// Estrellas de fondo

window.oncontextmenu = function () {
  //return false;
};

const canvasConfeti = document.getElementById("canvas1");
const ctxConfeti = canvasConfeti.getContext("2d");
const consultaMovil = window.matchMedia("(max-width: 768px)");

let ancho = (canvasConfeti.width = window.innerWidth);
let alto = (canvasConfeti.height = window.innerHeight);
let estrellas = [];
let resplandorActivo = !consultaMovil.matches;
let animacionActiva = false;
let frameId = null;

const coloresEstrellas = [
  "#FFFFFF",
  "#FFF8E7",
  "#FFE566",
  "#FFD54F",
  "#FFECB3",
  "#E8F4FF",
  "#FFB7C5",
  "#F8BBD0",
];

function esMovil() {
  return consultaMovil.matches;
}

function dibujarEstrella(ctx, x, y, radio, rotacion, color, opacidad) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotacion);
  ctx.globalAlpha = opacidad;
  ctx.beginPath();

  const puntas = 4;
  const radioInterno = radio * 0.35;

  for (let i = 0; i < puntas * 2; i++) {
    const radioActual = i % 2 === 0 ? radio : radioInterno;
    const angulo = (Math.PI / puntas) * i - Math.PI / 2;
    const px = Math.cos(angulo) * radioActual;
    const py = Math.sin(angulo) * radioActual;

    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }

  ctx.closePath();
  ctx.fillStyle = color;

  if (resplandorActivo) {
    ctx.shadowColor = color;
    ctx.shadowBlur = radio * 2.5;
  }

  ctx.fill();
  ctx.restore();
}

function crearEstrellas() {
  const cantidad = esMovil() ? 55 : 140;

  for (let i = 0; i < cantidad; i++) {
    estrellas.push({
      x: Math.random() * ancho,
      y: Math.random() * alto,
      r: Math.random() * 3 + 1,
      color: coloresEstrellas[Math.floor(Math.random() * coloresEstrellas.length)],
      fase: Math.random() * Math.PI * 2,
      velocidadBrillo: Math.random() * 0.04 + 0.015,
      rotacion: Math.random() * Math.PI,
      derivaX: (Math.random() - 0.5) * 0.08,
      derivaY: (Math.random() - 0.5) * 0.05,
    });
  }
}

function pintarCielo() {
  const gradiente = ctxConfeti.createLinearGradient(0, 0, 0, alto);
  gradiente.addColorStop(0, "#070b1f");
  gradiente.addColorStop(0.45, "#12103a");
  gradiente.addColorStop(1, "#0a1628");
  ctxConfeti.fillStyle = gradiente;
  ctxConfeti.fillRect(0, 0, ancho, alto);
}

function animarEstrellas() {
  if (!animacionActiva) return;

  pintarCielo();

  for (let i = 0; i < estrellas.length; i++) {
    const estrella = estrellas[i];
    estrella.fase += estrella.velocidadBrillo;

    const brillo = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(estrella.fase));
    dibujarEstrella(
      ctxConfeti,
      estrella.x,
      estrella.y,
      estrella.r,
      estrella.rotacion,
      estrella.color,
      brillo
    );

    estrella.x += estrella.derivaX;
    estrella.y += estrella.derivaY;

    if (estrella.x < -10) estrella.x = ancho + 10;
    if (estrella.x > ancho + 10) estrella.x = -10;
    if (estrella.y < -10) estrella.y = alto + 10;
    if (estrella.y > alto + 10) estrella.y = -10;
  }

  frameId = requestAnimationFrame(animarEstrellas);
}

function iniciarAnimacion() {
  if (animacionActiva) return;
  animacionActiva = true;
  animarEstrellas();
}

function pausarAnimacion() {
  animacionActiva = false;

  if (frameId !== null) {
    cancelAnimationFrame(frameId);
    frameId = null;
  }

  pintarCielo();
}

function redimensionarCanvas() {
  const nuevoAncho = window.innerWidth;
  const nuevoAlto = window.innerHeight;

  if (nuevoAncho === ancho && nuevoAlto === alto) return;

  const ratioX = nuevoAncho / ancho;
  const ratioY = nuevoAlto / alto;

  ancho = canvasConfeti.width = nuevoAncho;
  alto = canvasConfeti.height = nuevoAlto;

  for (const estrella of estrellas) {
    estrella.x *= ratioX;
    estrella.y *= ratioY;
  }
}

consultaMovil.addEventListener("change", (evento) => {
  resplandorActivo = !evento.matches;
});

window.addEventListener("resize", redimensionarCanvas);

window.confetiFondo = {
  pausar: pausarAnimacion,
  reanudar: iniciarAnimacion,
};

crearEstrellas();

setTimeout(() => {
  iniciarAnimacion();
}, 1500);
