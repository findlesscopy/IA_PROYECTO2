# Manual Técnico

## Proyecto 2

### Laboratorio de Inteligencia Artificial

| Nombre                   | Carnet    |
| ------------------------ | --------- |
| José Manuel Ibarra Pirir | 202001800 |

___

## Explicación de Código utilizado

### Regresión Lineal


## Variables y Elementos del DOM

- **`fileInput`**: Elemento HTML `<input type="file">` para cargar el archivo CSV con los datos.
- **Botones**:
  - `fitButton`: Botón para ajustar el modelo.
  - `predictButton`: Botón para predecir valores de `Y` a partir de los datos `X` una vez que el modelo ha sido ajustado.
  - `mseButton`: Botón para calcular el error cuadrático medio (MSE).
  - `coeficientR2Button`: Botón para calcular el coeficiente de determinación (R²).
- **Resultados**:
  - `fitResult`: Muestra si el modelo fue ajustado correctamente.
  - `predictResult`: Indica si la predicción fue realizada.
  - `mseResult`: Muestra el valor calculado del MSE.
  - `coeficientR2Result`: Muestra el valor de R².

## Variables de Datos y Modelo

- **`xValues`** y **`yValues`**: Arrays para almacenar los datos de entrada (X e Y) desde el archivo CSV.
- **`linearModel`**: Instancia de la clase `LinearRegression` para crear el modelo de regresión lineal.
- **`predictValues`**: Array para almacenar los valores predichos de `Y` usando el modelo ajustado.

## Funciones

### `readCSV`

Función asíncrona que lee un archivo CSV y extrae los valores de `X` e `Y`.

```javascript
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
```

1. Usa un `FileReader` para leer el archivo CSV.
2. Divide cada línea en `X` e `Y` y almacena los datos en `xData` y `yData`.
3. Retorna un objeto con los valores de `X` e `Y`.

### `fitModel`

Ajusta el modelo con los datos del CSV y activa el botón de predicción.

```javascript
const fitModel = async () => {
    if (!fileInput.files.length) {
        fitResult.textContent = "Seleccione un CSV.";
        return;
    }

    const data = await readCSV(fileInput.files[0]);
    xValues = data.xValues;
    yValues = data.yValues;

    linearModel.fit(xValues, yValues);

    fitResult.textContent = "Se ajustó el modelo.";
};
```

1. Lee los datos del CSV usando `readCSV`.
2. Ajusta el modelo `linearModel` con los datos `xValues` y `yValues`.
3. Actualiza `fitResult` para indicar que el modelo fue ajustado.

### `predictModel`

Realiza la predicción en los valores de `X` usando el modelo ajustado y actualiza la gráfica.

```javascript
const predictModel = () => {
    predict = linearModel.predict(xValues);
    renderChart();
    predictResult.textContent = "Realizada";
};
```

1. Predice los valores de `Y` a partir de `xValues`.
2. Llama a `renderChart` para mostrar los datos originales y la línea de regresión.
3. Actualiza `predictResult` para indicar que la predicción fue realizada.

### `calculateMSE` y `calculateR2`

Calculan el error cuadrático medio (MSE) y el coeficiente de determinación (R²).

```javascript
const calculateMSE = () => {
    const mse = linearModel.mserror(yValues, predict);
    mseResult.textContent = `${mse.toFixed(4)}`;
};

const calculateR2 = () => {
    const r2 = linearModel.coeficientR2(yValues, predict);
    coeficientR2Result.textContent = `${r2.toFixed(4)}`;
};
```

1. **`calculateMSE`**: Calcula el MSE entre los valores reales (`yValues`) y los valores predichos (`predict`), y lo muestra en `mseResult`.
2. **`calculateR2`**: Calcula el coeficiente R² y lo muestra en `coeficientR2Result`.

### `renderChart`

Genera una gráfica para visualizar los datos originales y la línea de regresión.

