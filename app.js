import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// ====================================================
// WAREMAP - BODEGA SEGÚN PLANO DE REFERENCIA
// Vista superior: 2 racks arriba, 2 al centro, 1 abajo.
// Cada rack: 7 posiciones x 3 niveles = 21 ubicaciones.
// ====================================================

const CFG = {
  columnas: 7,
  niveles: 3,
  anchoCelda: 1.35,
  altoCelda: 1.12,
  profundidad: 1.08,
  salaAncho: 16.0,
  salaLargo: 18.2
};

// Negativo en Z = parte superior del plano (entrada).
const PLANO = [
  { codigo: "R01", x: 0, z: -6.10, zona: "Superior" },
  { codigo: "R02", x: 0, z: -4.58, zona: "Superior" },
  { codigo: "R03", x: 0, z:  1.38, zona: "Central" },
  { codigo: "R04", x: 0, z:  2.90, zona: "Central" },
  // La cara posterior de R05 queda junto a la pared sur.
  { codigo: "R05", x: 0, z:  8.43, zona: "Inferior" }
];

const COLOR = {
  suelo: 0xfff5a7,
  pared: 0xd0a64d,
  naranja: 0xf47714,
  naranjaOscuro: 0xb74a08,
  bandeja: 0xff9d3e,
  verde: 0x80e3a4,
  seleccionado: 0xffdb45
};

const catalogo = [
  { nombre: "Orégano molido", sku: "GOU-1001", unidad: "Kg" },
  { nombre: "Pimienta negra", sku: "GOU-1002", unidad: "Kg" },
  { nombre: "Canela molida", sku: "GOU-1003", unidad: "Kg" },
  { nombre: "Comino", sku: "GOU-1004", unidad: "Kg" },
  { nombre: "Ají de color", sku: "GOU-1005", unidad: "Kg" },
  { nombre: "Curry", sku: "GOU-1006", unidad: "Kg" },
  { nombre: "Ajo granulado", sku: "GOU-1007", unidad: "Kg" },
  { nombre: "Merkén", sku: "GOU-1008", unidad: "Kg" }
];

// Datos simulados: films y etiquetas SOLO en el Rack 05, posiciones 04–07.
// Nivel 1: films de diferentes productos; nivel 2: etiquetas.
// En las demás posiciones ocupadas se almacenan materias primas.
// Los productos reservados se definen a continuación en sus ubicaciones específicas.
const ubicacionesEtiquetasEspeciales = {
  "R05-N2-P04": [
    { sku: "ETQ-R05-24-A", nombre: "Etiqueta Orégano", cantidad: 28, unidad: "Un." },
    { sku: "ETQ-R05-24-B", nombre: "Etiqueta Merkén", cantidad: 24, unidad: "Un." },
    { sku: "ETQ-R05-24-C", nombre: "Etiqueta Canela", cantidad: 22, unidad: "Un." },
    { sku: "ETQ-R05-24-D", nombre: "Etiqueta Comino", cantidad: 18, unidad: "Un." }
  ],
  "R05-N2-P05": [
    { sku: "ETQ-R05-25-A", nombre: "Etiqueta Pimienta negra", cantidad: 26, unidad: "Un." },
    { sku: "ETQ-R05-25-B", nombre: "Etiqueta Ají de color", cantidad: 20, unidad: "Un." },
    { sku: "ETQ-R05-25-C", nombre: "Etiqueta Curry", cantidad: 16, unidad: "Un." },
    { sku: "ETQ-R05-25-D", nombre: "Etiqueta Ajo granulado", cantidad: 18, unidad: "Un." }
  ],
  "R05-N2-P06": [
    { sku: "ETQ-R05-26-A", nombre: "Etiqueta Tomate ketchup", cantidad: 20, unidad: "Un." },
    { sku: "ETQ-R05-26-B", nombre: "Etiqueta Salsa BBQ", cantidad: 17, unidad: "Un." },
    { sku: "ETQ-R05-26-C", nombre: "Etiqueta Mostaza", cantidad: 15, unidad: "Un." },
    { sku: "ETQ-R05-26-D", nombre: "Etiqueta Mayonesa", cantidad: 19, unidad: "Un." }
  ],
  "R05-N2-P07": [
    { sku: "ETQ-R05-27-A", nombre: "Etiqueta Páprika", cantidad: 21, unidad: "Un." },
    { sku: "ETQ-R05-27-B", nombre: "Etiqueta Albahaca", cantidad: 17, unidad: "Un." },
    { sku: "ETQ-R05-27-C", nombre: "Etiqueta Laurel", cantidad: 14, unidad: "Un." },
    { sku: "ETQ-R05-27-D", nombre: "Etiqueta Cúrcuma", cantidad: 16, unidad: "Un." }
  ]
};
const ubicacionesFilmsEspeciales = {
  "R05-N1-P04": [
    { sku: "FIL-R05-14-A", nombre: "Film Orégano", cantidad: 14, unidad: "Un." },
    { sku: "FIL-R05-14-B", nombre: "Film Comino", cantidad: 12, unidad: "Un." },
    { sku: "FIL-R05-14-C", nombre: "Film Merkén", cantidad: 10, unidad: "Un." },
    { sku: "FIL-R05-14-D", nombre: "Film Canela", cantidad: 11, unidad: "Un." }
  ],
  "R05-N1-P05": [
    { sku: "FIL-R05-15-A", nombre: "Film Pimienta negra", cantidad: 13, unidad: "Un." },
    { sku: "FIL-R05-15-B", nombre: "Film Ají de color", cantidad: 10, unidad: "Un." },
    { sku: "FIL-R05-15-C", nombre: "Film Curry", cantidad: 9, unidad: "Un." },
    { sku: "FIL-R05-15-D", nombre: "Film Ajo granulado", cantidad: 8, unidad: "Un." }
  ],
  "R05-N1-P06": [
    { sku: "FIL-R05-16-A", nombre: "Film Tomate ketchup", cantidad: 15, unidad: "Un." },
    { sku: "FIL-R05-16-B", nombre: "Film Salsa BBQ", cantidad: 11, unidad: "Un." },
    { sku: "FIL-R05-16-C", nombre: "Film Mostaza", cantidad: 9, unidad: "Un." },
    { sku: "FIL-R05-16-D", nombre: "Film Mayonesa", cantidad: 10, unidad: "Un." }
  ],
  "R05-N1-P07": [
    { sku: "FIL-R05-17-A", nombre: "Film Páprika", cantidad: 12, unidad: "Un." },
    { sku: "FIL-R05-17-B", nombre: "Film Albahaca", cantidad: 10, unidad: "Un." },
    { sku: "FIL-R05-17-C", nombre: "Film Laurel", cantidad: 8, unidad: "Un." },
    { sku: "FIL-R05-17-D", nombre: "Film Cúrcuma", cantidad: 9, unidad: "Un." }
  ]
};
const ubicaciones = [];
for (let r = 0; r < PLANO.length; r++) {
  for (let n = 1; n <= CFG.niveles; n++) {
    for (let p = 1; p <= CFG.columnas; p++) {
      const rack = PLANO[r];
      const codigo = `${rack.codigo}-N${n}-P${String(p).padStart(2, "0")}`;
      const esRolloEspecial = Object.hasOwn(ubicacionesEtiquetasEspeciales, codigo);
      const esFilmEspecial = Object.hasOwn(ubicacionesFilmsEspeciales, codigo);
      const ocupado = esRolloEspecial || esFilmEspecial || ((r + 1) * 7 + n * 3 + p * 5) % 8 < 5;
      let productos = [];
      if (esRolloEspecial) {
        productos = ubicacionesEtiquetasEspeciales[codigo].map(item => ({...item}));
      } else if (esFilmEspecial) {
        productos = ubicacionesFilmsEspeciales[codigo].map(item => ({...item}));
      } else if (ocupado) {
        const articulo = catalogo[((r + 1) * 11 + n * 3 + p) % catalogo.length];
        productos = [{
          sku: articulo.sku,
          nombre: articulo.nombre,
          cantidad: (p + n * 2 + r + 1) * (articulo.unidad === "Kg" ? 6 : 12),
          unidad: articulo.unidad
        }];
      }
      ubicaciones.push({
        codigo,
        rack: rack.codigo, zona: rack.zona, nivel: n, posicion: p,
        estado: productos.length ? "Ocupado" : "Vacío", producto: productos[0] ?? null,
        productos,
        tipo3d: esRolloEspecial ? "rollos_etiquetas" : esFilmEspecial ? "rollos_sachet" : (productos.length ? "big_bag" : "vacio")
      });
    }
  }
}

