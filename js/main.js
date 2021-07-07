$hour = document.getElementById("hour");
$minute = document.getElementById("minute");
$second = document.getElementById("second");
$hourInput = document.getElementById("hourInput");
$minuteInput = document.getElementById("minuteInput");
$message = document.getElementById("message");
$setAlarms = document.getElementById("setAlarms");

alarmSound = new Audio("./alarm.mp3");
alarms = []; // Alarms {hour, minute}

/** Add hour and minute ranges in set alarm form */
function populate_form_options() {
	// Hours
	for (let i = 0; i < 24; i++) {
		const option = document.createElement("OPTION");
		option.text = i;
		option.value = i;
		$hourInput.options.add(option);
	}

	// Minutes
	for (let i = 0; i < 60; i++) {
		const option = document.createElement("OPTION");
		option.text = i;
		option.value = i;
		$minuteInput.options.add(option);
	}

	return;
}

/** Get current hours, minutes, seconds */
function get_current_time() {
	const d = new Date();

	let time = {
		hour: d.getHours(),
		minute: d.getMinutes(),
		second: d.getSeconds(),
	};
	return time;
}

/** Set current time on clock */
function set_current_time(time) {
	$hour.innerHTML = time.hour < 10 ? "0" + time.hour : time.hour;
	$minute.innerHTML = time.minute < 10 ? "0" + time.minute : time.minute;
	$second.innerHTML = time.second < 10 ? "0" + time.second : time.second;
	return;
}

/** Update clock every second */
function update_clock() {
	window.setInterval(function () {
		const time = get_current_time();
		set_current_time(time);
	}, 1000);
}

/** Set new alarm (form action) */
function set_alarm(e) {
	e.preventDefault();
	clear_message();

	const d = new Date();

	// Validate alarm numbers
	if (!$hourInput.value || !$minuteInput.value) {
		// Both fields filled
		set_message("Please fill out both hour and minute values!");
		clear_form();
		return;
	} else if ($hourInput.value < 0 || $hourInput.value > 23) {
		// Valid hours
		set_message("Invalid hour! (pick between 0 and 23)");
		clear_form();
		return;
	} else if ($minuteInput.value < 0 || $minuteInput.value > 59) {
		// Valid minutes
		set_message("Invalid minute! (pick between 0 and 59)");
		clear_form();
		return;
	} else {
		// Ensure alarm is unique
		if (alarms.length) {
			for (let i = 0; i < alarms.length; i++) {
				if (alarms[i].hour === $hourInput.value && alarms[i].minute === $minuteInput.value) {
					set_message("That alarm is already set!");
					clear_form();
					return;
				}
			}
		}
	}

	alarms.push({ hour: parseInt($hourInput.value), minute: parseInt($minuteInput.value) });
	set_message("Alarm set!");
	clear_form();
	return false;
}

/** Check to see if any alarm is ready, execute and pop if true */
function check_alarms() {
	window.setInterval(function () {
		if (alarms.length) {
			const d = new Date();

			const currentTime = { hour: d.getHours(), minute: d.getMinutes() };
			// Check for alarm to go off
			for (let i = 0; i < alarms.length; i++) {
				if (alarms[i].hour === currentTime.hour && alarms[i].minute === currentTime.minute) {
					alarms.splice(i, 1);
					alarmSound.play();
					alert("Brrrrrrrring brrrrrring!");
					break;
				}
			}
		}
	}, 1000);
}

/** Update alarm list */
function update_alarms() {
	window.setInterval(function () {
		$setAlarms.innerHTML = "";
		if (!alarms) return;

		// Populate alarm list
		for (let i = 0; i < alarms.length; i++) {
			// Create hour and minute strings
			const hour = alarms[i].hour < 10 ? "0" + alarms[i].hour : alarms[i].hour;
			const minute = alarms[i].minute < 10 ? "0" + alarms[i].minute : alarms[i].minute;
			const setAlarm = document.createElement("P");
			setAlarm.innerHTML = hour + " : " + minute;
			$setAlarms.appendChild(setAlarm);
		}
	}, 100);
}

/** Set message (form errors/success) */
function set_message(message) {
	$message.innerHTML = message;
	setTimeout(function () {
		clear_message();
	}, 2000);
	return;
}

/** Clear message */
function clear_message() {
	$message.innerHTML = "";
	return;
}

/** Clear form */
function clear_form() {
	$minuteInput.value = null;
	$hourInput.value = null;
	return;
}

/** Alarm clock controller */
function main() {
	update_clock();
	update_alarms();
	check_alarms();
	return;
}

main();
