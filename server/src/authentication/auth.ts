import { RootLogger } from "../../../common/util/logger";
import express from "express";
import session from "express-session";

import passport from "passport";

function SetupPassport(pass: passport.Authenticator) {
    RootLogger.info("Configuring passport?");
}

export default function AuthorizationSetup(app: express.Application) {
    RootLogger.info("Setting up authorization");

    const passportConfig = new passport.Passport();
    SetupPassport(passportConfig);

    // Express session
    app.use(
        session({
            secret: 'secret', // TODO handle the secret through variables?
            resave: true,
            saveUninitialized: true
        })
    );

    // Passport middleware
    app.use(passportConfig.initialize());
    app.use(passportConfig.session());
}