const contenedor = document.querySelector("#scene3d");
const escena = new THREE.Scene();
escena.background = new THREE.Color(0xe8e5cb);
const camara = new THREE.PerspectiveCamera(48, 1, 0.1, 150);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
contenedor.appendChild(renderer.domElement);

const controls = new OrbitControls(camara, renderer.domElement);
controls.enableDamping = true;
controls.minDistance = 5;
controls.maxDistance = 55;
controls.maxPolarAngle = Math.PI / 2.01;

escena.add(new THREE.HemisphereLight(0xffffff, 0xceb572, 2.1));
const sol = new THREE.DirectionalLight(0xffffff, 2.2);
sol.position.set(-7, 17, 10);
sol.castShadow = true;
sol.shadow.mapSize.set(2048, 2048);
sol.shadow.camera.left = -16;
sol.shadow.camera.right = 16;
sol.shadow.camera.top = 17;
sol.shadow.camera.bottom = -17;
escena.add(sol);

const matPiso = new THREE.MeshStandardMaterial({ color: COLOR.suelo, roughness: 0.95 });
const piso = new THREE.Mesh(new THREE.PlaneGeometry(CFG.salaAncho, CFG.salaLargo), matPiso);
piso.rotation.x = -Math.PI / 2;
piso.position.y = -0.08;
piso.receiveShadow = true;
escena.add(piso);

const matPared = new THREE.MeshStandardMaterial({ color: COLOR.pared, roughness: 0.9 });
const matEstructura = new THREE.MeshStandardMaterial({ color: COLOR.naranja, roughness: 0.55, metalness: 0.28 });
const matVigas = new THREE.MeshStandardMaterial({ color: COLOR.naranjaOscuro, roughness: 0.55, metalness: 0.3 });
const matBandeja = new THREE.MeshStandardMaterial({ color: COLOR.bandeja, roughness: 0.7, metalness: 0.2 });
const matBigBagCuerpo = new THREE.MeshStandardMaterial({ color: 0xf7f7f2, roughness: 0.96, metalness: 0.0 });
const matBigBagTapa = new THREE.MeshStandardMaterial({ color: 0xf0f0eb, roughness: 0.98, metalness: 0.0 });
const matBigBagAsa = new THREE.MeshStandardMaterial({ color: 0x4c9fe3, roughness: 0.8, metalness: 0.0 });
const matBigBagCostura = new THREE.MeshStandardMaterial({ color: 0x7ebdf0, roughness: 0.85, metalness: 0.0 });
const matLineaVacia = new THREE.LineBasicMaterial({ color: 0x7e8995 });

function prisma(padre, ancho, alto, fondo, x, y, z, material) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(ancho, alto, fondo), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  padre.add(mesh);
  return mesh;
}


function crearPalletPlasticoAzul(padre, yBase, ancho, fondo) {
  const grupo = new THREE.Group();
  const matPalletAzul = new THREE.MeshStandardMaterial({ color: 0x2f78d8, roughness: 0.78, metalness: 0.03 });
  const altoTablero = 0.08;
  prisma(grupo, ancho, altoTablero, fondo, 0, yBase + 0.16, 0, matPalletAzul);
  for (const z of [-fondo * 0.33, 0, fondo * 0.33]) {
    prisma(grupo, ancho * 0.96, 0.022, fondo * 0.14, 0, yBase + 0.205, z, matPalletAzul);
  }
  for (const x of [-ancho * 0.32, 0, ancho * 0.32]) {
    for (const z of [-fondo * 0.3, 0, fondo * 0.3]) {
      prisma(grupo, ancho * 0.12, 0.14, fondo * 0.12, x, yBase + 0.06, z, matPalletAzul);
    }
  }
  padre.add(grupo);
  return grupo;
}

