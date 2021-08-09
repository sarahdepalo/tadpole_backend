const router = require("express").Router();
const pool = require("../conn");
const bcrypt = require("bcrypt");
const jwtGenerator = require("../models/jwtGenerator");
const validInfo = require("../middleware/validInfo");
const authorization = require("../middleware/authorization");

//Register Route
router.post("/register", validInfo, async (req, res) => {
  try {
    //All the info we receive back from the form needed for our database
    const {
      firstName,
      lastName,
      email,
      password,
      primaryLocationState,
      primaryLocationCity,
      primaryLocationZip,
    } = req.body;

    const query = `SELECT * FROM users WHERE email = '${email}';`;
    const user = await pool.query(query);

    //Since email is set to unique in our DB there should only be one user returned or none.
    if (user.rows.length > 0) {
      return res.status(401).send("User already Exists");
    } else {
      //If a user does not exist...

      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      //Wait for bcrypt to 'salt' our password 10 times.

      //Our new and safe password!
      const bcryptPassword = await bcrypt.hash(password, salt);

      const newUser = await pool.query(
        `INSERT INTO users 
            (firstName, lastName, email, password, primaryLocationState, primaryLocationCity, primaryLocationZip)
        VALUES
            ('${firstName}', '${lastName}', '${email}', '${bcryptPassword}', '${primaryLocationState}', '${primaryLocationCity}', ${primaryLocationZip})
        RETURNING *;`
      ); // Don't forget the return * so you have access to the id for jwt auth

      //Grab the idea created with our new user and generate a JWT token
      console.log(newUser);
      const token = jwtGenerator(newUser.rows[0].id);
      console.log("Token: ", token);
      res.json({ token });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

//Login Route
router.post("/login", validInfo, async (req, res) => {
  try {
    //1. Destructure the req.body

    const { email, password } = req.body;

    //2. Check if user doesn't exist -> throw error if not

    const user = await pool.query(
      `SELECT * FROM users WHERE email = '${email}';`
    );

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid email, please try again or register an account");
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json("Password is incorrect");
    }

    //4. Give them JWT Token
    const token = jwtGenerator(user.rows[0].id);
    res.json({ token });

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

router.get("/verify", authorization, (req, res) => {
  try {
    res.json(true);
  } catch (error) {
    console.error("ERROR: ",error.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
