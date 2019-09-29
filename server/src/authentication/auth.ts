import { RootLogger } from "../../../common/util/logger";
import express from "express";
import session from "express-session";

import passport from "passport";

function SetupPassport(pass: passport.Authenticator) {
    RootLogger.info("Configuring passport?");
}

export default function AuthorizationSetup(app: express.Application) {
    RootLogger.info("Setting up authorization");

    const passport_config = new passport.Passport();
    SetupPassport(passport_config);

    // Express session
    app.use(
        session({
            secret: 'secret', // TODO handle the secret through variables?
            resave: true,
            saveUninitialized: true
        })
    );

    // Passport middleware
    app.use(passport_config.initialize());
    app.use(passport_config.session());
}