function crearBigBag(padre, x, centroY, fondoRack) {
  const grupo = new THREE.Group();
  grupo.position.set(x, centroY - 0.10, 0);

  const ancho = CFG.anchoCelda * 0.75;
  const alto = CFG.altoCelda * 0.68;
  const fondo = fondoRack * 0.68;

  crearPalletPlasticoAzul(grupo, -alto * 0.62, ancho * 1.02, fondo * 1.02);

  const cuerpoInf = prisma(grupo, ancho * 0.92, alto * 0.50, fondo * 0.90, 0, -alto * 0.10, 0, matBigBagCuerpo);
  const cuerpoSup = prisma(grupo, ancho * 0.98, alto * 0.26, fondo * 0.96, 0, alto * 0.23, 0, matBigBagTapa);
  const pliegueFrontal = prisma(grupo, ancho * 0.72, 0.02, 0.02, 0, alto * 0.05, fondo * 0.46, matBigBagCostura);
  const pliegueTrasero = prisma(grupo, ancho * 0.72, 0.02, 0.02, 0, alto * 0.05, -fondo * 0.46, matBigBagCostura);

  const cuello = new THREE.Mesh(
    new THREE.CylinderGeometry(ancho * 0.10, ancho * 0.15, alto * 0.19, 12),
    matBigBagCuerpo
  );
  cuello.position.set(0, alto * 0.46, 0);
  cuello.castShadow = true;
  cuello.receiveShadow = true;
  grupo.add(cuello);

  const nudo = new THREE.Mesh(
    new THREE.CylinderGeometry(ancho * 0.05, ancho * 0.072, alto * 0.07, 10),
    matBigBagTapa
  );
  nudo.position.set(0, alto * 0.58, 0);
  nudo.castShadow = true;
  nudo.receiveShadow = true;
  grupo.add(nudo);

  const cintaAncho = 0.06;
  const cintaProf = 0.028;
  const cintaX = ancho * 0.36;
  // Cintas apoyadas en las paredes del saco y unidas al asa superior.
  // Ningún tramo queda flotando encima de la bolsa.
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      prisma(grupo, cintaAncho, alto * 0.79, cintaProf, sx * cintaX,
        -alto * 0.015, sz * fondo * 0.48, matBigBagAsa);
      prisma(grupo, cintaAncho, alto * 0.16, cintaProf, sx * cintaX,
        alto * 0.38, sz * fondo * 0.48, matBigBagAsa);
    }
    prisma(grupo, cintaAncho, cintaProf, fondo * 0.99,
      sx * cintaX, alto * 0.465, 0, matBigBagAsa);
  }

  for (const sx of [-1, 1]) {
    prisma(grupo, 0.016, alto * 0.78, 0.016, sx * ancho * 0.25, -alto * 0.02, 0, matBigBagCostura);
    prisma(grupo, 0.016, alto * 0.78, 0.016, sx * ancho * 0.40, -alto * 0.02, 0, matBigBagCostura);
  }
  prisma(grupo, ancho * 0.90, 0.014, 0.014, 0, -alto * 0.34, -fondo * 0.44, matBigBagCostura);
  prisma(grupo, ancho * 0.90, 0.014, 0.014, 0, -alto * 0.34, fondo * 0.44, matBigBagCostura);

  padre.add(grupo);
  return grupo;
}

function crearPalletConRollosEtiquetas(padre, x, centroY, fondoRack) {
  const grupo = new THREE.Group();
  grupo.position.set(x, centroY - 0.09, 0);
  const ancho = CFG.anchoCelda * 0.80;
  const fondo = fondoRack * 0.72;
  crearPalletPlasticoAzul(grupo, -0.42, ancho, fondo);

  const coloresRollos = [0xc01e2d, 0x232323, 0x2fa54a, 0xf3b52f, 0x4a6fd8, 0xffffff, 0xeb6d23, 0x7c44c6];
  const blancosMat = new THREE.MeshStandardMaterial({ color: 0xf6f6f6, roughness: 0.92, metalness: 0.0 });
  const radio = 0.115;
  const altoRollo = 0.19;
  let idx = 0;
  const filasZ = [-fondo * 0.165, fondo * 0.165];
  const colsX = [-ancho * 0.225, 0, ancho * 0.225];
  // Piso del primer rollo apoyado sobre el pallet; segunda capa apoyada en la primera.
  for (const nivelY of [-0.12, 0.07]) {
    for (const z of filasZ) {
      for (const xLocal of colsX) {
        const colorLateral = coloresRollos[idx % coloresRollos.length];
        const lateral = new THREE.MeshStandardMaterial({ color: colorLateral, roughness: 0.78, metalness: 0.0 });
        const rollo = new THREE.Mesh(
          new THREE.CylinderGeometry(radio, radio, altoRollo, 26, 1, false),
          [lateral, blancosMat, blancosMat]
        );
        rollo.position.set(xLocal, nivelY, z);
        rollo.castShadow = true;
        rollo.receiveShadow = true;
        grupo.add(rollo);

        const nucleo = new THREE.Mesh(
          new THREE.CylinderGeometry(radio * 0.34, radio * 0.34, altoRollo * 1.03, 18),
          new THREE.MeshStandardMaterial({ color: 0xd9d1c0, roughness: 1.0, metalness: 0.0 })
        );
        nucleo.position.copy(rollo.position);
        nucleo.castShadow = true;
        nucleo.receiveShadow = true;
        grupo.add(nucleo);
        idx += 1;
      }
    }
  }
  padre.add(grupo);
  return grupo;
}

function crearPalletConRollosSachet(padre, x, centroY, fondoRack) {
  const grupo = new THREE.Group();
  grupo.position.set(x, centroY - 0.09, 0);
  const ancho = CFG.anchoCelda * 0.82;
  const fondo = fondoRack * 0.74;
  crearPalletPlasticoAzul(grupo, -0.42, ancho, fondo);

  const coloresSachet = [0xd63031, 0xf39c12, 0x16a085, 0x8e44ad, 0x2e86de, 0x27ae60, 0xe67e22, 0xc0392b];
  const bordeMetal = new THREE.MeshStandardMaterial({ color: 0xcfd3d8, roughness: 0.55, metalness: 0.12 });
  const radio = 0.12;
  const altoRollo = 0.30;
  let idx = 0;
  const filasZ = [-fondo * 0.165, fondo * 0.165];
  const colsX = [-ancho * 0.225, 0, ancho * 0.225];
  for (const z of filasZ) {
    for (const xLocal of colsX) {
      const colorLateral = coloresSachet[idx % coloresSachet.length];
      const lateral = new THREE.MeshStandardMaterial({ color: colorLateral, roughness: 0.72, metalness: 0.02 });
      const rollo = new THREE.Mesh(
        new THREE.CylinderGeometry(radio, radio, altoRollo, 28, 1, false),
        [lateral, bordeMetal, bordeMetal]
      );
      rollo.position.set(xLocal, -0.065, z);
      rollo.castShadow = true;
      rollo.receiveShadow = true;
      grupo.add(rollo);

      const nucleo = new THREE.Mesh(
        new THREE.CylinderGeometry(radio * 0.44, radio * 0.44, altoRollo * 1.03, 18),
        new THREE.MeshStandardMaterial({ color: 0xa77e5a, roughness: 1.0, metalness: 0.0 })
      );
      nucleo.position.copy(rollo.position);
      nucleo.castShadow = true;
      nucleo.receiveShadow = true;
      grupo.add(nucleo);
      idx += 1;
    }
  }
  padre.add(grupo);
  return grupo;
}

