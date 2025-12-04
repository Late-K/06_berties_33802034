const express = require("express");
const router = express.Router();

router.get("/books", function (req, res, next) {
  // Query database to get all the books
  let sqlquery = "SELECT * FROM books WHERE 1=1";
  let params = [];

  // Add search filter if provided
  if (req.query.search) {
    sqlquery += " AND (name LIKE ?)";
    params.push(`%${req.query.search}%`);
  }

  // Add price range filters if provided
  if (req.query.minprice) {
    sqlquery += " AND price >= ?";
    params.push(parseFloat(req.query.minprice));
  }
  if (req.query.maxprice) {
    sqlquery += " AND price <= ?";
    params.push(parseFloat(req.query.maxprice));
  }

  // Add sorting if specified
  if (req.query.sort) {
    const sortField = req.query.sort.toLowerCase();
    if (sortField == "name") {
      sqlquery += " ORDER BY name ASC";
    } else if (sortField == "price") {
      sqlquery += " ORDER BY price ASC";
    }
  }

  // Execute the sql query with parameters
  db.query(sqlquery, params, (err, result) => {
    // Return results as a JSON object
    if (err) {
      res.json(err);
      next(err);
    } else {
      res.json(result);
    }
  });
});

module.exports = router;
