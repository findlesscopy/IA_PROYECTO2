// Variables globales para almacenar los datos cargados
let redConfig = [];
let redTraining = [];
let redPrediction = [];

// Función para leer archivos CSV
const readCSVNetwork = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const rows = data
        .trim()
        .split("\n")
        .map((row) => row.split(",").map(Number));
      resolve(rows);
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

document
  .getElementById("configRedData")
  .addEventListener("change", async (event) => {
    redConfig = (await readCSVNetwork(event.target.files[0]))[0];
  });

document
  .getElementById("trainingRedData")
  .addEventListener("change", async (event) => {
    redTraining = await readCSVNetwork(event.target.files[0]);
    console.log("Datos de entrenamiento:", redTraining);
  });

// Cargar datos de predicción
document
  .getElementById("predictionRedData")
  .addEventListener("change", async (event) => {
    redPrediction = await readCSVNetwork(event.target.files[0]);
  });

// Función para entrenar y predecir
document.getElementById("redButton").onclick = function () {
  if (
    redConfig.length === 0 ||
    redTraining.length === 0 ||
    redPrediction.length === 0
  ) {
    alert(
      "Por favor, carga todos los archivos CSV antes de entrenar y predecir."
    );
    return;
  }

  // Crear la red neuronal con la configuración cargada
  let redNeuronal = new NeuralNetwork(redConfig);

  // Entrenar la red neuronal con los datos de entrenamiento
  redTraining.forEach((row) => {
    const inputs = row.slice(0, redConfig[0]); // Entradas según configuración
    const targets = row.slice(redConfig[0]); // Salidas esperadas
    redNeuronal.Entrenar(inputs, targets);
  });

  // Realizar predicciones con los datos de predicción
  let predictions = redPrediction.map((inputs) => redNeuronal.Predecir(inputs));

  // Mostrar los resultados
  document.getElementById("redResultados").innerHTML = predictions
    .map(
      (pred, index) =>
        `Predicción ${index + 1}: [${pred.map((p) => p.toFixed(2)).join(", ")}]`
    )
    .join("<br>");
};
