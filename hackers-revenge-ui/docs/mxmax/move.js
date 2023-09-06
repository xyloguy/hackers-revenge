'use strict';

const P1_COLOR = "#007ee4";
const P2_COLOR = "#b70101";
const NO_COLOR = "#202020";
const WR_COLOR = "#008800";

const SQUARE_SIZE = (window.innerWidth * 0.5)/16;
const FIRE_IMG = new Image();
FIRE_IMG.src = 'data:image/png;;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDcuMS1jMDAwIDc5LmRhYmFjYmIsIDIwMjEvMDQvMTQtMDA6Mzk6NDQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NDZjMTJjYTktNzhkNy00NDQwLTk5MTktMTVmMzY0Y2ZhNDEwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjgyQzZGMzg0MUE1RDExRUNCNDA4RUY2OUM4NjhBQkVEIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjgyQzZGMzgzMUE1RDExRUNCNDA4RUY2OUM4NjhBQkVEIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi41IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDgwMzBkZWUtYzY0ZC00YTZiLWI2ODMtMTUyNGMzMTQzMjFkIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjA4MDMwZGVlLWM2NGQtNGE2Yi1iNjgzLTE1MjRjMzE0MzIxZCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtNamJ4AAAMiSURBVHja1JpJaBRBFIZ7YlyyTBKDUQcFF1ySeNCgiAbRg8cgDoZcgkFQERFPgnryICquoOAKokH04kHE5eIEUYmawxhvgocojhnRiEJwI1Em7V+kGpqmu+u9rplO94OPDD31qt9fy6tlkjBN04izlRkxtzAEtIK2UlWeCGkIZcFtcCauQ+ghOA0OxFXAoPx7ErTHUUCl7fNVkIqbgBW2z9PB8ThN4ikgDxpszwqgEQzEoQd2O4IXNkk+j3wPLAavQbXLd5/A3Cj3gGj1Bx7BC5sDmqMqYAl4AZYqym2MooA06JPDR2UroySgDlwDd0E90WdZVCZxBzgPZjH9foHkRAqYDa6AzRp1JKWQ0IfQJvBGM3grG4U+Bw6B+4yx7mczdJzLA/icAAeLOPlrwuyBHQGCfx8VASLlXWCUHwNd8q+f1Ycl4CKYxii/E/SARaWcA1QBIuNsYNR7CXSDCkLZZo9eSZDeJNYBAo9NuuVApfSrBmOK8sOgwvG+cnCEEhsl+IUmz7oc/lmCz1mHTwoUQLoYAvYygs/L1rP77yP6doMWsAo8l8/egTJdAXcYAk65+NeBb2Zwa/OLjzKJGxmTN+PybBgc00g07bqbuVF5MKduC757ZLtnYF0AAW9Bk44A6nZ1RJE258nzMXfh+gOqwjjQjCq+z4FOwsrsdykWSMAQ8UW1hPoegcNMASO6AnKMl80nlDkKnjLq/KwroI/xshbGJo96CsvqCsgwBFCvSfKM1JrRTaOTwUd5/lXZF3nbViCUrZK3c7U+ZX4b4zfZP3V64J88uLvZV9DrOOSniS0rgrupKHPOL3jObrQGDHnsJGeCXtuzV6r9i420zxZiECRVdVDPxD/AfnDDJXWKhWa9pFUuZg3E9DvgM9E7la3P6AGLWy4ttYZZh50mj9bfTq2DuxLvkpe2xbqgTbm0/B5wvVS3EmK4iN98X1J3iwpb7di1bgGXWTUE7Pqp8gBi2dqA9fRL/ydgQZA6DI3xa2URkS16Avh2gA9gK0gEjaEYt9Mi62wD/apl31o8jfHfDpaDe+BvFK7XJ8xi/98q/wUYAJX7fvkP/XOvAAAAAElFTkSuQmCC';


var x = 0;
var useTextMode = false;

