import { APPS } from "../shopify-table-names";

export const selectCount = (table: string): string => {
  return `
    SELECT COUNT(*) AS c
    FROM ${table}
  `
};

export const selectRowById = (id: number, table: string): string => {
  return `
    SELECT *
    FROM ${table}
    WHERE id = '${id}'
  `
};

export const selectCategoryByTitle = (title: string): string => {
  return `
    SELECT *
    FROM CATEGORIES
    WHERE title = '${title}'
  `
};

export const selectAppCategoriesByAppId = (appId: number): string => {
  return `
    SELECT t1.category_id AS category_id, t2.title AS app_title, t3.title as category_title
    FROM APPS_CATEGORIES AS t1   
    LEFT JOIN APPS AS t2 
    ON t2.id = t1.app_id   
    LEFT JOIN CATEGORIES AS t3 
    ON t3.id = t1.category_id    
    WHERE t1.app_id = '${appId}'
  `
};

export const selectUnigueRowCount = (tableName: string, columnName: string): string => {
  return `
    SELECT count(*) AS c
    FROM (
      SELECT DISTINCT ${columnName}
      FROM ${tableName}  
    )   
  `
};

export const selectReviewByAppIdAuthor = (appId: number, author: string): string => {
  return `
    SELECT *
    FROM REVIEWS
    WHERE app_id = ${appId}
    AND author = '${author}';
  `
};

export const selectColumnFromTable = (columnName: string, tableName: string): string => {
  return `
    SELECT ${columnName}
    FROM ${tableName}   
  `
};

