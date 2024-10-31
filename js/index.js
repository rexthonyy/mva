window.onload = () => {
    let modalBackground = document.getElementById("modalbackground");
    let modal = document.getElementsByClassName("modal");

    _loadModals(modal, modalBackground);

    window.onclick = function(event) {
        dialogHandler.windowClick(event);
    };

    const sidebar = new Sidebar();
    const dashboard = new Dashboard(sidebar);
    dashboard.hideAll();

    let resizeValue = -1;

    function updateWindowSize() {
        var w = document.documentElement.clientWidth;
        var h = document.documentElement.clientHeight;

        if (w < 384) {
            if (resizeValue != 4) {
                resizeValue = 4;
                dashboard.myChart.destroy();
                dashboard.ctx.canvas.height = 300;
                dashboard.createChart();
            }
        } else if (w < 500) {
            if (resizeValue != 3) {
                resizeValue = 3;
                dashboard.myChart.destroy();
                dashboard.ctx.canvas.height = 260;
                dashboard.createChart();
            }
        } else if (w < 775) {
            if (resizeValue != 2) {
                resizeValue = 2;
                dashboard.myChart.destroy();
                dashboard.ctx.canvas.height = 240;
                dashboard.createChart();
            }
        } else if (w < 950) {
            if (resizeValue != 1) {
                resizeValue = 1;
                dashboard.myChart.destroy();
                dashboard.ctx.canvas.height = 240;
                dashboard.createChart();
            }
        } else if (w < 1000) {
            if (resizeValue != 0) {
                resizeValue = 0;
                dashboard.myChart.destroy();
                dashboard.ctx.canvas.height = 240;
                dashboard.createChart();
            }
        }
    }

    window.addEventListener("resize", updateWindowSize);

    updateWindowSize();
};

class Sidebar {
    constructor() {
        this.activationSelectorElm = document.getElementById("activationSelectorID");
        this.hiddenLayersElm = document.getElementById("hiddenLayersID");
        this.iterationsElm = document.getElementById("iterationsID");
        this.errorThresholdElm = document.getElementById("errorThresholdID");
        this.logPeriodElm = document.getElementById("logPeriodID");
        this.learningRateElm = document.getElementById("learningRateID");
        this.momentumElm = document.getElementById("momentumID");
        this.timeoutElm = document.getElementById("timeoutID");
        this.trainingDataElm = document.getElementById("trainingDataID");
        this.inputElm = document.getElementById("inputID");
        this.saveNetworkBtnElm = document.getElementById("saveNetworkBtnID");
        this.loadNetworkBtnElm = document.getElementById("loadNetworkBtnID");
        this.generateBtnElm = document.getElementById("generateBtnID");

        this.inputElm.value = new Date().toISOString().split('T')[0];
    }
}

class Dashboard {
    constructor(sidebar) {
        this.mainDisplay = document.getElementById("mainDisplayID");
        this.loadingDisplay = document.getElementById("loadingDisplayID");
        this.ctx = document.getElementById('myChart').getContext('2d');
        this.learningHeader = document.getElementById("learningHeader");
        this.learningProgress = document.getElementById("learningProgress");
        this.iterationHeader = document.getElementById("iterationHeader");
        this.iterationProgress = document.getElementById("iterationProgress");
        this.timeoutHeader = document.getElementById("timeoutHeader");
        this.timeoutProgress = document.getElementById("timeoutProgress");
        this.progressContainer = document.getElementById("progressContainer");
        this.outputContainer = document.getElementById("outputContainer");
        this.summaryContainer = document.getElementById("summaryContainer");

        this.loadNetworkInput = document.getElementById("loadNetworkInput");

        this.res_trainingTime = 0;
        this.res_iterations = 0;
        this.res_error = 0;

        this.net = null;
        this.myChart = null;
        this.chartLabels = [];
        this.chartData = [];
        this.createChart();
        this.loadSidebar(sidebar);
    }