// Pared perimetral ocre. Abertura en el extremo superior derecho: ENTRADA.
const mitadX = CFG.salaAncho / 2;
const mitadZ = CFG.salaLargo / 2;
const alturaPared = 0.34; // V19: paredes a la mitad de altura
prisma(escena, 0.23, alturaPared, CFG.salaLargo, -mitadX, alturaPared / 2, 0, matPared);
prisma(escena, 0.23, alturaPared, CFG.salaLargo, mitadX, alturaPared / 2, 0, matPared);
// Pared sur con abertura para la salida a exclusa en el extremo inferior derecho.
const comienzoSalidaExclusa = 4.75; // V24: pared sur alargada para alinear mejor con el rack
const largoMuroSur = comienzoSalidaExclusa + mitadX;
prisma(escena, largoMuroSur, alturaPared, 0.23, (-mitadX + comienzoSalidaExclusa) / 2, alturaPared / 2, mitadZ, matPared);
const comienzoEntrada = 4.75; // V24: pared norte alargada para que la entrada concuerde mejor con el largo del rack
const seccionNorte = comienzoEntrada + mitadX;
prisma(escena, seccionNorte, alturaPared, 0.23, (-mitadX + comienzoEntrada) / 2, alturaPared / 2, -mitadZ, matPared);

// Etiquetas 2D en el espacio 3D.
function etiqueta(texto, fondo = "#a34c09", ancho = 1.6, bordeOscuro = false) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = fondo;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (bordeOscuro) {
    ctx.strokeStyle = "#251207";
    ctx.lineWidth = 16;
    ctx.strokeRect(9, 9, canvas.width - 18, canvas.height - 18);
  }
  ctx.fillStyle = "#fff";
  const fontSize = texto.length > 14 ? 44 : texto.length > 10 ? 54 : 68;
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(texto, 256, 81);
  const texture = new THREE.CanvasTexture(canvas);
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, depthWrite: false }));
  sprite.scale.set(ancho, ancho * 160 / 512, 1);
  return sprite;
}

// Señalética industrial pintada sobre el piso (no sprites orientados a la cámara).
// Al pertenecer a la escena mantiene posición y rotación respecto de la bodega.
function senalPiso(texto, ancho = 2.4) {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#323b40";
  ctx.fillRect(0, 0, 1024, 256);
  ctx.strokeStyle = "#e6c14a";
  ctx.lineWidth = 13;
  ctx.strokeRect(11, 11, 1002, 234);
  ctx.fillStyle = "#fff8db";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = texto.length > 10 ? "bold 89px Arial" : "bold 122px Arial";
  ctx.fillText(texto, 512, 132, 928);
  const textura = new THREE.CanvasTexture(canvas);
  textura.colorSpace = THREE.SRGBColorSpace;
  const malla = new THREE.Mesh(
    new THREE.PlaneGeometry(ancho, ancho / 4),
    new THREE.MeshBasicMaterial({ map: textura, side: THREE.DoubleSide, depthWrite: false })
  );
  malla.rotation.x = -Math.PI / 2;
  malla.renderOrder = 2;
  return malla;
}

const entrada = senalPiso("ENTRADA", 1.9);
// Centro geométrico del acceso: entre el extremo del muro norte y la pared lateral derecha.
entrada.position.set((comienzoEntrada + mitadX) / 2, -0.065, -mitadZ + 0.30);
escena.add(entrada);
const salidaExclusa = senalPiso("SALIDA A EXCLUSA", 2.65);
// Desplazado al pasillo lateral derecho, fuera del volumen del Rack 05.
salidaExclusa.position.set(6.35, -0.065, mitadZ - 0.43);
escena.add(salidaExclusa);

const grupos = new Map();
const visuales3d = new Map();
const ubicacionPorCodigo = new Map(ubicaciones.map(u => [u.codigo, u]));
const blancos = [];
let marcador = null;
const marcadoresBusqueda = [];
const geometriaBusqueda = new THREE.BoxGeometry(CFG.anchoCelda - 0.04, CFG.altoCelda - 0.04, CFG.profundidad + 0.19);
const bordesBusqueda = new THREE.EdgesGeometry(geometriaBusqueda);
geometriaBusqueda.dispose();
const materialBusqueda = new THREE.LineBasicMaterial({color: 0xffd11a, depthTest: false});
let seleccionActual = null;

function prepararGrupoTransparente(grupo) {
  if (!grupo) return grupo;
  const materiales = new Set();
  grupo.traverse(objeto => {
    if (!objeto.material) return;
    if (Array.isArray(objeto.material)) {
      objeto.material = objeto.material.map(material => {
        const clon = material.clone();
        clon.transparent = true;
        materiales.add(clon);
        return clon;
      });
    } else {
      const clon = objeto.material.clone();
      clon.transparent = true;
      objeto.material = clon;
      materiales.add(clon);
    }
  });
  grupo.userData.materialesTransparencia = [...materiales];
  return grupo;
}

function aplicarOpacidadGrupo(grupo, opacidad = 1) {
  if (!grupo?.userData?.materialesTransparencia) return;
  grupo.userData.materialesTransparencia.forEach(material => {
    material.opacity = opacidad;
    material.depthWrite = opacidad >= 0.95;
  });
}

function actualizarTransparenciaBusqueda3D(codigosCoincidentes, buscando) {
  const hayBusquedaActiva = buscando && codigosCoincidentes.size > 0;
  visuales3d.forEach((grupo, codigo) => {
    if (!grupo) return;
    const opacidad = !hayBusquedaActiva ? 1 : (codigosCoincidentes.has(codigo) ? 1 : 0.20);
    aplicarOpacidadGrupo(grupo, opacidad);
  });
}

