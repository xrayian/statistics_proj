# Statistics Charts Application - GitHub Pages

This repository contains a client-side statistics charts application built with Chart.js that can generate six different types of statistical visualizations.

## 🚀 Live Demo

Visit the live application: **[Statistics Charts App](https://YOUR_USERNAME.github.io/statistics_proj)**

## 📊 Supported Chart Types

1. **Pie Chart** - Proportional distribution of categorical data
2. **Bar Chart** - Comparison across different categories  
3. **Histogram** - Frequency distribution of continuous data
4. **Frequency Polygon** - Line chart connecting histogram midpoints
5. **Frequency Curve** - Smooth curve showing distribution patterns
6. **Ogive Curve** - Cumulative frequency distribution

## ✨ Features

- **Pure Client-Side**: No server required, runs entirely in the browser
- **Interactive Interface**: Easy-to-use web interface
- **Real-time Generation**: Instant chart creation and updates
- **Statistical Analysis**: Automatic calculation of descriptive statistics
- **Sample Data**: Pre-loaded examples for testing
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Customizable**: Titles, labels, and chart parameters

## 🛠 Technologies

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js 4.4.0
- **Hosting**: GitHub Pages
- **Styling**: CSS Grid, Flexbox, Modern CSS

## 📱 Quick Start

1. Visit the live demo link above
2. Select a chart type from the dropdown
3. Enter your data or load sample data
4. Customize chart options
5. Click "Generate Chart"

## 📂 Project Structure

```
statistics_proj/
├── index.html          # Main HTML file
├── app.js             # JavaScript logic and chart generation
├── styles.css         # CSS styling
├── README.md          # This file
└── .gitignore         # Git ignore rules
```

## 🚀 GitHub Pages Deployment

This application is automatically deployed to GitHub Pages. To deploy your own version:

1. **Fork this repository**
2. **Enable GitHub Pages**:
   - Go to repository Settings
   - Scroll to "Pages" section
   - Set source to "Deploy from a branch"
   - Select "main" branch and "/" (root)
   - Click Save

3. **Access your deployed app**:
   - URL will be: `https://YOUR_USERNAME.github.io/statistics_proj`
   - May take a few minutes to deploy

## 📊 Statistical Calculations

The application automatically calculates:
- **Count**: Number of data points
- **Mean**: Average value
- **Median**: Middle value when sorted
- **Mode**: Most frequently occurring value(s)
- **Range**: Difference between max and min
- **Standard Deviation**: Measure of data spread
- **Variance**: Square of standard deviation

## 🎯 Chart Type Guide

### Pie Chart
- **Best for**: Parts of a whole, percentages
- **Data**: Categorical with frequencies
- **Example**: Market share analysis

### Bar Chart
- **Best for**: Comparing categories
- **Data**: Categorical with values
- **Example**: Sales by region

### Histogram
- **Best for**: Distribution visualization
- **Data**: Continuous numerical
- **Example**: Test score distribution

### Frequency Polygon
- **Best for**: Comparing distributions
- **Data**: Continuous numerical
- **Example**: Multiple dataset comparison

### Frequency Curve
- **Best for**: Smooth distribution patterns
- **Data**: Continuous numerical
- **Example**: Normal distribution visualization

### Ogive Curve
- **Best for**: Cumulative analysis
- **Data**: Continuous numerical
- **Example**: Percentile calculations

## 📱 Data Input Examples

**For Categorical Data (Pie/Bar Charts):**
```
Labels: Product A, Product B, Product C, Product D
Values: 30, 45, 25, 15
```

**For Numerical Data (Distribution Charts):**
```
Values: 65, 72, 78, 85, 91, 68, 74, 82, 88, 76, 83, 79, 86, 92
```

## 🏗 Local Development

To run this application locally:

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/statistics_proj.git
   cd statistics_proj
   ```

2. **Serve the files**
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Python 2
   python -m SimpleHTTPServer 8000
   
   # Using Node.js
   npx serve .
   
   # Or simply open index.html in your browser
   ```

3. **Open in browser**
   Navigate to `http://localhost:8000`

## 📱 Browser Support

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 📄 License

MIT License - feel free to use and modify for your projects.

## 👨‍💻 Author

**Rayian Bin Shiraz Mahi**
- ID: 0112330146
- Course: Math 2205

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## 📞 Support

If you encounter any issues:
1. Check the browser console for error messages
2. Ensure data is entered correctly (comma-separated numbers)
3. Try the sample data to verify functionality
4. Open an issue on GitHub

---

⭐ **Star this repository if you found it helpful!**
