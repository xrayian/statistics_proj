let currentChart = null;

// Sample data sets
const sampleDataSets = {
    categorical: {
        labels: ['Product A', 'Product B', 'Product C', 'Product D', 'Product E'],
        values: [30, 45, 25, 15, 35]
    },
    numerical: {
        values: [12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 
                63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96, 99]
    },
    'test-scores': {
        values: [65, 72, 78, 85, 91, 68, 74, 82, 88, 76, 83, 79, 86, 92, 69, 77, 84, 
                89, 71, 80, 87, 73, 81, 90, 75, 85, 88, 78, 82, 86, 74, 79, 83, 87, 91]
    }
};

// Chart generation functions (moved from server-side)
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

// Load sample data into form
function loadSampleData(type) {
    const data = sampleDataSets[type];
    
    if (data.labels) {
        document.getElementById('dataLabels').value = data.labels.join(', ');
    } else {
        document.getElementById('dataLabels').value = '';
    }
    
    document.getElementById('dataValues').value = data.values.join(', ');
    
    // Update chart title based on data type
    const titles = {
        categorical: 'Product Sales Distribution',
        numerical: 'Numerical Data Distribution',
        'test-scores': 'Test Scores Distribution'
    };
    
    document.getElementById('chartTitle').value = titles[type] || 'Sample Data Chart';
    
    showMessage(`Loaded ${type.replace('-', ' ')} sample data`, 'success');
}

// Generate chart based on user input (now client-side only)
function generateChart() {
    try {
        const chartType = document.getElementById('chartType').value;
        const dataValues = document.getElementById('dataValues').value.trim();
        const dataLabels = document.getElementById('dataLabels').value.trim();
        
        if (!dataValues) {
            showMessage('Please enter data values', 'error');
            return;
        }
        
        // Parse input data
        const values = dataValues.split(',').map(val => {
            const num = parseFloat(val.trim());
            if (isNaN(num)) {
                throw new Error(`Invalid number: ${val.trim()}`);
            }
            return num;
        });
        
        const labels = dataLabels ? dataLabels.split(',').map(label => label.trim()) : null;
        
        // Prepare data object
        const data = { values };
        if (labels && labels.length === values.length) {
            data.labels = labels;
        }
        
        // Prepare options
        const options = {
            title: document.getElementById('chartTitle').value || getDefaultTitle(chartType),
            xAxisLabel: document.getElementById('xAxisLabel').value || 'X-Axis',
            yAxisLabel: document.getElementById('yAxisLabel').value || 'Y-Axis',
            bins: parseInt(document.getElementById('bins').value) || 10
        };
        
        // Show loading message
        showMessage('Generating chart...', 'loading');
        
        // Generate chart configuration based on type
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
                throw new Error('Invalid chart type');
        }
        
        // Create or update chart
        createChart(chartConfig);
        
        // Calculate and display statistics
        calculateStatistics(values, chartType);
        
        // Show chart info
        showChartInfo(chartType, values, options);
        
        showMessage('Chart generated successfully!', 'success');
        
    } catch (error) {
        console.error('Error generating chart:', error);
        showMessage(`Error: ${error.message}`, 'error');
    }
}

// Create or update chart using Chart.js
function createChart(config) {
    const ctx = document.getElementById('statisticsChart').getContext('2d');
    
    // Destroy existing chart if it exists
    if (currentChart) {
        currentChart.destroy();
    }
    
    // Create new chart
    currentChart = new Chart(ctx, config);
    
    // Enable export button when chart is created
    const exportButton = document.getElementById('exportChart');
    if (exportButton) {
        exportButton.disabled = false;
    }
}

// Clear chart and reset form
function clearChart() {
    if (currentChart) {
        currentChart.destroy();
        currentChart = null;
    }
    
    // Clear form fields
    document.getElementById('dataValues').value = '';
    document.getElementById('dataLabels').value = '';
    document.getElementById('chartTitle').value = '';
    document.getElementById('xAxisLabel').value = '';
    document.getElementById('yAxisLabel').value = '';
    document.getElementById('bins').value = '10';
    
    // Clear statistics and chart info
    document.getElementById('dataStats').innerHTML = '';
    document.getElementById('chartInfo').innerHTML = '';
    
    // Disable export button when chart is cleared
    const exportButton = document.getElementById('exportChart');
    if (exportButton) {
        exportButton.disabled = true;
    }
    
    showMessage('Chart cleared', 'success');
}

// Export chart as image
function exportChart() {
    if (!currentChart) {
        showMessage('No chart available to export', 'error');
        return;
    }
    
    try {
        // Get chart canvas
        const canvas = document.getElementById('statisticsChart');
        
        // Create a new canvas with white background
        const exportCanvas = document.createElement('canvas');
        const exportCtx = exportCanvas.getContext('2d');
        
        // Set canvas size to match the chart
        exportCanvas.width = canvas.width;
        exportCanvas.height = canvas.height;
        
        // Fill with white background
        exportCtx.fillStyle = 'white';
        exportCtx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
        
        // Draw the chart on top
        exportCtx.drawImage(canvas, 0, 0);
        
        // Generate filename with chart type and timestamp
        const chartType = document.getElementById('chartType').value;
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
        const filename = `${chartType.replace('-', '_')}_chart_${timestamp}.png`;
        
        // Convert to blob and download
        exportCanvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            showMessage(`Chart exported as ${filename}`, 'success');
        }, 'image/png', 1.0);
        
    } catch (error) {
        console.error('Export error:', error);
        showMessage('Failed to export chart. Please try again.', 'error');
    }
}

