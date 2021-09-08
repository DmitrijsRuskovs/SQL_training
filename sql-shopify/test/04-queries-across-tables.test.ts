import { Database } from "../src/database";
import { minutes } from "./utils";

describe("Queries Across Tables", () => {
    let db: Database;

    beforeAll(async () => {
        db = await Database.fromExisting("03", "04");
    }, minutes(1));

    it("should select count of apps which have free pricing plan", async done => {
        const query = `
          SELECT COUNT(*) AS count
          FROM PRICING_PLANS t1
          LEFT JOIN APPS_PRICING_PLANS AS t2 
          ON t2.pricing_plan_id = t1.id            
          WHERE t1.price LIKE '%Free%'        
        `;
        const result = await db.selectSingleRow(query);
        expect(result).toEqual({
            count: 1112
        });
        done();
    }, minutes(1));

    it("should select top 3 most common categories", async done => {
        const query = `
          SELECT t1.title AS category, COUNT (*) AS count       
          FROM CATEGORIES AS t1
          LEFT JOIN APPS_CATEGORIES AS t2 
          ON t2.category_id = t1.id                        
          GROUP BY category      
          ORDER BY count DESC
          LIMIT 3;            
        `;
        const result = await db.selectMultipleRows(query);
        expect(result).toEqual([
            { count: 1193, category: "Store design" },
            { count: 723, category: "Sales and conversion optimization" },
            { count: 629, category: "Marketing" }
        ]);
        done();
    }, minutes(1));

    it("should select top 3 prices by appearance in apps and in price range from $5 to $10 inclusive (not matters monthly or one time payment)", async done => {
        const query = `
          SELECT 
          t1.price AS price, 
          CAST(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(price,'$',''),' one time charge',''),'/month',''),'Free to install','0'),'Free','0') AS FLOAT) AS casted_price, 
          COUNT (*) AS count       
          FROM PRICING_PLANS t1
          LEFT JOIN APPS_PRICING_PLANS AS t2 
          ON t2.pricing_plan_id = t1.id
          WHERE casted_price >= 5 AND casted_price <= 10        
          GROUP BY casted_price     
          ORDER BY count DESC
          LIMIT 3;            
        `;
        const result = await db.selectMultipleRows(query);
        expect(result).toEqual([
            { count: 225, price: "$9.99/month", casted_price: 9.99 },
            { count: 135, price: "$5/month", casted_price: 5 },
            { count: 114, price: "$10/month", casted_price: 10 }
        ]);
        done();
    }, minutes(1));
});