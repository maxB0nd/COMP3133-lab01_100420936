const fs = require("fs");
const csv = require('csv-parser');
const results = [];

function deleteFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.log(`Error deleting file: ${filePath}`);
    }
  });
}

function addLineToFile(filePath, line) {
  fs.appendFile(filePath, `${line}\n`, (err) => {
    if (err) {
      console.log(`Error writing to file : ${filePath}`);
    }
  });
}

// 1. Read input_countries.csv 
fs.createReadStream('input_countries.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    const canadaFileName = 'canada.txt', usaFileName = 'usa.txt';
    if (results.length > 0) {
      // 2. Delete canada.txt and usa.txt if already exist using fs module 
      deleteFile(canadaFileName);
      deleteFile(usaFileName);
      // 3. Filter data of Canada and write data to canada.txt
      let canada = results.filter(i => !!i.country && i.country.toLowerCase() == 'canada');
      addLineToFile(canadaFileName, 'country,year,population');
      canada.forEach(i => { addLineToFile(canadaFileName, `${i.country},${i.year},${i.population}`); });
      // 4. Filter data of United States and write data to usa.txt
      let usa = results.filter(i => !!i.country && i.country.toLowerCase() == 'united states');
      addLineToFile(usaFileName, 'country,year,population');
      usa.forEach(i => { addLineToFile(usaFileName, `${i.country},${i.year},${i.population}`); });
    }
  });