function crearRack(plano) {
  const g = new THREE.Group();
  g.position.set(plano.x, 0, plano.z);
  g.userData.codigo = plano.codigo;
  const largo = CFG.columnas * CFG.anchoCelda;
  const alto = CFG.niveles * CFG.altoCelda;
  const fondo = CFG.profundidad;

  // 8 pares de postes naranjos = 7 espacios horizontales.
  for (let i = 0; i <= CFG.columnas; i++) {
    const x = -largo / 2 + i * CFG.anchoCelda;
    for (const z of [-fondo / 2, fondo / 2]) {
      prisma(g, 0.075, alto + 0.15, 0.075, x, alto / 2, z, matEstructura);
    }
  }
  // 4 bandejas (piso y cierre de cada nivel).
  for (let n = 0; n <= CFG.niveles; n++) {
    prisma(g, largo + 0.1, 0.08, fondo, 0, n * CFG.altoCelda, 0, matBandeja);
    for (const z of [-fondo / 2, fondo / 2]) {
      prisma(g, largo + 0.1, 0.11, 0.085, 0, n * CFG.altoCelda, z, matVigas);
    }
  }
  for (let n = 1; n <= CFG.niveles; n++) {
    for (let p = 1; p <= CFG.columnas; p++) {
      const codigo = `${plano.codigo}-N${n}-P${String(p).padStart(2, "0")}`;
      const datos = ubicaciones.find(u => u.codigo === codigo);
      const x = -largo / 2 + (p - 0.5) * CFG.anchoCelda;
      const y = (n - 0.5) * CFG.altoCelda;
      let visual3d = null;
      if (datos.estado === "Ocupado") {
        if (datos.tipo3d === "rollos_etiquetas") visual3d = crearPalletConRollosEtiquetas(g, x, y - 0.03, fondo);
        else if (datos.tipo3d === "rollos_sachet") visual3d = crearPalletConRollosSachet(g, x, y - 0.03, fondo);
        else visual3d = crearBigBag(g, x, y - 0.03, fondo);
        prepararGrupoTransparente(visual3d);
      }
      visuales3d.set(codigo, visual3d);
      // Las ubicaciones vacías no llevan aristas visibles en 3D.
      // Caja invisible seleccionable desde arriba, frente o perspectiva.
      const hitbox = new THREE.Mesh(
        new THREE.BoxGeometry(CFG.anchoCelda - 0.10, CFG.altoCelda - 0.1, fondo - 0.08),
        new THREE.MeshBasicMaterial({ visible: false })
      );
      hitbox.position.set(x, y, 0);
      hitbox.userData.codigo = codigo;
      g.add(hitbox);
      blancos.push(hitbox);
    }
  }
  const titulo = etiqueta(`Rack ${String(Number(plano.codigo.slice(1))).padStart(2, "0")}`, "#64310f", 2.6, true);
  titulo.position.set(0, alto + 0.48, 0);
  g.add(titulo);
  escena.add(g);
  grupos.set(plano.codigo, g);
}
PLANO.forEach(crearRack);

// Pasillos según imagen: entre pares y entre bloques.
// La zona libre superior sirve como pasillo de entrada.

function moverCamara(tipo = "3d", rackCodigo = null) {
  const objetivo = rackCodigo ? grupos.get(rackCodigo).position : new THREE.Vector3(0, 0, 0);
  const tx = objetivo.x;
  const tz = objetivo.z;
  const zCerca = rackCodigo ? 10 : 22;
  if (tipo === "superior") {
    camara.position.set(tx, rackCodigo ? 12 : 27, tz + 0.015);
  } else if (tipo === "frontal") {
    camara.position.set(tx, 7.5, tz + zCerca);
  } else {
    camara.position.set(tx + (rackCodigo ? 6.8 : 16), rackCodigo ? 6.8 : 19, tz + (rackCodigo ? 10 : 23));
  }
  controls.target.set(tx, rackCodigo ? 1.6 : 0, tz);
  controls.update();
}
moverCamara("3d");

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let punteroInicio = null;
renderer.domElement.addEventListener("pointerdown", e => {
  punteroInicio = { x: e.clientX, y: e.clientY };
});
renderer.domElement.addEventListener("pointerup", e => {
  if (!punteroInicio) return;
  const distancia = Math.hypot(e.clientX - punteroInicio.x, e.clientY - punteroInicio.y);
  punteroInicio = null;
  if (distancia > 6) return;
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
  raycaster.setFromCamera(mouse, camara);
  const visibles = blancos;
  const encontrados = raycaster.intersectObjects(visibles, false);
  if (encontrados.length) seleccionar(encontrados[0].object.userData.codigo);
});

const campoCodigo = document.querySelector("#selectedCode");
const panel = document.querySelector("#detailsContent");

function fila(etiqueta, valor) {
  const div = document.createElement("div");
  div.className = "info-row";
  const nombre = document.createElement("span");
  nombre.textContent = etiqueta;
  const dato = document.createElement("strong");
  dato.textContent = valor ?? "—";
  div.append(nombre, dato);
  return div;
}

function borrarMarcador() {
  if (!marcador) return;
  marcador.parent.remove(marcador);
  marcador.geometry.dispose();
  marcador.material.dispose();
  marcador = null;
}

