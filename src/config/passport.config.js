const passport = require('passport');
const local = require('passport-local')
const githubStrategy = require('passport-github2')
const userModel = require('../dao/users.model');
const { createHash, isValidPassword } = require('../utils');

const localStrategy = local.Strategy;

const initializePassport = () => {

    passport.use("register", new localStrategy({
        usernameField: "email",
        passReqToCallback: true,
    }, async (req, email, password, done) => {
        try {
            const { email, password, first_name, last_name } = req.body;
            const user = await userModel.findOne({ email });
            if (user) return done(null, false, { message: "El usuario ya está registrado" });

            const newUser = {
                first_name,
                last_name,
                email,
                password: await createHash(password),
            }
            const result = await userModel.create(newUser);
            return done(null, result);
        } catch (error) {
            return done(error);
        }
    }))

    passport.use("login", new localStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
                const user = await userModel.findOne({ email });
                if (!user) return done(null, false, { message: "Usuario o contraseña incorrectas" });

                const isMatch = await isValidPassword(user, password);
                if (!isMatch) return done(null, false, { message: "Usuario o contraseña incorrectas" });

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }))

    passport.use("github",
        new githubStrategy({
            clientID: 'Iv1.27e77a620b0df094',
            clientSecret: '568ba745aab73d8e6c9de3cddf121787dbc011ed',
            callbackURL: "http://localhost:8080/api/sessions/githubcallback"
        },
            async (accessToken, refreshToken, profile, done) => {
                try {
                    const user = await userModel.findOne({ email: profile._json.email });

                    if (!user) {
                        const newUser = {
                            first_name: profile._json.name.split(" ")[0],
                            last_name: profile._json.name.split(" ")[2],
                            email: profile._json.email,
                            password: "",
                        };
                        const createdUser = await userModel.create(newUser);

                        return done(null, createdUser);
                    } else {
                        return done(null, user);
                    }
                } catch (error) {
                    return done(error);
                }
            }

        ))




    passport.serializeUser((user, done) => {
        done(null, user._id);
    }
    );

    passport.deserializeUser(async (id, done) => {
        const user = await userModel.findById(id);
        done(null, user);
    })
}

module.exports = initializePassport;


