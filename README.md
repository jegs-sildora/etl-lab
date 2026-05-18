# Lab 1: Data Integration and ETL - Fetching Data from an API

## Project Overview
This project demonstrates a simple ETL (Extract, Transform, Load) pipeline using plain Node.js without any external frameworks or npm packages.

### ETL Stages:
1. **Extract:** Fetches user data from the [JSONPlaceholder API](https://jsonplaceholder.typicode.com/users) and post data from the [/posts](https://jsonplaceholder.typicode.com/posts) endpoint using the built-in `fetch()` function.
2. **Transform:**
   - Flattens nested JSON objects (address, geo, and company).
   - Cleans data by trimming whitespace and converting fields to lowercase.
   - Calculates a `postCount` for each user by joining with post data.
   - Filters out records with invalid emails.
3. **Load:** Formats the cleaned data as CSV and writes it to `output.csv` using the built-in `fs` module.

## Prerequisites
- **Node.js 18+**: Required for built-in `fetch` and modern JavaScript features.

## Usage
To execute the ETL pipeline, run the following command in your terminal:
```bash
node etl.js
```

## Lab Documentation
The following PDF contains the full lab requirements, tasks, and completed assessment details.

<object data="ITSAR2_LAB_1.pdf" type="application/pdf" width="100%" height="800px">
    <p>Your browser does not support embedding PDFs. You can <a href="ITSAR2_LAB_1.pdf">download the PDF</a> to view it.</p>
</object>
