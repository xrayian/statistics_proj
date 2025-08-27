# Statistics Charts Application

A comprehensive Node.js web application that generates various statistical charts using Chart.js. This application supports six different types of statistical visualizations from user-provided data.

## Features

### Supported Chart Types
1. **Pie Chart** - Shows proportional distribution of categorical data
2. **Bar Chart** - Compares values across different categories  
3. **Histogram** - Displays frequency distribution of continuous data
4. **Frequency Polygon** - Line chart connecting histogram midpoints
5. **Frequency Curve** - Smooth curve showing distribution patterns
6. **Ogive Curve** - Cumulative frequency distribution

### Key Capabilities
- Interactive web interface for data input
- Real-time chart generation and updates
- Automatic statistical calculations (mean, median, mode, etc.)
- Sample data sets for testing
- Responsive design for all screen sizes
- Customizable chart options (titles, labels, bins)

## Installation

1. **Clone or download the project**
   ```bash
   cd statistics_proj
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## Usage

### Data Input Methods

1. **Manual Input**
   - Enter comma-separated values in the "Values" field
   - Optionally add labels for categorical data
   - Example: `10, 25, 30, 15, 20`

2. **Sample Data**
   - Click "Load Categorical Data" for pie/bar charts
   - Click "Load Numerical Data" for distribution charts
   - Click "Load Test Scores" for realistic score data

### Chart Configuration

- **Chart Type**: Select from 6 available chart types
- **Title**: Custom title for your chart
- **Axis Labels**: Custom X and Y axis labels
- **Bins**: Number of bins for histogram-based charts (5-50)

### Statistical Analysis

The application automatically calculates:
- Count, Min, Max, Sum
- Mean, Median, Mode
- Range, Variance, Standard Deviation

## Chart Types Explained

### Pie Chart
- **Use Case**: Showing parts of a whole
- **Best For**: Market share, budget allocation, survey responses
- **Data Type**: Categorical with frequencies

### Bar Chart  
- **Use Case**: Comparing different categories
- **Best For**: Sales by region, population by age group
- **Data Type**: Categorical with values

### Histogram
- **Use Case**: Show distribution of continuous data
- **Best For**: Height distribution, test scores, income ranges
- **Data Type**: Continuous numerical data

### Frequency Polygon
- **Use Case**: Compare distributions between datasets
- **Best For**: Comparing test scores across classes
- **Data Type**: Continuous numerical data

### Frequency Curve
- **Use Case**: Visualize smooth distribution patterns
- **Best For**: Normal distribution, density curves
- **Data Type**: Continuous numerical data

### Ogive Curve
- **Use Case**: Find percentiles and quartiles
- **Best For**: Finding median, quartiles, percentile ranks
- **Data Type**: Continuous numerical data

## API Endpoints

### POST /api/generate-chart
Generates chart configuration for the frontend.

**Request Body:**
```json
{
  "chartType": "histogram",
  "data": {
    "values": [65, 72, 78, 85, 91],
    "labels": ["A", "B", "C", "D", "E"] // optional
  },
  "options": {
    "title": "My Chart",
    "xAxisLabel": "Categories",
    "yAxisLabel": "Frequency",
    "bins": 10
  }
}
```

**Response:**
Returns Chart.js configuration object ready for rendering.

## Project Structure

```
statistics_proj/
├── server.js           # Express.js server with chart generation logic
├── package.json        # Dependencies and scripts
├── README.md          # This file
└── public/
    ├── index.html     # Main web interface
    ├── app.js         # Frontend JavaScript logic
    └── styles.css     # CSS styling
```

## Technologies Used

- **Backend**: Node.js, Express.js
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js 4.4.0
- **Styling**: CSS Grid, Flexbox, Responsive Design

## Example Data Sets

### Categorical Data (Pie/Bar Charts)
```
Labels: Product A, Product B, Product C, Product D, Product E
Values: 30, 45, 25, 15, 35
```

### Numerical Data (Distribution Charts)  
```
Values: 12, 15, 18, 21, 24, 27, 30, 33, 36, 39, 42, 45, 48, 51, 54, 57, 60, 63, 66, 69, 72, 75, 78, 81, 84, 87, 90, 93, 96, 99
```

### Test Scores
```
Values: 65, 72, 78, 85, 91, 68, 74, 82, 88, 76, 83, 79, 86, 92, 69, 77, 84, 89, 71, 80, 87, 73, 81, 90, 75, 85, 88, 78, 82, 86, 74, 79, 83, 87, 91
```

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues or questions:
1. Check the browser console for error messages
2. Ensure data is entered in correct format (comma-separated numbers)
3. Try the sample data to verify functionality
4. Check that all required fields are filled
