const fileInput = document.getElementById('dataLinear');
const fitButton = document.getElementById('linearRegressionButton');
const predictButton = document.getElementById('linearRegressionPredictButton');
const mseButton = document.getElementById('linearMSErrorButton');
const coeficientR2Button = document.getElementById('linearR2Button');

const fitResult = document.getElementById('linearRegressionResult');
const predictResult = document.getElementById('linearRegressionPredictResult');
const mseResult = document.getElementById('linearMSErrorResult');
const coeficientR2Result = document.getElementById('linearR2Result');

let xValues = [];
let yValues = [];
let linearModel = new LinearRegression();
let predictValues = [];

const readCSV = async (file) => {
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

            resolve({ xValues: xData, yValues: yData });
        };
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
};

const fitModel = async () => {
    if (!fileInput.files.length) {
        fitResult.textContent = "Seleccione un CSV.";
        return;
    }

    const data = await readCSV(fileInput.files[0]);
    xValues = data.xValues;
    yValues = data.yValues;

    linearModel.fit(xValues, yValues);

    // Habilita el botón de predict una vez que se ha ajustado el modelo
    fitResult.textContent = "Se ajustó el modelo.";
};

const predictModel = () => {
    predict = linearModel.predict(xValues);

    renderChart();
    predictResult.textContent = "Realizada";
};

const calculateMSE = () => {
    const mse = linearModel.mserror(yValues, predict);
    mseResult.textContent = `${mse.toFixed(4)}`;
};

// Acción: Coeficiente R2
const calculateR2 = () => {
    const r2 = linearModel.coeficientR2(yValues, predict);
    coeficientR2Result.textContent = `${r2.toFixed(4)}`;
};

// Variable para almacenar la instancia del gráfico
let linearChart;

const renderChart = () => {
    const lineData = xValues.map((x, index) => ({ x, y: predict[index] }));
    const pointData = xValues.map((x, index) => ({ x, y: yValues[index] }));

    const ctx = document.querySelector("#linearRegressionChart").getContext("2d");

    // Destruir la gráfica existente para evitar superposiciones
    if (linearChart) {
        linearChart.destroy();
    }

    // Crear nueva gráfica
    linearChart = new Chart(ctx, {
        type: "scatter",
        data: {
            datasets: [
                {
                    label: "Línea de Regresión",
                    data: lineData,
                    type: "line",
                    borderColor: "rgba(54, 162, 235, 1)", // Azul claro
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0, // Sin puntos en la línea de regresión
                },
                {
                    label: "Datos Originales",
                    data: pointData,
                    backgroundColor: "rgba(255, 159, 64, 1)", // Naranja
                    borderColor: "rgba(255, 99, 132, 1)", // Rojo claro
                    borderWidth: 1,
                    pointRadius: 5, // Puntos más visibles
                    hoverRadius: 7,
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
                        text: "Valores de X",
                        color: "#333",
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: "rgba(200, 200, 200, 0.3)",
                    },
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: "Valores de Y",
                        color: "#333",
                        font: {
                            size: 14,
                            weight: 'bold'
                        }
                    },
                    grid: {
                        color: "rgba(200, 200, 200, 0.3)",
                    },
                },
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: "#333",
                        font: {
                            size: 12,
                        },
                        boxWidth: 20,
                        padding: 15,
                    },
                },
                tooltip: {
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    titleColor: "#fff",
                    bodyColor: "#fff",
                    padding: 10,
                    cornerRadius: 5,
                    titleFont: { size: 14 },
                    bodyFont: { size: 12 },
                },
            },
            responsive: true,
            maintainAspectRatio: false,
        },
    });
};


fitButton.addEventListener("click", fitModel);
predictButton.addEventListener("click", predictModel);
mseButton.addEventListener("click", calculateMSE);
coeficientR2Button.addEventListener("click", calculateR2);
