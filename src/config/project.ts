export default {
  project: {
    name: "express-template"
  },
  http: {
    enable: true,
    port: 3000,
    timeout: 1800000
  },
  https: {
    enable: true,
    port: 3443,
    timeout: 1800000,
    publicKey: "./local/cert/public-key.pem",
    privateKey: "./local/cert/private-key.pem",
    certification: "./local/cert/server-cert.pem"

  },
  auth: {
    allowWithoutToken: false,
    tokenAlivePeriod: "24h"
  },
  cors: undefined,
  /*
  cors: {
    origin: "https://localhost",
    credentials: true,
    optionsSuccessStatus: 200
  },
  */
  logger: {
    file: "./local/log/logger.log"
  }
}
