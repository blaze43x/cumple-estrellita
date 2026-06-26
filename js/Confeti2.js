// Estrellas delanteras (más brillantes)

window.oncontextmenu = function () {
  //return false;
};

const canvasConfeti2 = document.getElementById("canvas2");
const ctxConfeti2 = canvasConfeti2.getContext("2d");
const consultaMovil = window.matchMedia("(max-width: 768px)");

let ancho2 = (canvasConfeti2.width = window.innerWidth);
let alto2 = (canvasConfeti2.height = window.innerHeight);
let estrellas2 = [];
let resplandorActivo = !consultaMovil.matches;
let animacionActiva = false;
let frameId = null;

const coloresEstrellas2 = [
  "#FFFFFF",
  "#FFFDE7",
  "#FFE566",
  "#FFD700",
  "#FFF9C4",
  "#E3F2FD",
  "#FFCDD2",
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
  const radioInterno = radio * 0.3;

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
    ctx.shadowBlur = radio * 3.5;
  }

  ctx.fill();
  ctx.restore();
}

function crearEstrellas2() {
  const cantidad = esMovil() ? 28 : 70;

  for (let i = 0; i < cantidad; i++) {
    estrellas2.push({
      x: Math.random() * ancho2,
      y: Math.random() * alto2,
      r: Math.random() * 4 + 2,
      color: coloresEstrellas2[Math.floor(Math.random() * coloresEstrellas2.length)],
      fase: Math.random() * Math.PI * 2,
      velocidadBrillo: Math.random() * 0.06 + 0.025,
      rotacion: Math.random() * Math.PI,
      derivaX: (Math.random() - 0.5) * 0.12,
      derivaY: (Math.random() - 0.5) * 0.08,
    });
  }
}

function animarEstrellas2() {
  if (!animacionActiva) return;

  ctxConfeti2.clearRect(0, 0, ancho2, alto2);

  for (let i = 0; i < estrellas2.length; i++) {
    const estrella = estrellas2[i];
    estrella.fase += estrella.velocidadBrillo;

    const brillo = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(estrella.fase));
    dibujarEstrella(
      ctxConfeti2,
      estrella.x,
      estrella.y,
      estrella.r,
      estrella.rotacion,
      estrella.color,
      brillo
    );

    estrella.x += estrella.derivaX;
    estrella.y += estrella.derivaY;

    if (estrella.x < -12) estrella.x = ancho2 + 12;
    if (estrella.x > ancho2 + 12) estrella.x = -12;
    if (estrella.y < -12) estrella.y = alto2 + 12;
    if (estrella.y > alto2 + 12) estrella.y = -12;
  }

  frameId = requestAnimationFrame(animarEstrellas2);
}

function iniciarAnimacion() {
  if (animacionActiva) return;
  animacionActiva = true;
  animarEstrellas2();
}

function pausarAnimacion() {
  animacionActiva = false;

  if (frameId !== null) {
    cancelAnimationFrame(frameId);
    frameId = null;
  }

  ctxConfeti2.clearRect(0, 0, ancho2, alto2);
}

function redimensionarCanvas2() {
  const nuevoAncho = window.innerWidth;
  const nuevoAlto = window.innerHeight;

  if (nuevoAncho === ancho2 && nuevoAlto === alto2) return;

  const ratioX = nuevoAncho / ancho2;
  const ratioY = nuevoAlto / alto2;

  ancho2 = canvasConfeti2.width = nuevoAncho;
  alto2 = canvasConfeti2.height = nuevoAlto;

  for (const estrella of estrellas2) {
    estrella.x *= ratioX;
    estrella.y *= ratioY;
  }
}

consultaMovil.addEventListener("change", (evento) => {
  resplandorActivo = !evento.matches;
});

window.addEventListener("resize", redimensionarCanvas2);

window.confetiFrente = {
  pausar: pausarAnimacion,
  reanudar: iniciarAnimacion,
};

crearEstrellas2();

setTimeout(() => {
  iniciarAnimacion();
}, 1500);
