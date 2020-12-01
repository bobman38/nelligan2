"use strict";
var api = require("nelligan-api");

module.exports.hold = async (event) => {
  try {
    let hold = await api.hold(event.queryStringParameters);
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify(hold),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
      body: JSON.stringify({
        message: e.message,
      }),
    };
  }
};
