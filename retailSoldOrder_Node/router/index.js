/*eslint new-cap: 0, no-console: 0, no-shadow: 0, no-unused-vars: 0*/
/*eslint-env es6, node*/

"use strict";

var apiProxy = require("./routes/api-proxy");

module.exports = (app, server) => {
	app.use("/api-proxy", apiProxy());

	// Kept for backward compatibility
	app.use("/node", apiProxy());
};