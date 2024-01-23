import jwt from "jsonwebtoken";

const JWT_KEY = process.env.JWT_KEY;

function verifyToken(req, res, next) {
  let token = req.headers["authorization"];
  if (token) {
    token = token.split(" ")[1];

    jwt.verify(token, JWT_KEY, (error, valid) => {
      if (error) {
        res.status(401).send({ result: "Please provide a valid token" });
      } else {
        next();
      }
    });
  } else {
    res.status(403).send({ result: "Please add a token with the header" });
  }
}

export default verifyToken;