```javascript
const renderChart = () => {
    const lineData = xValues.map((x, index) => ({ x, y: predict[index] }));
    const pointData = xValues.map((x, index) => ({ x, y: yValues[index] }));

    const ctx = document.querySelector("#linearRegressionChart").getContext("2d");

    if (linearChart) {
        linearChart.destroy();
    }

    linearChart = new Chart(ctx, {
        type: "scatter",
        data: {
            datasets: [
                {
                    label: "Línea de Regresión",
                    data: lineData,
                    type: "line",
                    borderColor: "rgba(54, 162, 235, 1)",
                    borderWidth: 2,
                    fill: false,
                    pointRadius: 0,
                },
                {
                    label: "Datos Originales",
                    data: pointData,
                    backgroundColor: "rgba(255, 159, 64, 1)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1,
                    pointRadius: 5,
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
```

1. **`lineData`** y **`pointData`**: Generan los datos para la línea de regresión y los puntos originales, respectivamente.
2. **Destrucción de gráfica existente**: Si ya hay una gráfica, la destruye para evitar superposiciones.
3. **Configuración de la gráfica**: Configura el tipo de gráfico, los datasets y los estilos.

### Eventos de los Botones

Asigna las funciones a los botones para que respondan a los clics.

```javascript
fitButton.addEventListener("click", fitModel);
predictButton.addEventListener("click", predictModel);
mseButton.addEventListener("click", calculateMSE);
coeficientR2Button.addEventListener("click", calculateR2);
```

---

## Red Neuronal

### Variables y Elementos del DOM

- **`fileInput`**: Elemento HTML `<input type="file">` para cargar el archivo CSV con los datos.
- **Botones**:
  - `fitButton`: Botón para ajustar el modelo.
  - `predictButton`: Botón para predecir valores de `Y` a partir de los datos `X` una vez que el modelo ha sido ajustado.
  - `mseButton`: Botón para calcular el error cuadrático medio (MSE).
  - `coeficientR2Button`: Botón para calcular el coeficiente de determinación (R²).
- **Resultados**:
  - `fitResult`: Muestra si el modelo fue ajustado correctamente.
  - `predictResult`: Indica si la predicción fue realizada.
  - `mseResult`: Muestra el valor calculado del MSE.
  - `coeficientR2Result`: Muestra el valor de R².

## Variables de Datos y Modelo

- **`xValues`** y **`yValues`**: Arrays para almacenar los datos de entrada (X e Y) desde el archivo CSV.
- **`neuralModel`**: Instancia de la clase `NeuralNetwork` para crear el modelo de red neuronal.
- **`predictValues`**: Array para almacenar los valores predichos de `Y` usando el modelo ajustado.

## Funciones

### `readCSV`

Función asíncrona que lee un archivo CSV y extrae los valores de `X` e `Y`.

```javascript
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
```

1. Usa un `FileReader` para leer el archivo CSV.
2. Divide cada línea en `X` e `Y` y almacena los datos en `xData` y `yData`.
3. Retorna un objeto con los valores de `X` e `Y`.

### `fitModel`

Ajusta el modelo con los datos del CSV y activa el botón de predicción.

```javascript
const fitModel = async () => {
    if (!fileInput.files.length) {
        fitResult.textContent = "Seleccione un CSV.";
        return;
    }

    const data
    await readCSV(fileInput.files[0]);
    xValues = data.xValues;
    yValues = data.yValues;

    neuralModel.fit(xValues, yValues);

    fitResult.textContent = "Se ajustó el modelo.";
};
```

1. Lee los datos del CSV usando `readCSV`.
2. Ajusta el modelo `neuralModel` con los datos `xValues` y `yValues`.
3. Actualiza `fitResult` para indicar que el modelo fue ajustado.
4. Actualiza `predictResult` para indicar que la predicción fue realizada.
5. Actualiza `mseResult` para mostrar el valor del MSE.
6. Actualiza `coeficientR2Result` para mostrar el valor de R².
7. Llama a `renderChart` para mostrar los datos originales y la línea de regresión.
8. Asigna las funciones a los botones para que respondan a los clics.

### `predictModel`

Realiza la predicción en los valores de `X` usando el modelo ajustado y actualiza la gráfica.

```javascript
const predictModel = () => {
    predict = neuralModel.predict(xValues);
    renderChart();
    predictResult.textContent = "Realizada";
};
```