function seleccionar(codigo) {
  const datos = ubicacionPorCodigo.get(codigo);
  const hitbox = blancos.find(b => b.userData.codigo === codigo);
  if (!datos || !hitbox) return;
  seleccionActual = datos;
  campoCodigo.textContent = `RACK ${Number(datos.rack.slice(1))} - NIVEL ${datos.nivel} - POSICIÓN ${datos.posicion}`;
  panel.replaceChildren();
  panel.appendChild(fila("Posición", `${datos.rack} · ${String(datos.posicion).padStart(2, "0")}`));
  panel.appendChild(fila("Nivel", datos.nivel));

  if (!datos.productos.length) {
    panel.appendChild(fila("Código del producto", "—"));
    panel.appendChild(fila("Nombre del producto", "Ubicación vacía"));
    panel.appendChild(fila("Cantidad", "0"));
  } else if (datos.productos.length === 1) {
    const producto = datos.productos[0];
    panel.appendChild(fila("Código del producto", producto.sku));
    panel.appendChild(fila("Nombre del producto", producto.nombre));
    panel.appendChild(fila("Cantidad", `${producto.cantidad} ${producto.unidad}`));
  } else {
    datos.productos.forEach((producto, indice) => {
      const tarjeta = document.createElement("div");
      tarjeta.className = "product-detail";
      const titulo = document.createElement("h3");
      titulo.textContent = `Producto ${indice + 1} de ${datos.productos.length}`;
      tarjeta.append(titulo,
        fila("Código del producto", producto.sku),
        fila("Nombre del producto", producto.nombre),
        fila("Cantidad", `${producto.cantidad} ${producto.unidad}`));
      panel.appendChild(tarjeta);
    });
  }
  borrarMarcador();
  const geometria = new THREE.BoxGeometry(CFG.anchoCelda - 0.07, CFG.altoCelda - 0.07, CFG.profundidad + 0.16);
  const bordes = new THREE.EdgesGeometry(geometria);
  geometria.dispose();
  marcador = new THREE.LineSegments(bordes, new THREE.LineBasicMaterial({ color: COLOR.seleccionado, depthTest: false }));
  marcador.renderOrder = 25;
  marcador.position.copy(hitbox.position);
  hitbox.parent.add(marcador);
  document.querySelectorAll(".slot.selected").forEach(el => el.classList.remove("selected"));
  const celda2d = document.querySelector(`.slot[data-codigo="${codigo}"]`);
  if (celda2d) celda2d.classList.add("selected");
}

function resumen() {
  const ocupadas = ubicaciones.filter(u => u.estado === "Ocupado").length;
  document.querySelector("#totalSlots").textContent = ubicaciones.length;
  document.querySelector("#occupiedSlots").textContent = ocupadas;
  document.querySelector("#emptySlots").textContent = ubicaciones.length - ocupadas;
  const porcentaje = Math.round(ocupadas / ubicaciones.length * 100);
  document.querySelector("#occupancyBar").style.width = porcentaje + "%";
  document.querySelector("#occupancyText").textContent = `Ocupación: ${porcentaje}%`;
}

// Una sola distribución: cambia únicamente la representación 2D/3D.
const mapa2d = document.querySelector("#map2d");
function construirTarjetaRack(id) {
  const card = document.createElement("section");
  card.className = "rack-card";
  const nombre = document.createElement("h3");
  nombre.textContent = `RACK ${String(Number(id.slice(1))).padStart(2, "0")}`;
  card.append(nombre);
  const cabecera = document.createElement("div");
  cabecera.className = "rack-header";
  cabecera.append(document.createElement("span"));
  for (let p = 1; p <= CFG.columnas; p++) {
    const numero = document.createElement("span");
    numero.textContent = String(p).padStart(2, "0");
    cabecera.append(numero);
  }
  card.append(cabecera);
  for (let n = CFG.niveles; n >= 1; n--) {
    const fila = document.createElement("div");
    fila.className = "rack-row";
    const nivel = document.createElement("span");
    nivel.className = "level-label";
    nivel.textContent = `N${n}`;
    fila.append(nivel);
    for (let pos = 1; pos <= CFG.columnas; pos++) {
      const codigo = `${id}-N${n}-P${String(pos).padStart(2, "0")}`;
      const u = ubicacionPorCodigo.get(codigo);
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = `slot ${u.estado === "Ocupado" ? "occupied" : ""}`;
      boton.dataset.codigo = codigo;
      boton.textContent = String(pos).padStart(2, "0");
      boton.title = `${codigo} · ${u.productos.length ? u.productos.map(p => p.nombre).join(", ") : "Vacío"}`;
      boton.setAttribute("aria-label", boton.title);
      boton.addEventListener("click", () => seleccionar(codigo));
      fila.append(boton);
    }
    card.append(fila);
  }
  return card;
}
// La vista plana representa cada rectángulo del plano original como un rack
// completo (7 posiciones por 3 niveles), no como dos racks lado a lado.
function pasilloPlano(texto) {
  const el = document.createElement("div");
  el.className = "warehouse-aisle";
  el.textContent = texto;
  return el;
}
function construirPlano() {
  mapa2d.replaceChildren();
  const marco = document.createElement("div");
  marco.className = "warehouse-plan";
  const entrada = document.createElement("div");
  entrada.className = "warehouse-entrance";
  entrada.textContent = "ENTRADA ↑";
  marco.append(entrada);
  const salida = document.createElement("div");
  salida.className = "warehouse-exit";
  salida.textContent = "SALIDA A EXCLUSA";
  marco.append(pasilloPlano("PASILLO SUPERIOR"));

  const central = document.createElement("div");
  central.className = "warehouse-inner";
  const lateralIzq = document.createElement("div");
  lateralIzq.className = "warehouse-side side-left";
  lateralIzq.textContent = "PASILLO";
  const lateralDer = document.createElement("div");
  lateralDer.className = "warehouse-side side-right";
  lateralDer.textContent = "PASILLO";
  const racks = document.createElement("div");
  racks.className = "warehouse-racks";
  ["R01", "R02", "R03", "R04", "R05"].forEach((id, index) => {
    if (index === 2 || index === 4) racks.append(pasilloPlano("PASILLO"));
    const tarjeta = construirTarjetaRack(id);
    tarjeta.classList.add("warehouse-rack");
    if (index === 4) tarjeta.classList.add("rack-against-wall");
    racks.append(tarjeta);
  });
  central.append(lateralIzq, racks, lateralDer);
  marco.append(central, salida);
  mapa2d.append(marco);
}
construirPlano();
// Zoom 2D relativo al tamaño que cabe en pantalla; admite rueda y botones.
const controlesZoom2d = document.querySelector("#zoom2dControls");
const valorZoom2d = document.querySelector("#zoom2dValue");
let factorZoom2d = 1;
let desplazamiento2dX = 0;
let desplazamiento2dY = 0;
let arrastre2d = null;
const MIN_ZOOM_2D = 0.5;
const MAX_ZOOM_2D = 3;
function ajustarPlano() {
  if (mapa2d.hidden) return;
  const plano = mapa2d.querySelector(".warehouse-plan");
  if (!plano) return;
  plano.style.transform = "none";
  const escalaBase = Math.min(
    1.35,
    (mapa2d.clientWidth - 12) / plano.offsetWidth,
    (mapa2d.clientHeight - 12) / plano.offsetHeight
  );
  plano.style.transform = `translate(${desplazamiento2dX}px, ${desplazamiento2dY}px) scale(${Math.max(0.1, escalaBase) * factorZoom2d})`;
  valorZoom2d.textContent = `${Math.round(factorZoom2d * 100)}%`;
}
function cambiarZoom2d(nuevo) {
  factorZoom2d = Math.max(MIN_ZOOM_2D, Math.min(MAX_ZOOM_2D, nuevo));
  ajustarPlano();
}
document.querySelector("#zoom2dIn").addEventListener("click", () => cambiarZoom2d(factorZoom2d + 0.2));
document.querySelector("#zoom2dOut").addEventListener("click", () => cambiarZoom2d(factorZoom2d - 0.2));
document.querySelector("#zoom2dReset").addEventListener("click", () => {
  desplazamiento2dX = 0;
  desplazamiento2dY = 0;
  cambiarZoom2d(1);
});
mapa2d.addEventListener("wheel", e => {
  e.preventDefault();
  cambiarZoom2d(factorZoom2d + (e.deltaY < 0 ? 0.12 : -0.12));
}, { passive: false });
// Arrastrar desde el fondo o un pasillo (no desde celdas ni controles).
// El movimiento se mantiene al usar zoom o cambiar de vista.
mapa2d.addEventListener("pointerdown", e => {
  if (e.button !== 0 || e.target.closest(".slot, button, input, a")) return;
  arrastre2d = {
    id: e.pointerId, x: e.clientX, y: e.clientY,
    origenX: desplazamiento2dX, origenY: desplazamiento2dY
  };
  mapa2d.setPointerCapture(e.pointerId);
  mapa2d.classList.add("arrastrando");
});
mapa2d.addEventListener("pointermove", e => {
  if (!arrastre2d || e.pointerId !== arrastre2d.id) return;
  desplazamiento2dX = arrastre2d.origenX + e.clientX - arrastre2d.x;
  desplazamiento2dY = arrastre2d.origenY + e.clientY - arrastre2d.y;
  ajustarPlano();
});
function terminarArrastre2d(e) {
  if (!arrastre2d || e.pointerId !== arrastre2d.id) return;
  arrastre2d = null;
  mapa2d.classList.remove("arrastrando");
  if (mapa2d.hasPointerCapture(e.pointerId)) mapa2d.releasePointerCapture(e.pointerId);
}
mapa2d.addEventListener("pointerup", terminarArrastre2d);
mapa2d.addEventListener("pointercancel", terminarArrastre2d);
mapa2d.addEventListener("lostpointercapture", () => {
  arrastre2d = null;
  mapa2d.classList.remove("arrastrando");
});
new ResizeObserver(() => requestAnimationFrame(ajustarPlano)).observe(mapa2d);

