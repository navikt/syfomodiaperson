import express = require("express");
import connectRedis = require("connect-redis");
import session = require("express-session");

import Config = require("./config");
import { getValkeyClient } from "./valkey";

const SESSION_MAX_AGE_MILLIS = 12 * 60 * 60 * 1000;

const SESSION_MAX_AGE_SECONDS = SESSION_MAX_AGE_MILLIS / 1000;

const getValkeyStore = () => {
  if (Config.isDev) return undefined;
  const RedisStore = connectRedis(session);
  return new RedisStore({
    client: getValkeyClient(),
    ttl: SESSION_MAX_AGE_SECONDS,
    disableTouch: true,
  });
};

export const setupSession = (app: express.Application) => {
  app.set("trust proxy", 1);

  app.use(
    session({
      cookie: {
        maxAge: SESSION_MAX_AGE_MILLIS,
        sameSite: "lax",
        httpOnly: true,
        secure: Config.isProd,
      },
      secret: Config.server.sessionKey,
      name: Config.server.sessionCookieName,
      resave: true,
      saveUninitialized: false,
      unset: "destroy",
      store: getValkeyStore(),
      rolling: true,
    })
  );
};

module.exports = {
  setupSession: setupSession,
};
