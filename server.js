const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to process data and return chart configurations
app.post('/api/generate-chart', (req, res) => {
    const { chartType, data, options } = req.body;
    
    try {
        let chartConfig;
        
        switch (chartType) {
            case 'pie':
                chartConfig = generatePieChart(data, options);
                break;
            case 'bar':
                chartConfig = generateBarChart(data, options);
                break;
            case 'histogram':
                chartConfig = generateHistogram(data, options);
                break;
            case 'frequency-polygon':
                chartConfig = generateFrequencyPolygon(data, options);
                break;
            case 'frequency-curve':
                chartConfig = generateFrequencyCurve(data, options);
                break;
            case 'ogive':
                chartConfig = generateOgiveCurve(data, options);
                break;
            default:
                return res.status(400).json({ error: 'Invalid chart type' });
        }
        
        res.json(chartConfig);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Chart generation functions
function generatePieChart(data, options = {}) {
    return {
        type: 'pie',
        data: {
            labels: data.labels || data.map((_, i) => `Category ${i + 1}`),
            datasets: [{
                data: data.values || data,
                backgroundColor: options.colors || [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
                    '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: options.title || 'Pie Chart'
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    };
}

function generateBarChart(data, options = {}) {
    return {
        type: 'bar',
        data: {
            labels: data.labels || data.map((_, i) => `Category ${i + 1}`),
            datasets: [{
                label: options.label || 'Values',
                data: data.values || data,
                backgroundColor: options.color || '#36A2EB',
                borderColor: options.borderColor || '#36A2EB',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: options.title || 'Bar Chart'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: options.yAxisLabel || 'Frequency'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: options.xAxisLabel || 'Categories'
                    }
                }
            }
        }
    };
}

function generateHistogram(data, options = {}) {
    const values = data.values || data;
    const bins = options.bins || 10;
    
    // Calculate histogram data
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binWidth = (max - min) / bins;
    
    const binCounts = new Array(bins).fill(0);
    const binLabels = [];
    
    for (let i = 0; i < bins; i++) {
        const binStart = min + i * binWidth;
        const binEnd = min + (i + 1) * binWidth;
        binLabels.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`);
        
        values.forEach(value => {
            if (value >= binStart && (value < binEnd || i === bins - 1)) {
                binCounts[i]++;
            }
        });
    }
    
    return {
        type: 'bar',
        data: {
            labels: binLabels,
            datasets: [{
                label: options.label || 'Frequency',
                data: binCounts,
                backgroundColor: options.color || '#FF6384',
                borderColor: options.borderColor || '#FF6384',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: options.title || 'Histogram'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Frequency'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: options.xAxisLabel || 'Value Ranges'
                    }
                }
            }
        }
    };
}

function generateFrequencyPolygon(data, options = {}) {
    const values = data.values || data;
    const bins = options.bins || 10;
    
    // Calculate histogram data first
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binWidth = (max - min) / bins;
    
    const binCounts = new Array(bins).fill(0);
    const binMidpoints = [];
    
    for (let i = 0; i < bins; i++) {
        const binStart = min + i * binWidth;
        const binEnd = min + (i + 1) * binWidth;
        const midpoint = (binStart + binEnd) / 2;
        binMidpoints.push(midpoint.toFixed(2));
        
        values.forEach(value => {
            if (value >= binStart && (value < binEnd || i === bins - 1)) {
                binCounts[i]++;
            }
        });
    }
    
    return {
        type: 'line',
        data: {
            labels: binMidpoints,
            datasets: [{
                label: options.label || 'Frequency',
                data: binCounts,
                borderColor: options.color || '#4BC0C0',
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointBackgroundColor: options.color || '#4BC0C0',
                pointBorderColor: options.color || '#4BC0C0',
                pointRadius: 4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: options.title || 'Frequency Polygon'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Frequency'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: options.xAxisLabel || 'Value Midpoints'
                    }
                }
            }
        }
    };
}

function generateFrequencyCurve(data, options = {}) {
    const values = data.values || data;
    const bins = options.bins || 15;
    
    // Calculate histogram data with more bins for smoother curve
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binWidth = (max - min) / bins;
    
    const binCounts = new Array(bins).fill(0);
    const binMidpoints = [];
    
    for (let i = 0; i < bins; i++) {
        const binStart = min + i * binWidth;
        const binEnd = min + (i + 1) * binWidth;
        const midpoint = (binStart + binEnd) / 2;
        binMidpoints.push(midpoint.toFixed(2));
        
        values.forEach(value => {
            if (value >= binStart && (value < binEnd || i === bins - 1)) {
                binCounts[i]++;
            }
        });
    }
    
    return {
        type: 'line',
        data: {
            labels: binMidpoints,
            datasets: [{
                label: options.label || 'Frequency',
                data: binCounts,
                borderColor: options.color || '#9966FF',
                backgroundColor: options.fillColor || 'rgba(153, 102, 255, 0.1)',
                borderWidth: 3,
                pointRadius: 2,
                fill: options.fill !== false,
                tension: 0.4 // Makes the line curved/smooth
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: options.title || 'Frequency Curve'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Frequency'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: options.xAxisLabel || 'Values'
                    }
                }
            }
        }
    };
}

function generateOgiveCurve(data, options = {}) {
    const values = data.values || data;
    const bins = options.bins || 10;
    
    // Sort values for cumulative calculation
    const sortedValues = [...values].sort((a, b) => a - b);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const binWidth = (max - min) / bins;
    
    const cumulativeFreq = [];
    const binUpperBounds = [];
    
    for (let i = 0; i < bins; i++) {
        const binEnd = min + (i + 1) * binWidth;
        binUpperBounds.push(binEnd.toFixed(2));
        
        // Count values less than or equal to bin end
        const count = sortedValues.filter(value => value <= binEnd).length;
        cumulativeFreq.push(count);
    }
    
    return {
        type: 'line',
        data: {
            labels: binUpperBounds,
            datasets: [{
                label: options.label || 'Cumulative Frequency',
                data: cumulativeFreq,
                borderColor: options.color || '#FF9F40',
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointBackgroundColor: options.color || '#FF9F40',
                pointBorderColor: options.color || '#FF9F40',
                pointRadius: 4,
                fill: false,
                tension: 0.2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: options.title || 'Ogive Curve (Cumulative Frequency)'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Cumulative Frequency'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: options.xAxisLabel || 'Upper Class Boundaries'
                    }
                }
            }
        }
    };
}

app.listen(PORT, () => {
    console.log(`Statistics Charts App running on http://localhost:${PORT}`);
});