function cambiarVista(modo) {
  const esPlano = modo === "2d";
  mapa2d.hidden = !esPlano;
  controlesZoom2d.hidden = !esPlano;
  contenedor.hidden = esPlano;
  document.querySelector("#view3d").classList.toggle("active", !esPlano);
  document.querySelector("#view2d").classList.toggle("active", esPlano);
  document.querySelector("#view3d").setAttribute("aria-pressed", String(!esPlano));
  document.querySelector("#view2d").setAttribute("aria-pressed", String(esPlano));
  document.querySelector("#sceneLabel").textContent = esPlano ? "BODEGA · VISTA 2D" : "BODEGA · VISTA 3D";
  if (!esPlano) { moverCamara("3d"); requestAnimationFrame(ajustar); }
  else requestAnimationFrame(ajustarPlano);
}
document.querySelector("#view3d").addEventListener("click", () => cambiarVista("3d"));
document.querySelector("#view2d").addEventListener("click", () => cambiarVista("2d"));

// Búsqueda global: producto, SKU, rack, nivel, posición, código.
const buscador = document.querySelector("#searchInput");
const resultados = document.querySelector("#searchResults");
const estadoBusqueda = document.querySelector("#searchStatus");
const normalizar = texto => String(texto ?? "").normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
function coincide(u, consulta) {
  const texto = normalizar([u.codigo, u.rack, u.zona,
    `nivel ${u.nivel}`, `n${u.nivel}`, `posicion ${u.posicion}`,
    `p${String(u.posicion).padStart(2, "0")}`, u.estado,
    ...u.productos.flatMap(p => [p.sku, p.nombre])].join(" "));
  return texto.includes(normalizar(consulta));
}
function limpiarMarcadoresBusqueda() {
  for (const objeto of marcadoresBusqueda) objeto.parent.remove(objeto);
  marcadoresBusqueda.length = 0;
}
function resaltarCoincidencias(encontrados, buscando) {
  const codigos = new Set(encontrados.map(u => u.codigo));
  document.querySelectorAll(".slot").forEach(b => {
    const ok = codigos.has(b.dataset.codigo);
    b.classList.toggle("dim", buscando && !ok);
    b.classList.toggle("match", buscando && ok);
  });
  actualizarTransparenciaBusqueda3D(codigos, buscando);
  limpiarMarcadoresBusqueda();
  if (!buscando) return;
  for (const hitbox of blancos) {
    if (!codigos.has(hitbox.userData.codigo)) continue;
    const linea = new THREE.LineSegments(bordesBusqueda, materialBusqueda);
    linea.position.copy(hitbox.position);
    linea.renderOrder = 22;
    hitbox.parent.add(linea);
    marcadoresBusqueda.push(linea);
  }
}
function actualizarBusqueda() {
  const q = buscador.value.trim();
  const encontrados = q ? ubicaciones.filter(u => coincide(u, q)) : [];
  resultados.replaceChildren();
  resultados.hidden = !q || !encontrados.length;
  resaltarCoincidencias(encontrados, Boolean(q));
  if (!q) {
    estadoBusqueda.textContent = "Busca por producto, SKU, posición, rack o nivel.";
    return;
  }
  estadoBusqueda.textContent = `${encontrados.length} ubicaciones encontradas; resaltadas en amarillo en ambas vistas.`;
  for (const u of encontrados.slice(0, 30)) {
    const boton = document.createElement("button");
    boton.type = "button";
    boton.textContent = u.codigo;
    const nombre = document.createElement("small");
    const relevantes = u.productos.filter(p => normalizar(`${p.sku} ${p.nombre}`).includes(normalizar(q)));
    nombre.textContent = (relevantes.length ? relevantes : u.productos).map(p => p.nombre).join(" · ") || "Vacío";
    boton.append(nombre);
    boton.addEventListener("click", () => {
      seleccionar(u.codigo);
      // Oculta el menú de sugerencias después de elegir el resultado.
      resultados.hidden = true;
      buscador.blur();
      if (!contenedor.hidden) {
        const grupo = grupos.get(u.rack);
        controls.target.set(grupo.position.x, 1.8, grupo.position.z);
        camara.position.set(grupo.position.x + 7, 6.5, grupo.position.z + 10);
        controls.update();
      }
    });
    resultados.append(boton);
  }
  if (encontrados.length > 30) {
    const aviso = document.createElement("span");
    aviso.textContent = `Mostrando 30 de ${encontrados.length}. Especifica tu búsqueda.`;
    resultados.append(aviso);
  }
}
buscador.addEventListener("input", actualizarBusqueda);
document.querySelector("#clearSearch").addEventListener("click", () => {
  buscador.value = "";
  actualizarBusqueda();
  buscador.focus();
});