const moveButtonsHTML = `<div onclick="moveUp(this)" class="move-btn">▲</div><div onclick="moveDown(this)" class="move-btn">▼</div>`;
const removeActionButtonHTML = `<input class="btn btn-danger float-end" type="button" value="X" onclick="removeAction(this)" />`;
const programControlsHTML = `<div class="program-controls">${moveButtonsHTML}${removeActionButtonHTML}</div>`
const hamburgerGrabIcon = `<div class="grab-icon"><img src="grab.svg"></div>`

function addAction(object) {

	const div = document.createElement('div');
	if (typeof object === 'object') {
		const action = object.parentElement.childNodes[0].nodeValue;
		const action_number = object.parentElement.childNodes[1].value
		if(action_number == "") {
			var message = "You must pass in an argument on this action!";
			alertFunction(message);
			return
		}

		object.parentElement.childNodes[1].value= "";
		div.className = 'row';

		div.innerHTML = `
    <li class="list-group-item action">` + hamburgerGrabIcon + action + " " + action_number + programControlsHTML + `</li>`;
	}
	else {

		div.className = 'row';

		div.innerHTML = `
  <li class="list-group-item action">` + hamburgerGrabIcon + object + " " + programControlsHTML + `</li>`;
	}
	document.getElementById('content').appendChild(div);
	closeProgramList();
}

function removeAction(input) {
	const obj = input.parentElement.parentElement;
	obj.parentElement.removeChild(obj);
}

function moveUp(input) {
	const obj = input.parentElement.parentElement;
	$(obj.parentElement).insertBefore($(obj.parentElement).prev());
}

function moveDown(input) {
	const obj = input.parentElement.parentElement;
	$(obj.parentElement).insertAfter($(obj.parentElement).next());
}

function maxLengthCheck(my_object) {
	if (my_object.value[0] == "-") {
		const num_length = my_object.maxLength + 1
		my_object.value = my_object.value.slice(0, num_length)
	}
	if (my_object.value[0] != "-" && my_object.value.length > my_object.maxLength)
	{
		my_object.value = my_object.value.slice(0, my_object.maxLength)
	}
}

function getMoves() {
	const move_items = document.getElementsByClassName("action")
	const move_object = []
	for (let i = 0; i < move_items.length; i++) {
		if (move_items[i].childNodes[1].nodeValue.match(/\d+/g)) {
			let item = move_items[i].childNodes[1].nodeValue.split(" ");
			let action = {"opcode": item[0].trim(), "arg": item[2]};
			move_object.push(action);
		}
		else {
			let action = {"opcode": move_items[i].childNodes[1].nodeValue.trim(), "arg": null};
			move_object.push(action);
		}
	}

	return move_object;
}

function submitActions(object) {
	var move_object = getMoves();

	if (useTextMode) {
		move_object = assemble();
		if (move_object == null) {
			return;
		}
	}

	if (move_object.length > 24) {
		alertFunction("No more than 24 instructions are allowed.");
		return
	}
	
	const token = document.getElementById("token").value;
	
	if (token == "") {
		var message = "Please input your token!"
		alertFunction(message);
		return
	}
	
	if (move_object.length == 0) {
		var message = "Please add some instructions before submitting!"
		alertFunction(message);
		return
	}

	const my_object = {
		token: token,
		code: move_object
	}

	const stringify_object = JSON.stringify(my_object)

	$.ajax({
		type: "POST",
		url: "/api/mxmax/program",
		data: stringify_object,
		dataType: "json",
		contentType: 'application/json',
		processData: false,
		success: function (data) { successFunction(data); },
		error: function (data) { errorFunction(data); }
	});
}

function openProgramList() {
	$("#add-instruction-list").addClass("mobile-show");
}

function closeProgramList() {
	$("#add-instruction-list").removeClass("mobile-show");
}


