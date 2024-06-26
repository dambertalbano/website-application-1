import express from 'express';
import jwt from "jsonwebtoken";
import con from "../utils/db.js";

const router = express.Router()

router.post("/student_login", (req, res) => {
  const sql = "SELECT id, email FROM student WHERE email = ? AND password = ?";
  con.query(sql, [req.body.email, req.body.password], (err, result) => {
    if (err) return res.json({ loginStatus: false, Error: "Query error" });
    if (result.length > 0) {
      const email = result[0].email;
      const id = result[0].id;
      const token = jwt.sign(
        { role: "student", email: email, id: id },
        "jwt_secret_key",
        { expiresIn: "1d" }
      );
      res.cookie('token', token)
      return res.json({ loginStatus: true, id: id });
    } else {
      return res.json({ loginStatus: false, Error: "Wrong email or password" });
    }
  });
});

  router.get('/detail/:id', (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM student where id = ?"
    con.query(sql, [id], (err, result) => {
        if(err) return res.json({Status: false});
        return res.json(result)
    })
  })

  router.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: true})
  })

  export { router as StudentRouter };


