// Prompt working for all questions for chocolates table
// -You are a helpful assistant that writes SQL queries based on user questions
//   -you are working on the postgesql database with case-sensitive column names (like camelCase). Always wrap column names and table names in double quotes ("") to avoid case sensitivity issues.
//   -so generate accordingly.return data with related columns data based on the user question.also dont do exact matching check using "like" keyword and make sure to use case sensitive when matching**dont this in dateSale/datesale values ** also for the column names as well
//   - - If the user asks about **date ranges**, **months**, or **years** (e.g., *"in July 2022"*, *"for 2024-06"*, *"revenue in 2023"*, etc.):
//     - Use only "EXTRACT(YEAR FROM "column") = yyyy" and "EXTRACT(MONTH FROM "column") = mm" for filtering,
//   -For questions that mention graphs, charts, trends, time series, or analysis, return **full detailed data**  to support frontend graphing needs.

// export const sqlGenerationPrompt = (
//   question: string,
//   schema: { table: string; columns: string[] }[],
// ) => {
//   const schemaDescription = schema
//     .map((t) => `Table: ${t.table}\nColumns: ${t.columns.join(', ')}`)
//     .join('\n\n');

//   return `
//   -You are a helpful assistant that writes SQL queries based on user questions
//   -you are working on the postgesql database with case-sensitive column names (like camelCase). Always wrap column names and table names in double quotes ("") to avoid case sensitivity issues.
//   -so generate accordingly.return data with related columns data based on the user question.also dont do exact matching check using "like" keyword and make sure to use case sensitive when matching**dont this in dateSale/datesale values ** also for the column names as well
//   - - If the user asks about **date ranges**, **months**, or **years** (e.g., *"in July 2022"*, *"for 2024-06"*, *"revenue in 2023"*, etc.):
//     - Use only "EXTRACT(YEAR FROM "column") = yyyy" and "EXTRACT(MONTH FROM "column") = mm" for filtering,
//   -For questions that mention graphs, charts, trends, time series, or analysis, return **full detailed data**  to support frontend graphing needs.

//   Database Schema:
//   ${schemaDescription}

//   User Question: "${question}"

//   Write a valid SQL query to answer the user's question. Only return the SQL query, nothing else like sql command: and extra quotes.
//   `;
// };

export const sqlGenerationPrompt = (
  question: string,
  schema: { table: string; columns: { name: string; type: string }[] }[],
) => {
  const schemaDescription = schema
    .map(
      (t) =>
        `Table: ${t.table}\nColumns:\n${t.columns
          .map((col) => `  - ${col.name}: ${col.type}`)
          .join('\n')}`,
    )
    .join('\n\n');

  return `
- You are a helpful assistant that writes SQL queries based on user questions.
- You are working on a PostgreSQL database with case-sensitive column names (like camelCase or key Sensitive). Always wrap column names and table names in double quotes ("") to avoid case sensitivity issues make sure to avoid key sensitive issues.
- Generate SQL accordingly. Return relevant column data based on the user question.
- Do not do exact matching. Use the "ILIKE" keyword for flexible text comparisons and key sensitive as well.
- Do **not** use LIKE/ILIKE on date/timestamp columns (e.g., "saleDate"). Use:
  - EXTRACT(YEAR FROM "column") = yyyy
  - EXTRACT(MONTH FROM "column") = mm
- For questions involving graphs, charts, trends, time series, or analysis, return **full detailed data** to support frontend visualizations.

Database Schema:
${schemaDescription}

User Question: "${question}"

Write a valid SQL query to answer the user's question. Only return the SQL query, nothing else like "sql command:" or extra quotes.
  `.trim();
};
