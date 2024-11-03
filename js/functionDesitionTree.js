let trainingData = [];
let predictionData = [];

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

const loadTrainingData = async () => {
    const file = document.getElementById("trainingTreeData").files[0];
    if (!file) {
        alert("Por favor selecciona un archivo CSV de entrenamiento.");
        return;
    }
    trainingData = await readCSVID3(file);
};

const loadPredictionData = async () => {
    const file = document.getElementById("predictionTreeData").files[0];
    if (file) {
        predictionData = await readCSVID3(file);
    }
};

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