function toggleTextMode() {

	if (useTextMode) {
		$("#program-list").show();
		$("#text_mode_entry").hide();
		$("#content").show();
		$("#text_mode_btn").html("Use Text Mode");
		useTextMode = false;
	}
	else {
		$("#program-list").hide();
		$("#text_mode_entry").show();
		$("#content").hide();
		$("#text_mode_btn").html("Use List Mode");
		useTextMode = true;
	}
}

function waitThenRemove(seconds,element) {
	setTimeout(() => {
		element.remove();
	}, seconds * 1000);
}

function errorFunction(data) {
	var alertPlaceholder = document.getElementById('alert-container')
	var wrapper = document.createElement('div')
	var message = "Your submission failed!";


	if (data !== undefined && data.responseJSON !== undefined && "error" in data.responseJSON) {
    	message = "Your submission failed: " + data.responseJSON.error;
	}
	
	wrapper.innerHTML = '<div class="alert alert-danger alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
	alertPlaceholder.append(wrapper)
	waitThenRemove(4,wrapper);
};

function successFunction(data) {
	var alertPlaceholder = document.getElementById('alert-container')
	var wrapper = document.createElement('div')
	var message = "Your submission succeeded!"

	if (data !== undefined && data.programs_remaining !== undefined) {
		message = message + ' You have ' + data.programs_remaining + " submissions remaining";
	}

	if (data !== undefined && data.player_name !== undefined) {
		message = "Your program name is '" + data.player_name + "'. " + message;
	}
	
	wrapper.innerHTML = '<div class="alert alert-success alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
	alertPlaceholder.append(wrapper)
	waitThenRemove(10,wrapper);
};

function alertFunction(message) {
	var alertPlaceholder = document.getElementById('alert-container')
	var wrapper = document.createElement('div')
	wrapper.innerHTML = '<div class="alert alert-danger alert-dismissible" role="alert">' + message + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>'
	alertPlaceholder.append(wrapper)
	waitThenRemove(4,wrapper);
};


function submitTest(opponent) {
	var move_object = getMoves();

	if (useTextMode) {
		move_object = assemble();
		if (move_object == null) {
			return;
		}
	}

	if (move_object.length < 1) {
		alertFunction("Program has no instructions.");
		return
	}

	if (move_object.length > 24) {
		alertFunction("No more than 24 instructions are allowed.");
		return
	}

	var test_program = {};

	switch (opponent) {
	case 'last':
		const token = document.getElementById("token").value;
		if (token == "") {
			var message = "Please input your token!"
			alertFunction(message);
			return
		}
		test_program.player_token = token;
		break;
	case 'g3':
		test_program.player_name = 'MX Sc4nn3r';
		break;
	case 'g2':
		test_program.player_name = "MX Sl0w F1r3";
		break;
	default:
		test_program.player_name = 'MX Sc4r3dy C4t';
	}
	
	const test_object = {
		program1: {
			"player_name" : "test program",
			"code" : move_object,
		},
		program2: test_program,
	};

	const stringify_object = JSON.stringify(test_object)

	$.ajax({
		type: "POST",
		url: "/api/mxmax/test_round",
		data: stringify_object,
		dataType: "json",
		contentType: 'application/json',
		processData: false,
		success: function (data) {
			showTestResults(data);
		},
		error: function (data) { errorFunction(data); },
	});
}