// Calculate and display statistics
function calculateStatistics(values, chartType) {
    const stats = {
        count: values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        sum: values.reduce((a, b) => a + b, 0),
        mean: 0,
        median: 0,
        mode: 0,
        range: 0,
        variance: 0,
        standardDeviation: 0
    };
    
    // Calculate mean
    stats.mean = stats.sum / stats.count;
    
    // Calculate median
    const sortedValues = [...values].sort((a, b) => a - b);
    const middle = Math.floor(sortedValues.length / 2);
    stats.median = sortedValues.length % 2 === 0 
        ? (sortedValues[middle - 1] + sortedValues[middle]) / 2 
        : sortedValues[middle];
    
    // Calculate mode
    const frequency = {};
    values.forEach(val => frequency[val] = (frequency[val] || 0) + 1);
    const maxFreq = Math.max(...Object.values(frequency));
    const modes = Object.keys(frequency).filter(key => frequency[key] === maxFreq);
    stats.mode = modes.length === values.length ? 'No mode' : modes.join(', ');
    
    // Calculate range
    stats.range = stats.max - stats.min;
    
    // Calculate variance and standard deviation
    const sumSquaredDiffs = values.reduce((sum, val) => sum + Math.pow(val - stats.mean, 2), 0);
    stats.variance = sumSquaredDiffs / stats.count;
    stats.standardDeviation = Math.sqrt(stats.variance);
    
    // Display statistics
    displayStatistics(stats);
}

// Display statistics in the UI
function displayStatistics(stats) {
    const statsContainer = document.getElementById('dataStats');
    
    const statsHTML = `
        <div class="stat-item">
            <div class="label">Count</div>
            <div class="value">${stats.count}</div>
        </div>
        <div class="stat-item">
            <div class="label">Mean</div>
            <div class="value">${stats.mean.toFixed(2)}</div>
        </div>
        <div class="stat-item">
            <div class="label">Median</div>
            <div class="value">${stats.median.toFixed(2)}</div>
        </div>
        <div class="stat-item">
            <div class="label">Mode</div>
            <div class="value">${stats.mode}</div>
        </div>
        <div class="stat-item">
            <div class="label">Minimum</div>
            <div class="value">${stats.min.toFixed(2)}</div>
        </div>
        <div class="stat-item">
            <div class="label">Maximum</div>
            <div class="value">${stats.max.toFixed(2)}</div>
        </div>
        <div class="stat-item">
            <div class="label">Range</div>
            <div class="value">${stats.range.toFixed(2)}</div>
        </div>
        <div class="stat-item">
            <div class="label">Std Deviation</div>
            <div class="value">${stats.standardDeviation.toFixed(2)}</div>
        </div>
    `;
    
    statsContainer.innerHTML = statsHTML;
}

// Show chart information
function showChartInfo(chartType, values, options) {
    const infoContainer = document.getElementById('chartInfo');
    
    const descriptions = {
        'pie': 'Pie chart showing proportional distribution of data categories.',
        'bar': 'Bar chart comparing values across different categories.',
        'histogram': `Histogram showing frequency distribution with ${options.bins} bins.`,
        'frequency-polygon': `Frequency polygon connecting midpoints of ${options.bins} bins.`,
        'frequency-curve': `Smooth frequency curve showing data distribution pattern.`,
        'ogive': 'Ogive curve showing cumulative frequency distribution.'
    };
    
    infoContainer.innerHTML = `
        <strong>Chart Type:</strong> ${chartType.replace('-', ' ').toUpperCase()}<br>
        <strong>Description:</strong> ${descriptions[chartType]}<br>
        <strong>Data Points:</strong> ${values.length}<br>
        <strong>Value Range:</strong> ${Math.min(...values).toFixed(2)} to ${Math.max(...values).toFixed(2)}
    `;
}

// Get default title based on chart type
function getDefaultTitle(chartType) {
    const titles = {
        'pie': 'Pie Chart',
        'bar': 'Bar Chart',
        'histogram': 'Histogram',
        'frequency-polygon': 'Frequency Polygon',
        'frequency-curve': 'Frequency Curve',
        'ogive': 'Ogive Curve'
    };
    return titles[chartType] || 'Chart';
}

// Show messages to user
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.notification-toast');
    existingMessages.forEach(msg => msg.remove());
    
    // Create notification container if it doesn't exist
    let notificationContainer = document.getElementById('notification-container');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notification-container';
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = `notification-toast ${type}`;
    
    // Add icon based on type
    const icons = {
        success: '✅',
        error: '❌',
        loading: '⏳'
    };
    
    messageElement.innerHTML = `
        <span class="notification-icon">${icons[type] || 'ℹ️'}</span>
        <span class="notification-text">${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Add the message to container
    notificationContainer.appendChild(messageElement);
    
    // Add animation class after a brief delay
    setTimeout(() => {
        messageElement.classList.add('show');
    }, 10);
    
    // Auto-remove success and loading messages after 4 seconds
    if (type === 'success' || type === 'loading') {
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.classList.remove('show');
                setTimeout(() => {
                    messageElement.remove();
                }, 300);
            }
        }, 4000);
    }
}

// Update chart options based on selected chart type
document.getElementById('chartType').addEventListener('change', function() {
    const chartType = this.value;
    const binsInput = document.getElementById('bins').parentElement;
    
    // Show/hide bins option based on chart type
    if (['histogram', 'frequency-polygon', 'frequency-curve', 'ogive'].includes(chartType)) {
        binsInput.style.display = 'block';
    } else {
        binsInput.style.display = 'none';
    }
    
    // Update default title
    document.getElementById('chartTitle').placeholder = getDefaultTitle(chartType);
});

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Set initial state
    document.getElementById('chartType').dispatchEvent(new Event('change'));
    
    // Add enter key support for generate button
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && e.target.type !== 'button') {
            generateChart();
        }
    });
    
    console.log('Statistics Charts Application initialized for GitHub Pages');
});
