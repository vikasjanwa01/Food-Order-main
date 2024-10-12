const fs = require('fs');

// Function to decode y-values based on their base
function decodeYValue(value, base) {
    return parseInt(value, base);
}

// Function to perform Lagrange interpolation and find the constant term
function lagrangeInterpolation(points) {
    let k = points.length;
    let constantTerm = 0;

    for (let i = 0; i < k; i++) {
        let xi = points[i].x;
        let yi = points[i].y;
        let li = 1;

        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let xj = points[j].x;
                li *= -xj / (xi - xj);
            }
        }

        constantTerm += yi * li;
    }

    return constantTerm;
}

// Main function to read input, decode values, and find the constant term
function findConstantTerm(jsonData) {
    const points = [];

    // Extract the number of roots and k
    const n = jsonData.keys.n;
    const k = jsonData.keys.k;

    // Parse each root and decode the y-values
    for (let key in jsonData) {
        if (key !== "keys") {
            let x = parseInt(key);
            let base = parseInt(jsonData[key].base);
            let value = jsonData[key].value;
            let y = decodeYValue(value, base);
            points.push({ x, y });
        }
    }

    // Sort the points by x-value (not strictly necessary but can help with debugging)
    points.sort((a, b) => a.x - b.x);

    // Use Lagrange interpolation to solve for the constant term (c)
    let constantTerm = lagrangeInterpolation(points.slice(0, k));
    return constantTerm;
}

// Read the input JSON file
fs.readFile('input.json', 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    
    const jsonData = JSON.parse(data);
    const constantTerm = findConstantTerm(jsonData);
    console.log("The constant term (c) is:", constantTerm);
});