function showTestResults(data) {
	const header = $( "<h4> PROGRAM // TRACE </h4>" );

	var result_string = "tied";
	if (data.winner == 1) {
		result_string = "won";
	}
	else if (data.winner == 2) {
		result_string = "lost";
	}


	const summary = $( "<div id='test-summary'>Your program <b>" + result_string + "</b> against the opponent after <b>" + data.journal.length + " cycle(s)</b>. Your program was inserted at memory address " + data.program1.start_ip + " and the opponent was inserted at " + data.program2.start_ip + "</div>" );

	const table = $('<div>').addClass('test-results');
	const mem = [];

	for (var i = 0; i < 256; i++) {
		mem[i] = { contents: null,
				   updated: false,
				   owner: 0 };
	}

	for (var i = 0 ; i < data.program1.code.length ; i++) {
		mem[data.program1.code[i].addr] = {
			contents: 'code',
			owner: 1,
		};
	}

	for (var i = 0 ; i < data.program2.code.length ; i++) {
		mem[data.program2.code[i].addr] = {
			contents: 'code',
			owner: 2,
		};
	}

	for (var i = 0 ; i < data.journal.length ; i++ ) {
		var je = data.journal[i];

		// update mem
		if ("writes" in je) {
			for (var wi = 0 ; wi < je.writes.length; wi++) {
				var w = je.writes[wi]
				
				mem[w.addr].owner = je.program;
				mem[w.addr].updated = true;
				// handle writing an instruction, a replace for our
				// purposes just changes the ownership of a cell
				if ("opcode" in w) {
					if (w.opcode != null) {
						if (w.opcode == 'HCF') {
							mem[w.addr].contents = "hcf";
						}
						else  {
							mem[w.addr].contents = "code";
						}
					}
					else {
						mem[w.addr].contents = null;
					}
				}
			}
		}

		// display program entries for program1
		if (je.program == 1) {
			if (je.opcode == null) {
				je.opcode = "NULL";
			}
			var journal_entry_string = '<div class="journal_entry"><div class="journal_entry_code">PC:' + je.old_ip + ' ' + je.opcode;

			if (je.arg != null) {
				journal_entry_string += ' ' + je.arg;
			}


			journal_entry_string += '</div><div class="journal_entry_stack"> stack: ' + je.new_stack + '</div>';

			// SCAN
			if (je.read_addr_first != null && je.read_addr_last != null && !("writes" in je)) {
				journal_entry_string += '<div class="journal_entry_extra">Scanned memory from ' + je.read_addr_first + ' to ' + je.read_addr_last + "</div>";
			}

			if ("writes" in je && je.read_addr_first != null) {
				for (var wi = 0 ; wi < je.writes.length; wi++) {
					var w = je.writes[wi]
					journal_entry_string += '<div class="journal_entry_extra">Copied memory from ' + je.read_addr_first + ' to ' + w.addr + "</div>";
				}
			}
			else if ("writes" in je) {
				for (var wi = 0 ; wi < je.writes.length; wi++) {
					var w = je.writes[wi]
				
					if ("opcode" in w) {
						journal_entry_string += '<div class="journal_entry_extra">Wrote to memory at ' + w.addr + "</div>";
					}
					else {
						journal_entry_string += '<div class="journal_entry_extra">Replaced argument of instruction at ' + w.addr + "</div>";
					}
				}
			}


			if (je.status != 0) {
				var status_label = "";
				switch (je.status) {
				case 0:
					status_label = "running";
					break;
				case 1:
					status_label = "died by running nil";
					break;
				case 2:
					status_label = "died by executing enemy HALT/CATCH-FIRE";
					break;
				case 3:
					status_label = "died by executing own HALT/CATCH-FIRE";
					break;
				case 4:
					status_label = "died from stack overflow";
					break;
				case 5:
					status_label = "died from stack underflow";
					break;
				case 6:
					status_label = "died from arg overflow";
					break;
				case 7:
					status_label = "died by executing invalid opcode";
					break;
				case 8:
					status_label = "died by executing JUMP 0";
					break;
				default:
					status_label = "???";
				}

				journal_entry_string += '<div class="journal_entry_died">' + status_label + '</div>';
			}

			journal_entry_string += '</div>'

			table.append($(journal_entry_string));
		}
	}

	var haveCanvas = true;
	// draw the results
	const canvas = document.createElement("canvas");
	const canvas_container = $('			<ul id="legend">				<li><div class="blue-square"></div>your program</li>				<li><div class="red-square"></div>opponent</li>				<li><div class="green-square"></div>memory cells altered</li>			</ul>');
	canvas_container.append(canvas);

	try {
		canvas.width = canvas.height = SQUARE_SIZE * 16;
		const ctx = canvas.getContext("2d");
		let idx = 0;
		for (var y = 0 ; y < 16 ; y++) {
			for (var x = 0; x < 16; x++) {
				var m = mem[idx++];
				var sx = x * (SQUARE_SIZE) + 1;
				var sy = y * (SQUARE_SIZE) + 1;
				var sz = (SQUARE_SIZE) * .9;

				if (m.owner == 0) {
					ctx.fillStyle = NO_COLOR;
					ctx.fillRect(sx, sy, sz, sz);
				}
				else {
					var col = P1_COLOR;
					if (m.owner == 2) {
						col = P2_COLOR;
					}

					if (m.updated) {
						col = WR_COLOR;
					}
					ctx.fillStyle = col;
					ctx.fillRect(sx, sy, sz, sz);

					if (m.contents == 'hcf') {
						ctx.drawImage(FIRE_IMG, sx, sy, SQUARE_SIZE, SQUARE_SIZE);
					}
				}
			}
		}
	}
	catch (e) {
		haveCanvas = false;
	}

	$('#test_program_output').html("");
	$('#test_program_output').append(header);
	$('#test_program_output').append(summary);
	if (haveCanvas) {
		$('#test_program_output').append(canvas_container);
	}
	$('#test_program_output').append(table);

	$('html,body').animate({scrollTop: header.offset().top}, 'slow');

}


