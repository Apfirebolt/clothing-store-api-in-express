import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import bodyParser from "body-parser";
import User from './models/User.js'
import bcrypt from 'bcryptjs'
import { Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { ExtractJwt } from "passport-jwt";
import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/error-handler.js";

// import routes
import authRoutes from "./routes/auth.js";

dotenv.config();

connectDB();

const app = express();

if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
}

// Local passport
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
    },
    (email, password, done) => {
      console.log("Inside local passport");
      User.findOne({ email: email })
        .then((data) => {
          if (data === null) return done(null, false);
          else if (!bcrypt.compareSync(password, data.password)) {
            return done(null, false);
          } //no coincide la password
          return done(null, data); //login ok
        })
        .catch((err) => done(err, null)); // error en DB
    }
  )
);

let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
opts.algorithms = [process.env.JWT_ALGORITHM];

passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    console.log("Inside JWT strategy passport ");
    User.findOne({ _id: jwt_payload.sub })
      .then((data) => {
        if (data === null) {
          
          return done(null, false);
        } else return done(null, data);
      })
      .catch((err) => done(err, null)); //si hay un error lo devolvemos
  })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Success" });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