    createChart() {
        this.myChart = new Chart(this.ctx, {
            type: 'bar',
            data: {
                labels: this.chartLabels,
                datasets: [{
                    label: 'volatility',
                    fill: true, // fill the background color under the chart
                    data: this.chartData,
                    tension: 0,
                    backgroundColor: chartBackgroundColor,
                    borderColor: chartBorderColor,
                    borderWidth: 1 // border width of the chart
                }]
            },
            options: {
                interaction: { //tooltip appears on hovering over chart
                    mode: 'index',
                    intersect: false
                },
                plugins: { // remove the dataset label
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        grid: {
                            display: true,
                            color: "rgba(200, 200, 200, 0.3)"
                        }
                    },
                    x: { // remove the vertical grid lines
                        grid: {
                            display: false
                        }
                    }
                },
                elements: { //remove the dot on the line
                    point: {
                        radius: 0
                    }
                },
                animation: {
                    duration: 0
                }
            }
        });
    }

    loadSidebar(sidebar) {
        sidebar.generateBtnElm.onclick = e => {

            stopClickPropagation(e);

            this.hide();

            let activationType = sidebar.activationSelectorElm.value;
            let hiddenLayers = sidebar.hiddenLayersElm.value;
            let iterations = sidebar.iterationsElm.value;
            let errorThreshold = sidebar.errorThresholdElm.value;
            let logPeriod = sidebar.logPeriodElm.value;
            let learningRate = sidebar.learningRateElm.value;
            let momentum = sidebar.momentumElm.value;
            let timeout = sidebar.timeoutElm.value;
            let trainingData = sidebar.trainingDataElm.value;
            let input = sidebar.inputElm.value;

            if (this.loadNetworkInput.value == undefined || this.loadNetworkInput.value.trim().length == 0) {

                if (hiddenLayers == undefined || hiddenLayers.trim().length == 0) {
                    this.hideAll();
                    return dialogHandler.show(Dialog.NOTIFICATION, {
                        title: "Notice",
                        message: "Specify the hidden layers",
                        btnLabel: "Okay",
                        onclick: () => {
                            dialogHandler.hide();
                        }
                    });
                }
                if (iterations == undefined || iterations.trim().length == 0) {
                    this.hideAll();
                    return dialogHandler.show(Dialog.NOTIFICATION, {
                        title: "Notice",
                        message: "Specify the iterations",
                        btnLabel: "Okay",
                        onclick: () => {
                            dialogHandler.hide();
                        }
                    });
                }
                if (errorThreshold == undefined || errorThreshold.trim().length == 0) {
                    this.hideAll();
                    return dialogHandler.show(Dialog.NOTIFICATION, {
                        title: "Notice",
                        message: "Specify the error threshold",
                        btnLabel: "Okay",
                        onclick: () => {
                            dialogHandler.hide();
                        }
                    });
                }
                if (logPeriod == undefined || logPeriod.trim().length == 0) {
                    this.hideAll();
                    return dialogHandler.show(Dialog.NOTIFICATION, {
                        title: "Notice",
                        message: "Specify the log period",
                        btnLabel: "Okay",
                        onclick: () => {
                            dialogHandler.hide();
                        }
                    });
                }
                if (learningRate == undefined || learningRate.trim().length == 0) {
                    this.hideAll();
                    return dialogHandler.show(Dialog.NOTIFICATION, {
                        title: "Notice",
                        message: "Specify the learning rate",
                        btnLabel: "Okay",
                        onclick: () => {
                            dialogHandler.hide();
                        }
                    });
                }
                if (momentum == undefined || momentum.trim().length == 0) {
                    this.hideAll();
                    return dialogHandler.show(Dialog.NOTIFICATION, {
                        title: "Notice",
                        message: "Specify the momentum",
                        btnLabel: "Okay",
                        onclick: () => {
                            dialogHandler.hide();
                        }
                    });
                }
                if (timeout == undefined || timeout.trim().length == 0) {
                    this.hideAll();
                    return dialogHandler.show(Dialog.NOTIFICATION, {
                        title: "Notice",
                        message: "Specify the timeout",
                        btnLabel: "Okay",
                        onclick: () => {
                            dialogHandler.hide();
                        }
                    });
                }
                if (trainingData == undefined || trainingData.trim().length == 0) {
                    this.hideAll();
                    return dialogHandler.show(Dialog.NOTIFICATION, {
                        title: "Notice",
                        message: "Specify the training data",
                        btnLabel: "Okay",
                        onclick: () => {
                            dialogHandler.hide();
                        }
                    });
                }
                if (input == undefined || input.trim().length == 0) {
                    this.hideAll();
                    return dialogHandler.show(Dialog.NOTIFICATION, {
                        title: "Notice",
                        message: "Specify the input",
                        btnLabel: "Okay",
                        onclick: () => {
                            dialogHandler.hide();
                        }
                    });
                }

                let errorStart = 0;

                let now = Date.now();
                let timestampStart = now;
                let timestampEnd = timestampStart + parseInt(timeout);

                const config = {
                    activation: activationType,
                    hiddenLayers: hiddenLayers.split(",").map(val => parseInt(val)),
                    iterations: parseInt(iterations),
                    errorThresh: parseFloat(errorThreshold),
                    learningRate: parseFloat(learningRate),
                    momentum: parseFloat(momentum),
                    timeout: parseInt(timeout),
                    logPeriod: parseInt(logPeriod),
                    log: log => {
                        // learning
                        errorStart = Math.max(log.error, errorStart);
                        let error = Number(log.error.toFixed(4));
                        let percentError = myMap(error, errorStart, parseFloat(errorThreshold), 0, 100).toFixed(1);
                        this.learningHeader.textContent = `Learning - ${error} of ${errorThreshold} - ${percentError}%`;
                        this.learningProgress.style.width = `${percentError}%`;

                        // iterations
                        let percentIteration = myMap(log.iterations, 0, parseInt(iterations), 0, 100).toFixed(1);
                        this.iterationHeader.textContent = `Iterations - ${numberWithCommas(log.iterations)} of ${numberWithCommas(iterations)} - ${percentIteration}%`;
                        this.iterationProgress.style.width = `${percentIteration}%`;

                        // timeout
                        now = Date.now();
                        let seconds = parseInt((timestampEnd - now) / 1000);
                        let percentTimeout = myMap(now, timestampStart, timestampEnd, 0, 100).toFixed(1);
                        this.timeoutHeader.textContent = `Timeout - ${numberWithCommas(seconds)} seconds remaining - ${percentTimeout}%`;
                        this.timeoutProgress.style.width = `${percentTimeout}%`;
                    }
                };

                this.net = new brain.NeuralNetwork(config);

                this.net.trainAsync(this.getTrainingData(trainingData))
                    .then(res => {

                        sidebar.saveNetworkBtnElm.style.display = "block";

                        this.res_iterations = res.iterations;
                        this.res_error = res.error;

                        // calculate the training time duration
                        this.res_trainingTime = parseInt((now - timestampStart) / 1000);

                        let summary = [{
                            label: "Training time",
                            value: `${this.res_trainingTime} sec`
                        }, {
                            label: "Activation type",
                            value: activationType
                        }, {
                            label: "Hidden layers",
                            value: hiddenLayers
                        }, {
                            label: "Iterations",
                            value: numberWithCommas(res.iterations)
                        }, {
                            label: "Error threshold",
                            value: res.error.toPrecision(3)
                        }, {
                            label: "Log period",
                            value: logPeriod
                        }, {
                            label: "Learning rate",
                            value: learningRate
                        }, {
                            label: "Momentum",
                            value: momentum
                        }];

                        let html = "";

                        summary.forEach(element => {
                            html += `
                        <div class="custom-background-level-2 rex-curDiv-8px rex-border-darkgray rex-pad8px">
                            <p class="rex-fs-small rex-color-darkgray">${element.label}</p>
                            <div class="rex-mt-8px rex-weight-bold">
                                <span class="rex-fs-normal rex-color-white rex-mr-8px">${element.value}</span>
                            </div>
                        </div>
                        `;
                        });

                        this.summaryContainer.innerHTML = html;

                        this.showOutputDisplay();

                        const output = this.net.run(getDateInput(new Date(input))); // [0.987]
                        let data = [];
                        for (let i = 0; i < output.length; i++) {
                            data.push({
                                label: [i],
                                value: output[i]
                            });
                        }

                        this.updateChart(data);

                    }).catch(err => {
                        console.error(err);
                    });

            } else {
                // learning
                this.learningHeader.textContent = `Learning`;
                this.learningProgress.style.width = `100%`;

                // iterations
                this.iterationHeader.textContent = `Iterations`;
                this.iterationProgress.style.width = `100%`;

                // timeout
                this.timeoutHeader.textContent = `Timeout`;
                this.timeoutProgress.style.width = `100%`;

                sidebar.saveNetworkBtnElm.style.display = "block";

                let summary = [{
                    label: "Training time",
                    value: `${this.res_trainingTime} sec`
                }, {
                    label: "Activation type",
                    value: activationType
                }, {
                    label: "Hidden layers",
                    value: hiddenLayers
                }, {
                    label: "Iterations",
                    value: numberWithCommas(this.res_iterations)
                }, {
                    label: "Error threshold",
                    value: this.res_error.toPrecision(3)
                }, {
                    label: "Log period",
                    value: logPeriod
                }, {
                    label: "Learning rate",
                    value: learningRate
                }, {
                    label: "Momentum",
                    value: momentum
                }];

                let html = "";

                summary.forEach(element => {
                    html += `
                <div class="custom-background-level-2 rex-curDiv-8px rex-border-darkgray rex-pad8px">
                    <p class="rex-fs-small rex-color-darkgray">${element.label}</p>
                    <div class="rex-mt-8px rex-weight-bold">
                        <span class="rex-fs-normal rex-color-white rex-mr-8px">${element.value}</span>
                    </div>
                </div>
                `;
                });

                this.summaryContainer.innerHTML = html;

                this.showOutputDisplay();

                const output = this.net.run(getDateInput(new Date(input))); // [0.987]
                let data = [];
                for (let i = 0; i < output.length; i++) {
                    data.push({
                        label: [i],
                        value: output[i]
                    });
                }

                this.updateChart(data);
            }

            this.showMainDisplay();
        };

        sidebar.saveNetworkBtnElm.onclick = e => {
            stopClickPropagation(e);
            let networkJSON = this.net.toJSON();
            networkJSON.options.res_iterations = this.res_iterations;
            networkJSON.options.res_error = this.res_error;
            networkJSON.options.res_trainingTime = this.res_trainingTime;
            let networkJSONString = JSON.stringify(networkJSON);
            dialogHandler.show(Dialog.SAVE_NETWORK, {
                input: networkJSONString,
                onclick: cb => {
                    copyToClipboard(networkJSONString);
                    cb();
                }
            });
        };

        sidebar.loadNetworkBtnElm.onclick = e => {
            stopClickPropagation(e);
            dialogHandler.show(Dialog.LOAD_NETWORK, {
                input: "",
                onclick: networkJSONString => {
                    this.net = new brain.NeuralNetwork();
                    let networkJSON = JSON.parse(networkJSONString);
                    this.net.fromJSON(networkJSON);
                    sidebar.activationSelectorElm.value = networkJSON.options.activation;
                    let hiddenLayers = "";
                    for (let i = 0; i < networkJSON.options.hiddenLayers.length; i++) {
                        if (i > 0) {
                            hiddenLayers += ", ";
                        }
                        hiddenLayers += networkJSON.options.hiddenLayers[i];
                    }
                    sidebar.hiddenLayersElm.value = hiddenLayers;
                    this.res_iterations = networkJSON.options.res_iterations;
                    this.res_error = networkJSON.options.res_error;
                    this.res_trainingTime = networkJSON.options.res_trainingTime;
                    sidebar.iterationsElm.value = networkJSON.options.iterations;
                    sidebar.errorThresholdElm.value = networkJSON.options.errorThresh;
                    sidebar.logPeriodElm.value = networkJSON.options.logPeriod;
                    sidebar.learningRateElm.value = networkJSON.options.learningRate;
                    sidebar.momentumElm.value = networkJSON.options.momentum;
                    sidebar.timeoutElm.value = networkJSON.options.timeout;
                    sidebar.trainingDataElm.value = "";

                    dialogHandler.hide();
                }
            });
        };
    }

    getTrainingData(trainingDataInput) {

        let trainingData = JSON.parse(trainingDataInput);

        let data = [];

        for (const key in trainingData) {
            let date = new Date(key);

            data.push({
                input: getDateInput(date),
                output: trainingData[key]
            });
        }

        return data;
    };

    hide() {
        this.mainDisplay.style.display = "none";
        this.outputContainer.style.display = "none";
        this.loadingDisplay.style.display = "flex";
    }

    hideAll() {
        this.mainDisplay.style.display = "none";
        this.outputContainer.style.display = "none";
        this.loadingDisplay.style.display = "none";
    }

    showOutputDisplay() {
        this.mainDisplay.style.display = "block";
        this.outputContainer.style.display = "block";
        this.loadingDisplay.style.display = "none";
    }

    showMainDisplay() {
        this.mainDisplay.style.display = "block";
        this.loadingDisplay.style.display = "none";
    }

    updateChart(data) {
        // clear the stat data
        this.chartLabels.splice(0, this.chartLabels.length);
        this.chartData.splice(0, this.chartData.length);

        data.forEach(entry => {
            this.chartLabels.push(entry.label);
            this.chartData.push(entry.value);
        });

        this.myChart.update();
    }
}