function ajustar() {
  const w = contenedor.clientWidth;
  const h = contenedor.clientHeight;
  if (!w || !h) return;
  camara.aspect = w / h;
  camara.updateProjectionMatrix();
  renderer.setSize(w, h);
}
new ResizeObserver(ajustar).observe(contenedor);
function animar() {
  requestAnimationFrame(animar);
  controls.update();
  renderer.render(escena, camara);
}
resumen();
ajustar();
animar();
// Mostrar las ubicaciones vacías hasta verificar la API.
actualizarVistaDatos(ubicaciones.map(u => ({codigo:u.codigo, tipo3d:"vacio", productos:[]})));


// WAREMAP - API REST de Supabase (consulta solamente)
const API_CONFIG = {url: "https://sojbbddtapskbpzrwdpw.supabase.co", publishableKey: "sb_publishable_fbJ11a4FTt6VMbcDnr0mGw_smq0Lq5m"};
const API_INTERVALO_MS = 15000;
const estadoConexion = document.querySelector(".header-status");
const piePagina = document.querySelector(".footer");
let consultaEnCurso = false;
let datosRemotosRecibidos = false;

function actualizarVistaDatos(remotos) {
  const indices = new Map(remotos.map(u => [u.codigo, u]));
  for (const local of ubicaciones) {
    const remoto = indices.get(local.codigo);
    if (!remoto) continue;
    const productos = Array.isArray(remoto.productos) ? remoto.productos.map(p => ({
      sku: String(p.sku ?? ""), nombre: String(p.nombre ?? ""),
      cantidad: Number(p.cantidad ?? 0), unidad: String(p.unidad ?? "Un.")
    })) : [];
    local.productos = productos;
    local.producto = productos[0] ?? null;
    local.estado = productos.length ? "Ocupado" : "Vacío";
    local.tipo3d = productos.length ? (remoto.tipo3d === "rollos_etiquetas" || remoto.tipo3d === "rollos_sachet" ? remoto.tipo3d : "big_bag") : "vacio";
    const anterior = visuales3d.get(local.codigo);
    if (anterior) {
      anterior.parent?.remove(anterior);
      anterior.traverse(obj => {obj.geometry?.dispose?.();});
    }
    const hitbox = blancos.find(b => b.userData.codigo === local.codigo);
    if (!hitbox) continue;
    let visual = null;
    if (productos.length) {
      const x = hitbox.position.x;
      const y = hitbox.position.y - 0.03;
      const padre = hitbox.parent;
      if (local.tipo3d === "rollos_etiquetas") visual = crearPalletConRollosEtiquetas(padre, x, y, CFG.profundidad);
      else if (local.tipo3d === "rollos_sachet") visual = crearPalletConRollosSachet(padre, x, y, CFG.profundidad);
      else visual = crearBigBag(padre, x, y, CFG.profundidad);
      prepararGrupoTransparente(visual);
    }
    visuales3d.set(local.codigo, visual);
  }
  document.querySelectorAll(".slot").forEach(celda => {
    const u = ubicacionPorCodigo.get(celda.dataset.codigo);
    if (!u) return;
    celda.classList.toggle("occupied", u.estado === "Ocupado");
    celda.title = `${u.codigo} · ${u.productos.map(p => p.nombre).join(", ") || "Vacío"}`;
    celda.setAttribute("aria-label", celda.title);
  });
  resumen();
  if (seleccionActual) seleccionar(seleccionActual.codigo);
  actualizarBusqueda();
}

async function consultarAPI() {
  if (consultaEnCurso) return;
  if (API_CONFIG.url.startsWith("REEMPLAZAR_") || API_CONFIG.publishableKey.startsWith("REEMPLAZAR_")) {
    estadoConexion.textContent = "API pendiente de configurar";
    piePagina.textContent = "WAREMAP · Configura Supabase para cargar datos online";
    return;
  }
  consultaEnCurso = true;
  try {
    const url = `${API_CONFIG.url.replace(/\/$/, "")}/rest/v1/ubicaciones?select=codigo,tipo3d,productos&order=codigo.asc&limit=200`;
    const respuesta = await fetch(url, {headers: {apikey: API_CONFIG.publishableKey, Accept: "application/json"}, cache: "no-store"});
    if (!respuesta.ok) throw new Error(`HTTP ${respuesta.status}: ${await respuesta.text()}`);
    const datos = await respuesta.json();
    if (!Array.isArray(datos) || datos.length !== 105) throw new Error(`Se esperaban 105 ubicaciones y se recibieron ${datos.length}`);
    // Evita reconstruir toda la maqueta si la base no cambió.
    const firma = JSON.stringify(datos);
    if (firma !== consultarAPI.ultimaFirma) {
      actualizarVistaDatos(datos);
      consultarAPI.ultimaFirma = firma;
    }
    datosRemotosRecibidos = true;
    estadoConexion.textContent = "● Datos online";
    piePagina.textContent = "WAREMAP · Consulta de ubicaciones online · 2026";
  } catch (error) {
    console.error("WAREMAP: error de conexión REST", error);
    estadoConexion.textContent = "⚠ Error de conexión";
    piePagina.textContent = datosRemotosRecibidos ? "WAREMAP · Últimos datos online disponibles" : "WAREMAP · No hay datos online disponibles";
    if (!datosRemotosRecibidos) {
      // Por seguridad no mostrar datos de ejemplo como si fueran datos reales.
      actualizarVistaDatos(ubicaciones.map(u => ({codigo:u.codigo, tipo3d:"vacio", productos:[]})));
    }
  } finally { consultaEnCurso = false; }
}
consultarAPI();
setInterval(consultarAPI, API_INTERVALO_MS);
