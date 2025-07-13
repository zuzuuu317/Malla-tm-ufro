
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
  ["Sistema inmune", "Seminario de gestión e investigación I", "Banco de sangre I", "Microbiologia I"],
  ["Seminario de gestión e investigación II", "Banco de sangre II", "Enfermedades prioritarias. Aspectos legales"],
  ["Práctica profesional"]
];

const mallaContainer = document.getElementById("malla");
const estado = {};

function crearMalla() {
  semestres.forEach((ramosSemestre, semestreIndex) => {
    ramosSemestre.forEach(ramo => {
      const div = document.createElement("div");
      div.className = "ramo bloqueado";
      div.innerText = ramo;
      div.dataset.nombre = ramo;
      div.dataset.semestre = semestreIndex + 1;
      div.addEventListener("click", () => aprobarRamo(ramo));
      mallaContainer.appendChild(div);
      estado[ramo] = {
        aprobado: false,
        elemento: div,
        requisitos: encontrarRequisitos(ramo)
      };
    });
  });

  // Desbloquear ramos sin requisitos
  for (let ramo in estado) {
    if (estado[ramo].requisitos.length === 0) {
      desbloquearRamo(ramo);
    }
  }
}

function encontrarRequisitos(destino) {
  let requisitos = [];
  for (let ramo in ramos) {
    if (ramos[ramo].includes(destino)) {
      requisitos.push(ramo);
    }
  }
  return requisitos;
}

function aprobarRamo(nombre) {
  const ramo = estado[nombre];
  if (!ramo || ramo.aprobado || ramo.elemento.classList.contains("bloqueado")) return;
  ramo.aprobado = true;
  ramo.elemento.classList.remove("bloqueado");
  ramo.elemento.classList.add("aprobado");

  // Desbloquear los que dependen de este
  for (let dependiente in estado) {
    const requisitos = estado[dependiente].requisitos;
    if (requisitos.includes(nombre)) {
      if (requisitos.every(r => estado[r].aprobado)) {
        desbloquearRamo(dependiente);
      }
    }
  }
}

function desbloquearRamo(nombre) {
  const ramo = estado[nombre];
  if (!ramo.aprobado) {
    ramo.elemento.classList.remove("bloqueado");
  }
}

crearMalla();
