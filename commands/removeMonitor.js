const { CommandType } = require("wokcommands");
const fs = require("fs");

const data = require("./../config.json");
const { PermissionFlagsBits } = require("discord.js");
const { findMonitor } = require("../utils/config");

module.exports = {
	// Required for slash commands
	description: "remove a monitor",

	guildOnly: true,
	// permissions: [PermissionFlagsBits.Administrator],
	// Create a legacy and slash command
	type: CommandType.SLASH,
	options: [
		{
			name: "monitor_name",
			description: "name of monitor",
			type: 3,
			required: true,
			autocomplete: true,
		},
	],
	autocomplete: (command, argument, interaction) => {
		return data.map(({ monitorName }) => ({
			name: monitorName,
			value: monitorName,
		}));
	},
	callback: async ({ interaction }) => {
		try {
			await interaction.deferReply({ ephemeral: true });
			const { options } = interaction;

			const monitorName = options.getString("monitor_name");

			const isMonitorExist = findMonitor(monitorName);

			if (isMonitorExist === -1)
				throw new Error("A monitor with that name does not exist");

			data.splice(isMonitorExist, 1);

			fs.writeFileSync("./config.json", JSON.stringify(data));

			await interaction.editReply("removed the monitor");
		} catch (error) {
			console.log(error);
			if (interaction.deferred || interaction.replied)
				return await interaction.editReply(error.message);
			await interaction.reply(error.message);
		}
	},
};
