const ramos = {
  "Morfología": ["Morfología II"],
  "GIS": ["GIS II"],
  "Fundamentos de los procesos moleculares": ["Fundamentos de los procesos moleculares II"],
  "Fundamentos de los procesos moleculares II": [
    "Microbiologia I",
    "Inmunologia I",
    "Fundamentos biológicos de los procesos funcionales, sus alteraciones  y farmacología"
  ],
  "Física": ["Principios fundamentales de la instrumentación"],
  "GIS II": ["GIS III"],
  "Principios fundamentales de la instrumentación": ["Bioquímica clínica I"],
  "Fundamentos biológicos de los procesos funcionales, sus alteraciones  y farmacología": ["Bioquímica clínica I", "Parasitologia I"],
  "GIS III": ["GIS IV"],
  "GIS IV": ["Investigación I", "Enfermedades prioritarias. Aspectos legales"],
  "Bioquímica clínica I": ["Bioquímica clínica II"],
  "Parasitologia I": ["Parasitologia II"],
  "Inmunologia I": ["Hematologia I"],
  "Sistema digestivo": ["Microbiologia I"],
  "Bioquímica clínica II": ["Bioquímica clínica III"],
  "Hematologia I": ["Hematologia II"],
  "Hematologia II": ["Banco de sangre I"],
  "Sistema cardiovascular": ["Enfermedades prioritarias. Aspectos legales"],
  "Investigación I": ["Investigación II"],
  "Microbiologia I": ["Microbiologia II"],
  "Sistema inmune": ["Enfermedades prioritarias. Aspectos legales"],
  "Seminario de gestión e investigación I": ["Seminario de gestión e investigación II"],
  "Banco de sangre I": ["Banco de sangre II"],
  "Seminario de gestión e investigación II": ["Práctica profesional"],
  "Banco de sangre II": ["Práctica profesional"],
  "Enfermedades prioritarias. Aspectos legales": ["Práctica profesional"]
};

const semestres = [
  ["Morfología", "GIS", "Fundamentos de los procesos moleculares", "Química", "Matemáticas", "Introducción a tm"],
  ["GIS II", "Morfología II", "Fundamentos de los procesos moleculares II", "Física"],
  ["GIS III", "Formación efectivo", "Fundamentos biológicos de los procesos funcionales, sus alteraciones  y farmacología", "Principios fundamentales de la instrumentación"],
  ["GIS IV", "Sistema genito-urinario", "Bioquímica clínica I", "Parasitologia I", "Inmunologia I"],
  ["Sistema digestivo", "Bioquímica clínica II", "Hematologia I", "Formación de electivo"],
  ["Sistema cardiovascular", "Investigación I", "Bioquímica clínica III", "Hematologia II"],
  ["Sistema endocrino y reproductor", "Investigación II", "Parasitologia II", "Microbiologia I"],
  ["Sistema inmune", "Seminario de gestión e investigación I"]
];

// Para invertir la relación: saber qué requisitos tiene cada ramo
// No solo qué depende de él
const requisitosPorRamo = {};

// Construimos requisitosPorRamo
for (const [padre, hijos] of Object.entries(ramos)) {
  hijos.forEach(hijo => {
    if (!requisitosPorRamo[hijo]) requisitosPorRamo[hijo] = [];
    requisitosPorRamo[hijo].push(padre);
  });
}

// Estado de ramos aprobados
let ramosAprobados = JSON.parse(localStorage.getItem("ramosAprobados") || "[]");

// Función para saber si un ramo está desbloqueado (todos sus requisitos aprobados o no tiene requisitos)
function estaDesbloqueado(ramo) {
  const requisitos = requisitosPorRamo[ramo];
  if (!requisitos || requisitos.length === 0) return true;
  return requisitos.every(req => ramosAprobados.includes(req));
}

// Función para renderizar la malla
function renderizarMalla() {
  const contenedor = document.getElementById("malla");
  contenedor.innerHTML = "";

  semestres.forEach((semestre, i) => {
    // Crear separador semestre
    const sep = document.createElement("h2");
    sep.textContent = `Semestre ${i + 1}`;
    sep.className = "semestre-separador";
    contenedor.appendChild(sep);

    // Contenedor de ramos semestre
    const divSemestre = document.createElement("div");
    divSemestre.className = "semestre";

    semestre.forEach(ramo => {
      const btn = document.createElement("button");
      btn.textContent = ramo;
      btn.className = "ramo";

      // Estado aprobado o no
      if (ramosAprobados.includes(ramo)) {
        btn.classList.add("aprobado");
        btn.disabled = false;
      } else if (estaDesbloqueado(ramo)) {
        btn.classList.remove("aprobado");
        btn.disabled = false;
      } else {
        btn.disabled = true;
      }

      btn.onclick = () => {
        if (!btn.disabled) {
          toggleAprobado(ramo);
          renderizarMalla();
        }
      };

      divSemestre.appendChild(btn);
    });

    contenedor.appendChild(divSemestre);
  });
}

// Función para alternar estado aprobado
function toggleAprobado(ramo) {
  if (ramosAprobados.includes(ramo)) {
    // Desaprobar
    ramosAprobados = ramosAprobados.filter(r => r !== ramo);
  } else {
    // Aprobar
    if (estaDesbloqueado(ramo)) {
      ramosAprobados.push(ramo);
    }
  }
  localStorage.setItem("ramosAprobados", JSON.stringify(ramosAprobados));
}

window.onload = () => {
  renderizarMalla();
};
