const data = require("./../config.json");

const findMonitor = (targetName) =>
	data.findIndex((monitor) => monitor.monitorName === targetName);

module.exports = { findMonitor };