1. Predice los valores de `Y` a partir de `xValues`.
2. Llama a `renderChart` para mostrar los datos originales y la línea de regresión.
3. Actualiza `predictResult` para indicar que la predicción fue realizada.
4. Calcula el MSE entre los valores reales (`yValues`) y los valores predichos (`predict`), y lo muestra en `mseResult`.

### `calculateMSE` y `calculateR2`

Calculan el error cuadrático medio (MSE) y el coeficiente de determinación (R²).

```javascript
const calculateMSE = () => {
    const mse = neuralModel.mserror(yValues, predict);
    mseResult.textContent = `${mse.toFixed(4)}`;
};

const calculateR2 = () => {
    const r2 = neuralModel.coeficientR2(yValues, predict);
    coeficientR2Result.textContent = `${r2.toFixed(4)}`;
};
```

1. **`calculateMSE`**: Calcula el MSE entre los valores reales (`yValues`) y los valores predichos (`predict`), y lo muestra en `mseResult`.
2. **`calculateR2`**: Calcula el coeficiente R² y lo muestra en `coeficientR2Result`.
3. **`renderChart`**: Genera una gráfica para visualizar los datos originales y la línea de regresión.

### Eventos de los Botones

Asigna las funciones a los botones para que respondan a los clics.

```javascript
fitButton.addEventListener("click", fitModel);
predictButton.addEventListener("click", predictModel);
mseButton.addEventListener("click", calculateMSE);
coeficientR2Button.addEventListener("click", calculateR2);
```

---

## Arbol de Deicisión

Aquí tienes una explicación de las partes más importantes del código en formato Markdown.

---

# Explicación del Código

Este código es una implementación en JavaScript que permite cargar y visualizar un árbol de decisión generado a partir de datos de entrenamiento y realizar predicciones usando datos de prueba. La visualización se realiza en un elemento HTML usando la librería `vis.js`.

### Variables Globales

```javascript
let trainingData = [];
let predictionData = [];
```

- `trainingData`: Array que almacenará los datos de entrenamiento leídos desde un archivo CSV.
- `predictionData`: Array que almacenará los datos de predicción leídos desde un archivo CSV.

### Funciones Principales

#### `readCSVID3`

```javascript
const readCSVID3 = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const data = event.target.result;
            const rows = data.trim().split("\n").map(row => row.split(","));
            resolve(rows);
        };
        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
};
```

- Esta función lee un archivo CSV y convierte su contenido en un array de arrays.
- Utiliza `FileReader` para leer el archivo de texto y `Promise` para manejar la carga de manera asíncrona.
- Divide el contenido en filas y columnas (usando `split` con `\n` y `,`).

#### `loadTrainingData`

```javascript
const loadTrainingData = async () => {
    const file = document.getElementById("trainingTreeData").files[0];
    if (!file) {
        alert("Por favor selecciona un archivo CSV de entrenamiento.");
        return;
    }
    trainingData = await readCSVID3(file);
};
```

- Lee el archivo de datos de entrenamiento desde un input de tipo `file` y almacena el contenido en `trainingData`.
- Si el archivo no está seleccionado, muestra un mensaje de alerta.

#### `loadPredictionData`

```javascript
const loadPredictionData = async () => {
    const file = document.getElementById("predictionTreeData").files[0];
    if (file) {
        predictionData = await readCSVID3(file);
    }
};
```

- Similar a `loadTrainingData`, pero carga datos de prueba en `predictionData`.

### `generatechart`

```javascript
const generatechart = () => {
    if (trainingData.length === 0) {
        alert("Por favor carga los datos de entrenamiento antes de generar el árbol.");
        return;
    }

    const dTree = new DecisionTreeID3(trainingData);
    const root = dTree.train(dTree.dataset);

    let predict = null;
    if (predictionData.length > 0) {
        const predHeader = trainingData[0].slice(0, -1);
        predict = dTree.predict([predHeader, predictionData[0]], root);
    }

    return {
        dotStr: dTree.generateDotString(root),
        predictNode: predict
    };
};

```

- Genera un árbol de decisión usando los datos de entrenamiento y el algoritmo `ID3`.
- Entrena el árbol con `dTree.train(dTree.dataset)` y, si hay datos de prueba, realiza una predicción.
- Devuelve un objeto con la estructura del árbol en formato DOT (`dotStr`) y el nodo de predicción (`predictNode`).

