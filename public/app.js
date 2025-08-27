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

// Generate chart based on user input
async function generateChart() {
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
        
        // Make API call to generate chart
        const response = await fetch('/api/generate-chart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chartType,
                data,
                options
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Failed to generate chart');
        }
        
        const chartConfig = await response.json();
        
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
    
    showMessage('Chart cleared', 'success');
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
    const existingMessages = document.querySelectorAll('.error, .success, .loading');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = type;
    messageElement.classList.add('floating-notification');
    messageElement.classList.add('show');
    messageElement.textContent = message;
    
    // Insert message at the top of the input section
    const inputSection = document.querySelector('.input-section');
    inputSection.insertBefore(messageElement, inputSection.firstChild);
    
    // Auto-remove success and loading messages after 3 seconds
    if (type === 'success' || type === 'loading') {
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 3000);
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
    
    console.log('Statistics Charts Application initialized');
});
