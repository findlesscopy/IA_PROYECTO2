// Elementos
const polyFileInput = document.getElementById("dataPolinomial");
const polyDegreeInput = document.getElementById("gradoPolinomial");
const polyFitBtn = document.getElementById("polinomialRegressionButton");
const polyPredictBtn = document.getElementById("polinomialRegressionPredictButton");
const polyMSEBtn = document.getElementById("polinomialMSErrorButton");
const polyR2Btn = document.getElementById("polinomialR2Button");

const polyFitResult = document.getElementById("polynomialRegressionResult");
const polyPredictResult = document.getElementById("polynomialRegressionPredictResult");
const polyMSEResult = document.getElementById("polynomialMSErrorResult");
const polyR2Result = document.getElementById("polynomialR2Result");

let polyXVars = [];
let polyYVars = [];
let polynomialInstance = new PolynomialRegression();
let polyPredict = [];

const readPolyCSV = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const rows = data.split("\n").slice(1);
      const xData = [];
      const yData = [];

      rows.forEach((row) => {
        const [x, y] = row.split(",").map(Number);
        if (!isNaN(x) && !isNaN(y)) {
          xData.push(x);
          yData.push(y);
        }
      });

      resolve({ xVars: xData, yVars: yData });
    };
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

const fitPolyModel = async () => {
  if (!polyFileInput.files.length || !polyDegreeInput.value) {
    polyFitResult.textContent =
      "Por favor selecciona un archivo CSV y el grado del polinomio.";
    return;
  }

  const degree = parseInt(polyDegreeInput.value);
  const data = await readPolyCSV(polyFileInput.files[0]);
  polyXVars = data.xVars;
  polyYVars = data.yVars;

  polynomialInstance.fit(polyXVars, polyYVars, degree);

  polyPredictBtn.disabled = false;
  polyFitResult.textContent = "Se ajustó el modelo.";
};

const predictPolyModel = () => {
  polyPredict = polynomialInstance.predict(polyXVars);

  polyMSEBtn.disabled = false;
  polyR2Btn.disabled = false;

  renderPolyChart();
  polyPredictResult.textContent = "Realizada";
};

const calculatePolyMSE = () => {
  const mse = polynomialInstance.getError();
  polyMSEResult.textContent = `${mse.toFixed(4)}`;
};

const calculatePolyR2 = () => {
  const r2 = polynomialInstance.getError();
  polyR2Result.textContent = `${r2.toFixed(
    4
  )}`;
};

let polyChart;

const renderPolyChart = () => {
  // Prepare data for the polynomial line and original points
  const polyLineData = polyXVars.map((x, index) => ({
    x,
    y: polyPredict[index],
  }));
  const polyPointData = polyXVars.map((x, index) => ({
    x,
    y: polyYVars[index],
  }));

  // Get the chart context
  const ctx = document
    .getElementById("polynomialRegressionChart")
    .getContext("2d");

  // Destroy previous chart instance if it exists
  if (polyChart) {
    polyChart.destroy();
  }

  // Create the chart
  polyChart = new Chart(ctx, {
    type: "scatter",
    data: {
      datasets: [
        {
          label: "Regresión Polinomial",
          data: polyLineData,
          type: "line",
          borderColor: "rgba(54, 162, 235, 1)", // Slightly different color for polynomial
          borderWidth: 2,
          fill: false,
          pointRadius: 0,
        },
        {
          label: "Datos Originales",
          data: polyPointData,
          backgroundColor: "rgba(255, 99, 132, 0.8)", // Original data color to match regression line chart
          pointRadius: 5,
        },
      ],
    },
    options: {
      scales: {
        x: {
          type: "linear",
          position: "bottom",
          title: {
            display: true,
            text: "X Values",
            color: "rgba(0, 0, 0, 0.7)",
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Y Values",
            color: "rgba(0, 0, 0, 0.7)",
          },
        },
      },
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            color: "rgba(0, 0, 0, 0.8)",
          },
        },
      },
    },
  });
};

polyFitBtn.addEventListener("click", fitPolyModel);
polyPredictBtn.addEventListener("click", predictPolyModel);
polyMSEBtn.addEventListener("click", calculatePolyMSE);
polyR2Btn.addEventListener("click", calculatePolyR2);
