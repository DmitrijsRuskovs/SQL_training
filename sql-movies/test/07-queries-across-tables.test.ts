import { Database } from "../src/database";
import { minutes } from "./utils";

describe("Queries Across Tables", () => {
  let db: Database;

  beforeAll(async () => {
    db = await Database.fromExisting("06", "07");
  }, minutes(3));

  it(
    "should select top three directors ordered by total budget spent in their movies",
    async done => {
      const query = `
        SELECT t3.full_name AS director, ROUND(SUM(t2.budget_adjusted),2) AS total_budget
        FROM MOVIE_DIRECTORS t1
        LEFT JOIN MOVIES AS t2 
        ON t2.id = t1.movie_id       
        LEFT JOIN DIRECTORS AS t3 
        ON t3.id = t1.director_id
        GROUP BY t1.director_id
        ORDER BY ROUND(SUM(t2.budget_adjusted),2) DESC
        LIMIT 3;            
      `;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          director: "Ridley Scott",
          total_budget: 722882143.58
        },
        {
          director: "Michael Bay",
          total_budget: 518297522.1
        },
        {
          director: "David Yates",
          total_budget: 504100108.5
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select top 10 keywords ordered by their appearance in movies",
    async done => {
      const query = `
        SELECT t3.keyword AS keyword, COUNT(*) AS count
        FROM MOVIE_KEYWORDS t1
        LEFT JOIN MOVIES AS t2 
        ON t2.id = t1.movie_id       
        LEFT JOIN KEYWORDS AS t3 
        ON t3.id = t1.keyword_id
        GROUP BY t1.keyword_id
        ORDER BY count DESC
        LIMIT 10;            
      `;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          keyword: "woman director",
          count: 162
        },
        {
          keyword: "independent film",
          count: 115
        },
        {
          keyword: "based on novel",
          count: 85
        },
        {
          keyword: "duringcreditsstinger",
          count: 82
        },
        {
          keyword: "biography",
          count: 78
        },
        {
          keyword: "murder",
          count: 66
        },
        {
          keyword: "sex",
          count: 60
        },
        {
          keyword: "revenge",
          count: 51
        },
        {
          keyword: "sport",
          count: 50
        },
        {
          keyword: "high school",
          count: 48
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select one movie which has highest count of actors",
    //Not correct test - maximum is 5 actors, even for 3 entries of "Life" in db
    async done => {
      const query = `
        SELECT t2.original_title AS original_title, COUNT(*) AS count
        FROM MOVIE_ACTORS t1
        LEFT JOIN MOVIES AS t2 
        ON t2.id = t1.movie_id       
        GROUP BY t2.original_title
        ORDER BY count DESC
        LIMIT 1;            
      `;
      const result = await db.selectSingleRow(query);

      expect(result).toEqual({
        original_title: "Life",
        count: 12
      });

      done();
    },
    minutes(3)
  );

  it(
    "should select three genres which has most ratings with 5 stars",
    async done => {
      const query = `
        SELECT t3.genre AS genre, COUNT(*) AS five_stars_count       
        FROM MOVIE_GENRES t1
        LEFT JOIN MOVIE_RATINGS AS t2 
        ON t2.movie_id = t1.movie_id          
        LEFT JOIN GENRES AS t3 
        ON t3.id = t1.genre_id       
        WHERE t2.rating >= 5    
        GROUP BY t1.genre_id       
        ORDER BY five_stars_count DESC
        LIMIT 3;            
      `;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          genre: "Drama",
          five_stars_count: 15052
        },
        {
          genre: "Thriller",
          five_stars_count: 11771
        },
        {
          genre: "Crime",
          five_stars_count: 8670
        }
      ]);

      done();
    },
    minutes(3)
  );

  it(
    "should select top three genres ordered by average rating",
    async done => {
      const query = `
        SELECT t3.genre AS genre, ROUND(AVG(t2.rating),2) AS avg_rating       
        FROM MOVIE_GENRES t1
        LEFT JOIN MOVIE_RATINGS AS t2 
        ON t2.movie_id = t1.movie_id          
        LEFT JOIN GENRES AS t3 
        ON t3.id = t1.genre_id       
        GROUP BY t1.genre_id       
        ORDER BY avg_rating DESC
        LIMIT 3;            
      `;
      const result = await db.selectMultipleRows(query);

      expect(result).toEqual([
        {
          genre: "Crime",
          avg_rating: 3.79
        },
        {
          genre: "Music",
          avg_rating: 3.73
        },
        {
          genre: "Documentary",
          avg_rating: 3.71
        }
      ]);

      done();
    },
    minutes(3)
  );
});
