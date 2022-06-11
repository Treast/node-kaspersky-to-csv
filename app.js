const path = require('path');
const fs = require('fs');

// Regex to find each information on Kaspersky format
const regexes = {
  name: /Website name: (.+)/,
  url: /Website URL: (.+)/,
  username: /Login: (.+)/,
  password: /Password: (.+)/,
  extra: /Comment: (.+)/,
};

// Better display on error
process.on('uncaughtException', (err) => {
  console.error(err);
  process.exit(1);
});

const originalPasswordFile = process.argv[2];

if (!originalPasswordFile) throw new Error('Please input the password file (node app.js myPasswordFile.txt)');

const pathPasswordFile = path.resolve(__dirname, originalPasswordFile);

if (!fs.existsSync(pathPasswordFile)) throw new Error('Password file not found');

fs.readFile(pathPasswordFile, { encoding: 'utf-8' }, (err, data) => {
  if (err) throw new Error(err);

  // Transform data into array of raw website data
  const websites = data.split(/[\r?\n]+---[\r?\n]+/g);

  const formattedWebsites = [];

  websites.forEach((website) => {
    const formattedWebsite = extractDataFromWebsite(website);
    // Only add website into list if a password AND an URL is set
    if (formattedWebsite.url && formattedWebsite.password) formattedWebsites.push(formattedWebsite);
  });

  createLastpassCSV(formattedWebsites);
});

/**
 * Output passwords using generic CSV format
 * @param {object[]} websites Formatted websites
 */
const createLastpassCSV = (websites) => {
  let output = 'url,username,password,totp,extra,name,grouping,fav\n';
  const pathOutputFile = path.resolve(__dirname, 'output.txt');

  websites.forEach((website) => {
    output += `"${website.url}","${website.username}","${website.password}",,"${website.extra}","${website.name}",,0\n`;
  });

  fs.writeFile(pathOutputFile, output, 'utf-8', (err) => {
    if (err) throw new Error(err);

    console.log('Password converted into output.txt');
    process.exit(0);
  });
};

/**
 * Format website raw data into objects
 * @param {string} websiteData Raw website data
 * @returns {object} Formatted website informations
 */
const extractDataFromWebsite = (websiteData) => {
  const formattedData = {
    name: null,
    url: null,
    username: null,
    password: null,
    extra: null,
  };

  Object.keys(regexes).forEach((key) => {
    formattedData[key] = execRegex(key, websiteData);
  });

  return formattedData;
};

/**
 * Apply regex on raw data
 * @param {string} regexIndex Which information to find
 * @param {string} data Raw website data
 * @returns {string} Information requested or empty string if not found
 */
const execRegex = (regexIndex, data) => {
  const result = regexes[regexIndex].exec(data);
  return result ? result[1] : '';
};
