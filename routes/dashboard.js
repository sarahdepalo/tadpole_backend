const router = require("express").Router();
const pool = require("../conn");
const authorization = require("../middleware/authorization");

router.get("/", authorization, async (req, res) => {
    try {
        const user = await pool.query(`SELECT firstName, primarylocationzip, primarylocationcity from users WHERE id = ${req.user};`)

        res.json(user.rows[0]);

    } catch(error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});



module.exports = router;