$("#content").sortable();
$("#content").disableSelection();


const INSTRUCTIONS = {
	NOOP: false,
	PUSH: true,
	DROP: false,
	DUPE: false,
	DUPE2: false,
	SWAP: false,
	INC: true,
	ADD: false,
	NEGATE: false,
	JUMP: true,
	JUMPZ: true,
	JUMPG: true,
	DECSKIP: true,
	HCF: false,
	SCAN: true,
	COPY: true,
	ICOPY: true,
	SETARG: true,
	PUSHARG: false,
	INCARG: true,
};

function assemble() {
	var text = document.getElementById("text_mode_box").value;
	var program = [];

	var lines = text.split("\n");

	for (var i = 0 ; i < lines.length ; i++) {
		var line = lines[i];

		var blank_match = line.match(/(^\s*$|^#)/);
		var code_arg_match = line.match(/(^\w+)\s+(-*[0-9]+)/);
		var code_match = line.match(/(^\w+)/);
		
		
		if (blank_match) {
			// do nothing			
		}
		else if (code_arg_match) {
			var opcode = code_arg_match[1].toUpperCase();
			var arg = code_arg_match[2];
			var n_arg = parseInt(arg);

			if (arg > 255 || arg < -255) {
				alertFunction("argument: " + opcode + " out of range at line " + (i+1));
				return null;
			}
			
			if (opcode in INSTRUCTIONS) {
				if (!INSTRUCTIONS[opcode]) {
					alertFunction("instruction: " + opcode + " does not take argument at line " + (i+1));
					return
				}

				program.push({"opcode": opcode, "arg" : arg });
			}
			else {
				alertFunction("Unknown instruction: " + opcode + " at line " + (i+1));
				return null;
			}
		}
		else if (code_match) {
			var opcode = code_match[0].toUpperCase();
			if (opcode in INSTRUCTIONS) {

				if (INSTRUCTIONS[opcode]) {
					alertFunction("instruction: " + opcode + "takes an argument at line " + (i+1));
					return
				}
				
				program.push({"opcode": opcode, "arg" : null });
			}
			else {
				alertFunction("Unknown instruction: " + opcode + " at line " + (i+1));
				return null;
			}
		}
		else {
			alertFunction("syntax error at line " + (i+1));
			return;
		}
	}

	return program;
}
