import jwt from 'jsonwebtoken';
import sqlite from 'sqlite'
import uuidv1 from 'uuid/v1';

const jwtSecret = 'soemstring';

export const authenticate = async (req, res, next) => {
  const db = await sqlite.open('./src/SchoolApp.sqlite');
  const query = 'SELECT * FROM Admin WHERE username = ? AND password = ?'
  const {username, password} = req.body;
  console.log('body', req.body);
  try {
    const user = await db.get(query, [username, password])
    if (user) {
      console.log('user', user);
      req.user = user;
      console.log(user);
      next();
    } else {
      res.status(401).json({success: false, message: 'Wrong username or password'});
    }
  } catch (e) {
    res.status(500).json({error: e.message});
  }
}

export const generateJWT = async (req, res, next) => {
  if (req.user) {
    const db = await sqlite.open('./src/SchoolApp.sqlite');
    const query = 'SELECT * FROM Admin WHERE id=?';
    try {
      const jwtPayload = {id: req.user.id};
      const jwtData = {expiresIn: '2 days'};
      req.token = jwt.sign(jwtPayload, jwtSecret, jwtData);
      
      // Sets a new refresh_token every time the jwt is generated
      const user = db.get(query, [req.user.id])
      if (user) {
        const update_query = 'UPDATE Admin SET refresh_token = ? WHERE id = ?';
        await db.run(update_query, [uuidv1(), req.user.id])
      } else {
        res.status(500).json({error: 'Please contact administrator'});
      }
    } catch (e) {
      res.status(500).json({error: e.message});
    }
  }
  next();
}

export const refreshJWT = async (req, res, next) => {
  const db = await sqlite.open('./src/SchoolApp.sqlite');
  const query = 'SELECT * FROM Admin WHERE username = ? AND refresh_token = ?'
  const {username, refresh_token} = req.body;
  try {
    req.user = await db.get(query, [username, refresh_token]);
  } catch (e) {
    res.status(401).json({error: 'Invalid username or refresh_token'});
  }
}

export const returnJWT = (req, res) => {
  if (req.user && req.token) {
    res.status(201).json({
      success: true,
      results: {
        token: req.token,
        refresh_token: req.user.refresh_token,
        user: req.user,
      },
    });
  } else {
    res.status(401).json({error: 'Unauthorized'});
  }
}

export const withAuth = async (req, res, next) => {
  const token =
      req.body.token ||
      req.query.token ||
      req.headers['x-access-token'] ||
      req.cookies.token;
  const db = await sqlite.open('./src/SchoolApp.sqlite');
  
  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    jwt.verify(token, jwtSecret, function (err, decoded) {
      if (err) {
        res.status(401).send('Unauthorized: Invalid token');
      } else {
        const query = 'SELECT * FROM Admin WHERE id=?'
        req.user = db.get(query, [decoded.id]);
        next();
      }
    });
  }
}

