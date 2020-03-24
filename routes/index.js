const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("<h1> welcome :D </h1>").status(200);
});

module.exports = router;