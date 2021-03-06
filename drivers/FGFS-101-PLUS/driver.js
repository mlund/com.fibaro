'use strict';

const path = require('path');
const ZwaveDriver = require('homey-zwavedriver');

// http://www.pepper1.net/zwavedb/device/745

module.exports = new ZwaveDriver(path.basename(__dirname), {
	capabilities: {
		alarm_water: [
			{
				command_class: 'COMMAND_CLASS_SENSOR_ALARM',
				command_get: 'SENSOR_ALARM_GET',
				command_get_parser: () => ({
					'Sensor Type': 'Water Leak Alarm',
				}),
				command_report: 'SENSOR_ALARM_REPORT',
				command_report_parser: report => {
					if (report['Sensor Type'] !== 'Water Leak Alarm') return null;

					return report['Sensor State'] === 'alarm';
				},
			},
			{
				command_class: 'COMMAND_CLASS_NOTIFICATION',
				command_report: 'NOTIFICATION_REPORT',
				command_report_parser: report => {
					if (report && report['Notification Type'] === 'Water') {
						if (report.hasOwnProperty('Event (Parsed')) {
							return report['Event (Parsed)'] !== 'Event inactive';
						}
						return report.Event > 0;

					}
					return null;
				},
			},
		],

		alarm_tamper: [
			{
				command_class: 'COMMAND_CLASS_SENSOR_ALARM',
				command_get: 'SENSOR_ALARM_GET',
				command_get_parser: () => ({
					'Sensor Type': 'General Purpose Alarm',
				}),
				command_report: 'SENSOR_ALARM_REPORT',
				command_report_parser: report => {
					if (report['Sensor Type'] !== 'General Purpose Alarm') return null;

					return report['Sensor State'] === 'alarm';
				},
			},
			{
				command_class: 'COMMAND_CLASS_NOTIFICATION',
				command_report: 'NOTIFICATION_REPORT',
				command_report_parser: report => {
					if (report && report['Notification Type'] === 'Home Security') {
						if (report.hasOwnProperty('Event (Parsed')) {
							return report['Event (Parsed)'] !== 'Event inactive';
						}
						return report.Event > 0;

					}
					return null;
				},
			},
		],

		measure_temperature: {
			getOnWakeUp: true,
			command_class: 'COMMAND_CLASS_SENSOR_MULTILEVEL',
			command_get: 'SENSOR_MULTILEVEL_GET',
			command_get_parser: () => ({
				'Sensor Type': 'Temperature (version 1)',
				Properties1: {
					Scale: 0,
				},
			}),
			command_report: 'SENSOR_MULTILEVEL_REPORT',
			command_report_parser: report => {
				if (report['Sensor Type'] !== 'Temperature (version 1)') return null;

				return report['Sensor Value (Parsed)'];
			},
		},

		measure_battery: {
			getOnWakeUp: true,
			command_class: 'COMMAND_CLASS_BATTERY',
			command_get: 'BATTERY_GET',
			command_report: 'BATTERY_REPORT',
			command_report_parser: report => {
				if (report['Battery Level'] === 'battery low warning') return 1;

				if (report.hasOwnProperty('Battery Level (Raw)')) { return report['Battery Level (Raw)'][0]; }

				return null;
			},
			optional: true,
		},
	},
	settings: {
		alarm_cancellation: {
			index: 1,
			size: 2,
		},
		flood_signal: {
			index: 2,
			size: 1,
		},
		alarm_cancel_status: {
			index: 9,
			size: 1,
		},
		temperature_measure_interval: {
			index: 10,
			size: 4,
		},
		temperature_measure_hysteresis: {
			index: 12,
			size: 2,
		},
		low_temperature_treshold: {
			index: 50,
			size: 2,
		},
		high_temperature_treshold: {
			index: 51,
			size: 2,
		},
		low_temperature_led: {
			index: 61,
			size: 4,
		},
		high_temperature_led: {
			index: 62,
			size: 4,
		},
		led_indication: {
			index: 63,
			size: 1,
		},
		temperature_offset: {
			index: 73,
			size: 2,
		},
		tamper_alarm: {
			index: 74,
			size: 1,
		},
		alarm_duration: {
			index: 75,
			size: 4,
		},
		flood_sensor: {
			index: 77,
			size: 1,
			parser: value => new Buffer([(value === true) ? 0 : 1]),
		},
	},
});