### Interacción con el DOM

#### `predictTreeButton` (Predicción)

```javascript
document.getElementById('predictTreeButton').onclick = async () => {
    await loadPredictionData();
    const chart = document.getElementById("treed");
    const { dotStr, predictNode } = generatechart();

    if (predictNode != null) {
        const header = trainingData[0];
        document.getElementById('treeResultados').innerText = `${header[header.length - 1]}: ${predictNode.value}`;
    } else {
        document.getElementById('treeResultados').innerText = "No hay predicción disponible.";
    }

    const parsDot = vis.network.convertDot(dotStr);
    const data = {
        nodes: parsDot.nodes,
        edges: parsDot.edges
    };

    const options = {
        layout: {
            hierarchical: {
                levelSeparation: 100,
                nodeSpacing: 100,
                parentCentralization: true,
                direction: 'UD',
                sortMethod: 'directed'
            }
        }
    };

    new vis.Network(chart, data, options);
};
```

- Se ejecuta cuando se hace clic en el botón de predicción.
- Carga los datos de predicción y genera el árbol usando `generatechart`.
- Muestra el resultado de la predicción en el elemento `treeResultados`.

#### `treeButton` (Generar Árbol)

```javascript
document.getElementById('treeButton').onclick = async () => {
    await loadTrainingData();
    const chart = document.getElementById("treeGraph");
    const { dotStr, predictNode } = generatechart();

    if (predictNode != null) {
        const header = trainingData[0];
        document.getElementById('treeResultados').innerText = `${header[header.length - 1]}: ${predictNode.value}`;
    } else {
        document.getElementById('treeResultados').innerText = "No hay predicción disponible.";
    }

    const parsDot = vis.network.convertDot(dotStr);
    const data = {
        nodes: parsDot.nodes,
        edges: parsDot.edges
    };

    const options = {
        layout: {
            hierarchical: {
                levelSeparation: 120,
                nodeSpacing: 100,
                parentCentralization: true,
                direction: 'UD', // De arriba a abajo
                sortMethod: 'directed'
            }
        },
        nodes: {
            shape: 'box',  // Cambia la forma del nodo a "box"
            color: {
                border: '#8DA6C7', // Color del borde del nodo
                background: '#CEE5FF', // Color de fondo del nodo
                highlight: {
                    border: '#1F3C88',
                    background: '#A1C4FF'
                },
                hover: {
                    border: '#3E5C99',
                    background: '#BDD7FF'
                }
            },
            font: {
                color: '#333333', // Color de la fuente
                size: 14,          // Tamaño de la fuente
                face: 'Arial'
            },
            borderWidth: 2,
            shapeProperties: {
                borderRadius: 5 // Bordes redondeados en los nodos
            }
        },
        edges: {
            color: '#A3B5CC', // Color de las conexiones
            width: 2,
            arrows: {
                to: { enabled: true, scaleFactor: 0.8 } // Flechas al final de los bordes
            },
            smooth: {
                type: 'cubicBezier', // Tipo de curva de las líneas
                roundness: 0.5
            }
        },
        interaction: {
            hover: true,
            tooltipDelay: 200,
            hideEdgesOnDrag: true
        },
        physics: {
            enabled: false
        }
    };

    new vis.Network(chart, data, options);
};

```

- Se ejecuta al hacer clic en el botón para generar el árbol de decisión.
- Carga los datos de entrenamiento y genera el árbol.
- Muestra el resultado de la predicción y configura las opciones de visualización de `vis.Network`.

### Configuración de Visualización

Ambos botones usan `vis.js` para mostrar el árbol de decisión con opciones de visualización, tales como:

- **Configuración jerárquica**: Configura el árbol para que los nodos se organicen de arriba hacia abajo (`direction: 'UD'`).
- **Estilo de los nodos**: Se configuran colores, forma (`box`), bordes redondeados, y características de interacción como el resaltado al pasar el mouse.
- **Conexiones (edges)**: Se añade color, anchura, y flechas en las conexiones entre nodos.
- **Interacción**: La red se puede explorar y muestra detalles al pasar el mouse.
