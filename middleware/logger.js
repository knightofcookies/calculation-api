const { Log } = require("../models");

const dbLogger = (req, res, next) => {
  const oldJson = res.json;
  const oldSend = res.send;
  let responseBody = null;

  res.json = (body) => {
    responseBody = body;
    return oldJson.call(res, body);
  };

  res.send = (body) => {
    responseBody = body;
    return oldSend.call(res, body);
  };

  res.on("finish", async () => {
    try {
      await Log.create({
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        userId: req.user ? req.user.id : null,
        ipAddress: req.ip,
        requestBody:
          req.body && Object.keys(req.body).length
            ? JSON.stringify(req.body)
            : null,
        responseBody: responseBody ? JSON.stringify(responseBody) : null,
      });
    } catch (error) {
      console.error("Failed to log request:", error);
    }
  });

  next();
};

module.exports = dbLogger;
