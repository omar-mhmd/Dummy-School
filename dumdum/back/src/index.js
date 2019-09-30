import uuidv1 from "uuid/v1";
import app from "./app";
import express from "express";
import sqlite from "sqlite";
import path from "path";
import fs from "fs";
import SQL from "sql-template-strings";
import {
  authenticate,
  generateJWT,
  returnJWT,
  refreshJWT,
  withAuth
} from "./auth";
import multer from "multer";
import unzip from "unzip";

const nodemailer = require("nodemailer");
const slugify = string => {
  const a =
    "àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;";
  const b =
    "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnooooooooprrsssssttuuuuuuuuuwxyyzzz------";
  const p = new RegExp(a.split("").join("|"), "g");

  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
};
var storage = multer.diskStorage({
  destination: path.join(__dirname, "/../private/docs"),
  filename: (req, file, cb) => {
    const date = Date.now();
    const file_name = `${date}-file-${file.originalname.replace(".zip", "")}`;
    cb(null, slugify(file_name) + ".zip");
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // if the file extension is in our accepted list
    if (["zip"].some(ext => file.originalname.endsWith("." + ext))) {
      return cb(null, true);
    }

    // otherwise, return error
    return cb(
      new Error("Only " + ["zip"].join(", ") + " files are allowed!"),
      false
    );
  }
});
const start = async () => {
  const db = await sqlite.open("./src/SchoolApp.sqlite");

  const isProfessor = async (req, res, next) => {
    const pin = req.body.pin || req.query.pin || req.headers["pin"];
    if (!pin) {
      res.json({
        success: false,
        message: "Pin not provided"
      });
    }
    const query = "SELECT * FROM Professor WHERE pin = ?";
    const student = await db.all(query, [pin]);
    if (student.length === 0) {
      res.json({
        success: false,
        message: "Please check you pin"
      });
    }
    next();
  };
  app.get("/docs/**/*.html", isProfessor);
  app.use(express.static("public/documents"));

  app.post("/uploadfile", upload.single("image"), async (req, res, next) => {
    const file = req.file;
    if (!file) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }
    let sql = `INSERT INTO Files (filename, grdid) Values ("${file.filename}", 8)`;
    const answer = await db.run(sql);
    if (answer.changes > 0) {
      res.json({
        success: true,
        filename: file.filename
      });
    }
  });

  app.post("/insertpin", upload.none(), async (req, res, next) => {
    var pwd = JSON.parse(req.body.pwd);
    console.log("pwd", pwd);
    var date = req.body.date;
    console.log("the body is ", pwd, date);
    if (!pwd && !date) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }

    pwd.map(async pin => {
      try {
        let sql = `INSERT INTO Prof (pinprof, expdate,grdid) Values ("${pin}",${date}, 8)`;
        console.log(sql);
        const answer = await db.run(sql);
        console.log("hello", answer);
      } catch (err) {
        res.json({
          success: false,
          pin: pwd,
          dates: date
        });
      }
    });
    res.json({
      success: true,
      pin: pwd,
      dates: date
    });
  });

  app.post("/login", authenticate, generateJWT, returnJWT);
  app.post("/check_token", withAuth, (req, res) => {
    res.json({
      success: true,
      results: {
        user: req.user
      }
    });
  });
  app.post("/password", upload.none(), async (req, res, next) => {
    var email = req.body.email;

    console.log(email);
    if (!email) {
      const error = new Error("Please upload a file");
      error.httpStatusCode = 400;
      return next(error);
    }
    let sql = SQL`SELECT * FROM Admin WHERE email= ${email} `;

    try {
      const answer = await db.all(sql);
      const user = answer[0];
      if (!user) {
        res.json({
          success: false,
          email: email
        });
      } else {
        const transport = {
          service: "Gmail",
          auth: {
            user: "prefab.houses.lb@gmail.com",
            pass: "Pass4prefab"
          }
        };

        const transporter = nodemailer.createTransport(transport);
        const option = {
          from: `${req.body.email}`,
          to: `${req.body.email}`,
          subject: "Hello Mrs Maissaa",
          html: ` <h3>Message Contact</h3>
                    <ul>
                        <li>Name :${req.body.name}</li>
                        <li>Email :${req.body.email}</li>
                    </ul>
                    <h3>Message</h3>
                    <p>${req.body.message}</p>`
        };
        transporter.sendMail(option, (err, info) => {
          err ? console.log(err) : console.log("Email has sent....");
        });
        res.json({
          success: true,
          email: email
        });
      }
    } catch (err) {
      console.log(err);
    }
  });

  /*teacher enter pin */
  app.post("/teacherpin", upload.none(), async (req, res, next) => {
    var pin = req.body.pin;
    if (!pin) {
      const error = new Error("Please insert your right pin");
      error.httpStatusCode = 400;
      return next(error);
    }
    let sql = SQL`SELECT pin FROM Professor WHERE pin = ${pin} `;
    try {
      const answer = await db.get(sql);
      const user = answer;
      console.log("hello", answer);
      if (!user) {
        res.json({
          success: false,
          pin: pin
        });
      } else {
        res.json({
          success: true,
          pin: pin
        });
      }
    } catch (err) {
      console.log(err);
    }
  });

  /* student enter pin*/
  app.post("/studentspin", upload.none(), async (req, res, next) => {
    var pin = req.body.pin;
    if (!pin) {
      const error = new Error("Please insert your right pin");
      error.httpStatusCode = 400;
      return next(error);
    }
    let sql = SQL`SELECT pin FROM Students WHERE pin = ${pin} `;
    try {
      const answer = await db.get(sql);
      const user = answer;
      console.log("hello", answer);
      if (!user) {
        res.json({
          success: false,
          pin: pin
        });
      } else {
        res.json({
          success: true,
          pin: pin
        });
      }
    } catch (err) {
      console.log(err);
    }
  });

  app.get("/admin", async (req, res) => {
    const sql = "SELECT * FROM Admin";
    console.log(sql);
    try {
      const admins = await db.all(sql);
      res.json({
        success: true,
        results: admins
      });
    } catch (e) {
      res.status("404").json({
        success: false,
        message: e.message
      });
    }
  });

  app.get("/admin/:id", async (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM Admin WHERE id=${id}`;
    try {
      const admin = await db.get(sql);
      console.log("admin ", admin);
      console.log("id ", id);
      res.json({
        success: true,
        results: admin
      });
    } catch (e) {
      console.log(e);
      res.status(404).json({
        success: false,
        message: `No admin available with ID: ${id}`
      });
    }
  });

  app.post("/admin", async (req, res) => {
    const { username, email, password } = req.body;
    console.log("body", req.body);
    const sql = `INSERT INTO Admin (username, email, password, refresh_token) Values ("${username}", "${email}", "${password}", "${uuidv1()}")`;
    try {
      const row = await db.run(sql);
      res.json({
        success: true,
        results: {
          ...row
        }
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: e.message
      });
    }
  });

  app.put("/admin/:id", async (req, res) => {
    const sql = `UPDATE Admin SET password = ?`;
    const { password } = req.body;

    try {
      const row = await db.run(sql, [password]);
      res.json({
        success: true,
        results: {
          ...row //what is the meaning of the 3 dots ?
        }
      });
    } catch (e) {
      res.status("404").json({
        success: false,
        message: e.message
      });
    }
  });
  app.delete("/admin/:id", async (req, res) => {
    const { id } = req.params;
    const sql = `DELETE Admin WHERE id=?`;
    try {
      const row = await db.run(sql, [id]);
      res.json({
        success: true,
        results: {
          ...row
        }
      });
    } catch (e) {
      res.status("404").json({
        success: false,
        message: e.message
      });
    }
  });

  app.get("/grade", async (req, res) => {
    const sql = "SELECT * FROM Grade";
    console.log(sql);
    try {
      const grades = await db.all(sql);
      res.json({
        success: true,
        results: grades
      });
    } catch (e) {
      res.status("404").json({
        success: false,
        message: e.message
      });
    }
  });

  app.get("/grade/:id", async (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM Grade WHERE id=${id}`;
    try {
      const grade = await db.get(sql);
      res.json({
        success: true,
        results: grade
      });
    } catch (e) {
      console.log(e);
      res.status(404).json({
        success: false,
        message: `No grade available with ID: ${id}`
      });
    }
  });

  app.post("/grade", async (req, res) => {
    const { name } = req.body;
    console.log("body", req.body);
    const sql = `INSERT INTO Grade (name) Values ("${name}")`;
    try {
      const row = await db.run(sql);
      res.json({
        success: true,
        results: {
          ...row
        }
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: e.message
      });
    }
  });

  app.put("/grade/:id", async (req, res) => {
    const sql = `UPDATE Grade SET name = ? WHERE id = ?`;
    const { id } = req.params;
    const { name } = req.body;

    try {
      const row = await db.run(sql, [name, id]);
      res.json({
        success: true,
        results: {
          ...row
        }
      });
    } catch (e) {
      res.status("404").json({
        success: false,
        message: e.message
      });
    }
  });

  app.delete("/grade/:id", async (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM Grade WHERE id = ?`;
    try {
      const row = await db.run(sql, [id]);
      res.json({
        success: true,
        results: {
          ...row
        }
      });
    } catch (e) {
      res.status("404").json({
        success: false,
        message: e.message
      });
    }
  });

  app.get("/student", async (req, res) => {
    const sql = "SELECT * FROM Students";
    console.log(sql);
    try {
      const admins = await db.all(sql);
      res.json({
        success: true,
        results: admins
      });
    } catch (e) {
      res.status("404").json({
        success: false,
        message: e.message
      });
    }
  });

  app.get("/student/:id", async (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM Students WHERE id=${id}`;
    try {
      const admin = await db.get(sql);
      console.log("admin ", admin);
      console.log("id ", id);
      res.json({
        success: true,
        results: admin
      });
    } catch (e) {
      console.log(e);
      res.status(404).json({
        success: false,
        message: `No student available with ID: ${id}`
      });
    }
  });

  app.post("/student", async (req, res) => {
    const { pin, expiry_date, grade_id } = req.body;
    console.log("body", req.body);
    const sql = `INSERT INTO Students (pin, expiry_date, grade_id) Values (? , ?, ?)`;
    try {
      const row = await db.run(sql, [pin, expiry_date, grade_id]);
      res.json({
        success: true,
        results: {
          ...row
        }
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: e.message
      });
    }
  });

  app.put("/student/:id", async (req, res) => {
    const sql = `UPDATE Students SET pin = ?, expiry_date=?, grade_id=? WHERE id = ?`;
    const { pin, expiry_date, grade_id } = req.body;
    const { id } = req.params;

    try {
      const row = await db.run(sql, [pin, expiry_date, grade_id, id]);
      res.json({
        success: true,
        results: {
          ...row
        }
      });
    } catch (e) {
      res.status("404").json({
        success: false,
        message: e.message
      });
    }
  });

  app.delete("/student/:id", async (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM Students WHERE id=?`;
    try {
      const row = await db.run(sql, [id]);
      res.json({
        success: true,
        results: {
          ...row
        }
      });
    } catch (e) {
      res.status("404").json({
        success: false,
        message: e.message
      });
    }
  });

  app.get("/professor", async (req, res) => {
    const sql = "SELECT * FROM Professor";
    console.log(sql);
    try {
      const professors = await db.all(sql);
      res.json({
        success: true,
        results: professors
      });
    } catch (e) {
      res.status("404").json({
        success: false,
        message: e.message
      });
    }
  });

  app.get("/professor/:id", async (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM Professor WHERE id=${id}`;
    try {
      const professor = await db.get(sql);
      res.json({
        success: true,
        results: professor
      });
    } catch (e) {
      console.log(e);
      res.status(404).json({
        success: false,
        message: `No professor available with ID: ${id}`
      });
    }
  });

  app.post("/professor", async (req, res) => {
    const { pin, expiry_date, grade_id } = req.body;
    console.log("body", req.body);
    const sql = `INSERT INTO Professor (pin, expiry_date, grade_id) Values (? , ?, ?)`;
    try {
      const row = await db.run(sql, [pin, expiry_date, grade_id]);
      res.json({
        success: true,
        results: {
          ...row
        }
      });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        success: false,
        message: e.message
      });
    }
  });

  app.put("/professor/:id", async (req, res) => {
    const sql = `UPDATE Professor SET pin = ?, expiry_date=?, grade_id=? WHERE id = ?`;
    const { pin, expiry_date, grade_id } = req.body;
    const { id } = req.params;

    try {
      const row = await db.run(sql, [pin, expiry_date, grade_id, id]);
      res.json({
        success: true,
        results: {
          ...row
        }
      });
    } catch (e) {
      res.status("404").json({
        success: false,
        message: e.message
      });
    }
  });

  app.delete("/professor/:id", async (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM Professor WHERE id=?`;
    try {
      const row = await db.run(sql, [id]);
      res.json({
        success: true,
        results: {
          ...row
        }
      });
    } catch (e) {
      res.status("404").json({
        success: false,
        message: e.message
      });
    }
  });

  app.get("/file", async (req, res) => {
    const sql = "SELECT * FROM Files";
    console.log(sql);
    try {
      const files = await db.all(sql);

      res.json({
        success: true,
        results: files.map(file => {
          return {
            ...file
          };
        })
      });
    } catch (e) {
      res.status("404").json({
        success: false,
        message: e.message
      });
    }
  });

  app.get("/file/:id", async (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM Files WHERE id=${id}`;
    try {
      const file = await db.get(sql);
      res.json({
        success: true,
        results: {
          ...file
        }
      });
    } catch (e) {
      console.log(e);
      res.status(404).json({
        success: false,
        message: `No professor available with ID: ${id}`
      });
    }
  });

  app.get("/file/students/:id", async (req, res) => {
    const { id } = req.params;
    const sql = `SELECT * FROM Files WHERE grade_id=${id}`;
    try {
      const file = await db.all(sql);
      res.json({
        success: true,
        results: {
          ...file
        }
      });
    } catch (e) {
      console.log(e);
      res.status(404).json({
        success: false,
        message: `No book available with grade_id: ${id}`
      });
    }
  });

  app.post(
    "/file",
    (req, res, next) => {
      upload.single("file")(req, res, next, err => {
        if (err) {
          console.log("error => ", helloerr);
          return res.json({
            success: false,
            message: "Invalid file"
          });
        }
        next();
      });
    },
    async (req, res) => {
      const file = req.file;
      const { grade_id } = req.body;
      console.log("file ", file);
      if (!file) {
        const error = new Error("Please upload a file");
        error.httpStatusCode = 400;
        return next(error);
      }
      fs.createReadStream(file.path).pipe(
        unzip.Extract({
          path:
            __dirname +
            "/../public/documents/docs/" +
            file.filename.replace(".zip", "")
        })
      );
      let sql = `INSERT INTO Files (file_path, file_name, grade_id) Values (?, ?, ?)`;

      try {
        const file_name = file.originalname.replace(".zip", "");
        await db.run(sql, [
          file.filename.replace(".zip", ""),
          file_name,
          grade_id
        ]);
        res.json({
          success: true,
          filename: file.filename
        });
      } catch (e) {
        res.json({
          success: false,
          message: e.message
        });
      }
    }
  );

  app.delete("/file/:id", async (req, res) => {
    const { id } = req.params;
    const find_file_query = "SELECT * FROM Files WHERE id=?";
    const sql = `DELETE FROM Files WHERE id=?`;
    try {
      const file = await db.get(find_file_query, [id]);
      fs.unlinkSync(`${__dirname}/../public/docs/${file.file_name}`);
      const row = await db.run(sql, [id]);
      res.json({
        success: true,
        results: {
          ...row
        }
      });
    } catch (e) {
      res.status("404").json({
        success: false,
        message: e.message
      });
    }
  });

  app.get("/docs/professor", isProfessor, async (req, res, next) => {
    // did not understand this route
    const pin = req.body.pin || req.query.pin || req.headers["pin"];
    const professor = await db.get("SELECT * FROM Professor WHERE pin = ?", [
      pin
    ]);
    if (professor) {
      const grade_id = professor.grade_id;
      const documents = await db.all("SELECT * FROM Files WHERE grade_id = ?", [
        grade_id
      ]);

      return res.json({
        success: true,
        results: documents
      });
    }
  });

  app.listen(8080, () => console.log("server listening on port 8080"));
};
start();
