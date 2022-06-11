# KasperskyPasswordManager into generic CSV

## Overview

KasperskyPasswordManager's password export feature isn't very advanced. This generates simple text in a format that is not possible to import directly into another password manager.

This script converts a KPM export file into a generic CSV file that can be used on most password managers.

## Why choose this script ?

- 📖 Fully open-sourced
- 🔒 Zero dependency
- ⛔ Zero external communication
- ⚡ Converts file in milliseconds

## Requirements

- NodeJS 10+

## Usage

```
git clone https://github.com/Treast/node-kaspersky-to-csv.git
cd ./node-kaspersky-to-csv
node app.js myPasswordFile.txt
```

This will create an **output.csv** file at the root of the project with all your passwords.
