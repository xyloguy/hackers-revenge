const P1_COLOR = "#007ee4";
const P2_COLOR = "#b70101";
const P1_HILIGHT_COLOR = "#0000ff";
const P2_HILIGHT_COLOR = "#ff0000";
const READ_COLOR = "#00ff00";
const WRITE_COLOR = "#ffff00";
const REPLACE_COLOR = "#11cc11";
const JUMP_COLOR = "#aaaaff";
const DASH_STYLE = [4,4];

// defaults but will be scaled to fit.
const CANVAS_SIZE = 900;
const SQUARE_SIZE = CANVAS_SIZE/16;
const CELL_BUFFER = CANVAS_SIZE/128;

const BOMB_CHAR = "\uD83D\uDD25";

// number of seconds it should take to display a program
const ANIMATION_SPEED = 60;
// length of animation frame in milliseconds
const ANIMATION_FRAME_TIME = 10;

// maximum number of frames per cycle
const MAX_CYCLES = 10;

// amount of time to wait before proceeding;
const END_WAIT_TIME = 5;

const FIRE_IMG = new Image();
FIRE_IMG.src = 'data:image/png;;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3ZpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDcuMS1jMDAwIDc5LmRhYmFjYmIsIDIwMjEvMDQvMTQtMDA6Mzk6NDQgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NDZjMTJjYTktNzhkNy00NDQwLTk5MTktMTVmMzY0Y2ZhNDEwIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjgyQzZGMzg0MUE1RDExRUNCNDA4RUY2OUM4NjhBQkVEIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjgyQzZGMzgzMUE1RDExRUNCNDA4RUY2OUM4NjhBQkVEIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCAyMi41IChNYWNpbnRvc2gpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6MDgwMzBkZWUtYzY0ZC00YTZiLWI2ODMtMTUyNGMzMTQzMjFkIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjA4MDMwZGVlLWM2NGQtNGE2Yi1iNjgzLTE1MjRjMzE0MzIxZCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtNamJ4AAAMiSURBVHja1JpJaBRBFIZ7YlyyTBKDUQcFF1ySeNCgiAbRg8cgDoZcgkFQERFPgnryICquoOAKokH04kHE5eIEUYmawxhvgocojhnRiEJwI1Em7V+kGpqmu+u9rplO94OPDD31qt9fy6tlkjBN04izlRkxtzAEtIK2UlWeCGkIZcFtcCauQ+ghOA0OxFXAoPx7ErTHUUCl7fNVkIqbgBW2z9PB8ThN4ikgDxpszwqgEQzEoQd2O4IXNkk+j3wPLAavQbXLd5/A3Cj3gGj1Bx7BC5sDmqMqYAl4AZYqym2MooA06JPDR2UroySgDlwDd0E90WdZVCZxBzgPZjH9foHkRAqYDa6AzRp1JKWQ0IfQJvBGM3grG4U+Bw6B+4yx7mczdJzLA/icAAeLOPlrwuyBHQGCfx8VASLlXWCUHwNd8q+f1Ycl4CKYxii/E/SARaWcA1QBIuNsYNR7CXSDCkLZZo9eSZDeJNYBAo9NuuVApfSrBmOK8sOgwvG+cnCEEhsl+IUmz7oc/lmCz1mHTwoUQLoYAvYygs/L1rP77yP6doMWsAo8l8/egTJdAXcYAk65+NeBb2Zwa/OLjzKJGxmTN+PybBgc00g07bqbuVF5MKduC757ZLtnYF0AAW9Bk44A6nZ1RJE258nzMXfh+gOqwjjQjCq+z4FOwsrsdykWSMAQ8UW1hPoegcNMASO6AnKMl80nlDkKnjLq/KwroI/xshbGJo96CsvqCsgwBFCvSfKM1JrRTaOTwUd5/lXZF3nbViCUrZK3c7U+ZX4b4zfZP3V64J88uLvZV9DrOOSniS0rgrupKHPOL3jObrQGDHnsJGeCXtuzV6r9i420zxZiECRVdVDPxD/AfnDDJXWKhWa9pFUuZg3E9DvgM9E7la3P6AGLWy4ttYZZh50mj9bfTq2DuxLvkpe2xbqgTbm0/B5wvVS3EmK4iN98X1J3iwpb7di1bgGXWTUE7Pqp8gBi2dqA9fRL/ydgQZA6DI3xa2URkS16Avh2gA9gK0gEjaEYt9Mi62wD/apl31o8jfHfDpaDe+BvFK7XJ8xi/98q/wUYAJX7fvkP/XOvAAAAAElFTkSuQmCC';


// iterator
function Replayer(replay, next) {
	var canvas_fg = document.getElementById("replay_canvas_action");
	var cycle_e = document.getElementById("cycle");
	var p1_name_e = document.getElementById("p1_name");
	var p2_name_e = document.getElementById("p2_name");
	var result_e = document.getElementById("result");

	var replayer = {
		_replay:           replay,
		_len:              replay.journal.length,
		_idx:              0,
		_mem:              new Array(256),
		_pcs:              [0, 0],
		_current_journal:  null,
		_animate_cycle:    0,
		_canvas_fg:        canvas_fg,
		_interval:         null,
	};

	replayer.run = function() {
		var per_cycle = (ANIMATION_SPEED / replayer._len) * (1000 / ANIMATION_FRAME_TIME) ;

		// dont let a short program take "too long"
		if (per_cycle > MAX_CYCLES) {
			per_cycle = MAX_CYCLES;
		}

		var interval_id = null;
		var cycle_count = 0;
		interval_id = setInterval(
			function() {
				try {
					replayer.animate_current_cycle(per_cycle);
					replayer.draw_code();
					cycle_count++;
					if (cycle_count > per_cycle) {
						if (replayer.next() == null) {
							// stop the train
							clearInterval(interval_id);

							
							if (next != null) {
								// keep the last frame displaying for some
								// time before moving forward.
								setTimeout(
									function() {
										replayer.reset();
										next();
									},
									END_WAIT_TIME * 1000);
							}
							return;
						}
						cycle_count = 0;
					}
				} catch (e) {
					clearInterval(interval_id);
					if (next != null) {
						next();
					}
				}
			},
			ANIMATION_FRAME_TIME);
	}

	replayer.next = function() {
		if (replayer._idx < (replayer._len-1)) {
			replayer._idx++;
			replayer.apply_current_journal();
			var c = replayer._replay.journal[replayer._idx];
			replayer._current_journal = c;
			replayer._pcs[c.program-1] = c.old_ip;
			return c;
		}
		else {
			return null;
		}
	};

	replayer.update_code_display = function() {
		var display_containers = [
			document.getElementById("p1_code_display"),
			document.getElementById("p2_code_display"),
		];

		function norm_pc (pc) {
			if (pc < 0) {
				return 256 - pc;
			}
			else if (pc > 255) {
				return (pc - 255);
			}
			else {
				return pc;
			}
		}

		for (var p = 0 ; p < 2 ; p++) {
			var cont = display_containers[p];
			var ppc = replayer._pcs[p];

			for (var i = ppc-4; i < ppc+4; p++) {
				var addr = norm_pc(i);
			}
		}
	};

	replayer.reset = function() {
		replayer.init_mem();
		replayer._idx = 0;
		replayer._current_journal = replayer._replay.journal[0];
		replayer.draw_mem();
		replayer.draw_code(false);
	};

	replayer.init_mem = function() {
		// fill with nil
		for (var i = 0 ; i < replayer._mem.length ; i++) {
			replayer._mem[i] = {type: 0};
		}

		// add player programs
		for (var p = 0 ; p < 2 ; p++) {
			var program = replayer._replay.program1;
			if (p > 0) {
				program = replayer._replay.program2;
			}
			replayer._pcs[p] = program.start_ip;
			for (var i = 0 ; i < program.code.length; i++) {
				var l = program.code[i];
				replayer._mem[l.addr] = {type: 1,
										 opcode: l.opcode,
										 arg: l.arg,
										 program: p,
										}
			}
		}
	};

	replayer.apply_current_journal = function() {
		if (replayer._current_journal == null) {
			return;
		}

		var cj = replayer._current_journal;

		if ("writes" in cj) {
			var cluster = (cj.writes.length > 1);
			for (var wi = 0 ; wi < cj.writes.length; wi++) {
				var w = cj.writes[wi]
				
				if (w.opcode) {
					replayer._mem[w.addr] = {
						type: 1,
						opcode: w.opcode,
						arg: w.arg,
						cluster: (w.opcode == "HCF") && cluster,
					}
				}
				else if (w.arg) {
					replayer._mem[w.addr].arg = w.arg;
				}
				else {
					replayer._mem[w.addr] = {
						type: 0,
						cluster: false,
					}
				}
				
				replayer._mem[w.addr].program = cj.program-1;
			}
		}
	};

	replayer.addr_to_cell_location = function(addr) {
		return {
			y:  Math.floor(addr / 16) * (SQUARE_SIZE),
		    x:  Math.floor(addr % 16) * (SQUARE_SIZE),
		}
	};

	replayer.move_on_path = function (src_x, src_y, dst_x, dst_y, pos) {
		var dx = dst_x - src_x
		var dy = dst_y - src_y

		var new_x = src_x + dx * pos;
		var new_y = src_y + dy * pos;

		return {
			x: new_x,
			y: new_y
		};
	};

	var frame = 0;

	replayer.animate_current_cycle = function(cycle_length) {
		frame++;
		var ctx = canvas_fg.getContext("2d");
		ctx.clearRect(0, 0, CANVAS_SIZE+SQUARE_SIZE, CANVAS_SIZE+(SQUARE_SIZE/2));
		replayer.draw_mem();
		var cl = cycle_length;

		var cj = replayer._current_journal;
		// percentage used in animation
		var ap =  (replayer._animate_cycle % cl) / cl;


		// animate cell with current PC and any cells being written or
		// read with player's hilight colour
		//var alpha = .8 + (ap * .2);
		var alpha = ((frame % 2) == 0) ? 1 : 0;
		ctx.globalAlpha = alpha;


		var p1_cl = replayer.addr_to_cell_location(replayer._pcs[0]);
		var p2_cl = replayer.addr_to_cell_location(replayer._pcs[1]);

		ctx.fillStyle = P1_HILIGHT_COLOR;
		ctx.fillRect(p1_cl.x, p1_cl.y, SQUARE_SIZE-CELL_BUFFER, SQUARE_SIZE-CELL_BUFFER);
		ctx.globalAlpha = 1-alpha;

		ctx.fillStyle = P2_HILIGHT_COLOR;
		ctx.fillRect(p2_cl.x, p2_cl.y, SQUARE_SIZE-CELL_BUFFER, SQUARE_SIZE-CELL_BUFFER);
		ctx.globalAlpha = alpha;

		if (cj.program == 1) {
			ctx.fillStyle = P1_HILIGHT_COLOR;
		}
		else {
			ctx.fillStyle = P2_HILIGHT_COLOR;
		}

		var current_src = cj.old_ip;

		// draw JUMP

		if (Math.abs(cj.old_ip - cj.new_ip) > 2) {
			ctx.save();
		 	var dst = replayer.addr_to_cell_location(cj.new_ip);
		 	var src = replayer.addr_to_cell_location(current_src);
			ctx.setLineDash(DASH_STYLE);
			ctx.lineDashOffset = ap * 16;
		 	ctx.globalAlpha = .8;
		 	ctx.strokeStyle = JUMP_COLOR;
		 	ctx.lineWidth=5;
		 	ctx.beginPath();
		 	ctx.moveTo(src.x + SQUARE_SIZE*0.5, src.y + SQUARE_SIZE*0.5);
		 	ctx.lineTo(dst.x + SQUARE_SIZE*0.5, dst.y + SQUARE_SIZE*0.5);
		 	ctx.stroke();
			ctx.restore();
		}


		// SCAN animation
		if ("read_addr_last" in cj && cj.read_addr_last != null) {
			var start = cj.read_addr_first;
			var end   = cj.read_addr_last;
			var len   = end-start;

			if (end < start) {
				var new_end = (255 + end);
				len = new_end - start;
			}

			ctx.globalAlpha = .25;
			for (var a = 0 ; a < len ; a++) {
				var na = replayer.normalize_addr(start + a);
				var l = replayer.addr_to_cell_location(na);
				ctx.fillRect(l.x, l.y, SQUARE_SIZE-CELL_BUFFER, SQUARE_SIZE-CELL_BUFFER);
			}

			ctx.globalAlpha = 1.0;

			var pos = Math.floor(start + (len * ap));
			var na = replayer.normalize_addr(pos);
			var l = replayer.addr_to_cell_location(na);
			ctx.fillRect(l.x, l.y, SQUARE_SIZE-CELL_BUFFER, SQUARE_SIZE-CELL_BUFFER);


			// draw a laser for the read
			var src = replayer.addr_to_cell_location(current_src);
			ctx.save();
			ctx.globalAlpha = .8;
			ctx.setLineDash(DASH_STYLE);
			ctx.lineDashOffset = ap * 16;
			ctx.strokeStyle = READ_COLOR;
			ctx.lineWidth=5;
			ctx.beginPath();
			ctx.moveTo(src.x + SQUARE_SIZE*0.5, src.y + SQUARE_SIZE*0.5);
			ctx.lineTo(l.x + SQUARE_SIZE*0.5, l.y + SQUARE_SIZE*0.5);
			ctx.stroke();
			ctx.restore();
			ctx.globalAlpha = alpha;
		} else if ("read_addr_first" in cj && cj.read_addr_first != null) {
			var a = cj.read_addr_first;
			var l = replayer.addr_to_cell_location(a);
			ctx.fillRect(l.x, l.y, SQUARE_SIZE-CELL_BUFFER, SQUARE_SIZE-CELL_BUFFER);
		}


		if ("writes" in cj) {
			for (var wi = 0 ; wi < cj.writes.length; wi++) {
				var w = cj.writes[wi];
				var a = w.addr;
				var l = replayer.addr_to_cell_location(a);
				ctx.fillRect(l.x, l.y, SQUARE_SIZE-CELL_BUFFER, SQUARE_SIZE-CELL_BUFFER);
			}
		}

		ctx.globalAlpha = 1.0;

		// animate writes
		if ("writes" in cj) {
			var cluster = (cj.writes.length > 1);
			for (var wi = 0 ; wi < cj.writes.length; wi++) {
				var write = cj.writes[wi]
				
				var src = replayer.addr_to_cell_location(current_src);
				
				if ("read_addr_first" in cj && cj.read_addr_first != null) {
					src = replayer.addr_to_cell_location(cj.read_addr_first)
				}
				
				var dst = replayer.addr_to_cell_location(write.addr);
				var pos = replayer.move_on_path(src.x, src.y, dst.x, dst.y, ap);
				
				// move pos to center
				pos.x += SQUARE_SIZE*0.5;
				pos.y += SQUARE_SIZE*0.5;
				
				ctx.globalAlpha = .5
				if (cj.program == 1) {
					ctx.strokeStyle = P1_HILIGHT_COLOR;
				}
				else {
					ctx.strokeStyle = P2_HILIGHT_COLOR;
				}
				
				ctx.save();
				if (cj.opcode == "REPLACE") {
					ctx.strokeStyle = REPLACE_COLOR;
				}
				else {
					ctx.strokeStyle = WRITE_COLOR;
					
				}
				
				ctx.lineDashOffset = ap * 16;
				ctx.setLineDash(DASH_STYLE);
				ctx.lineWidth=5;
				ctx.beginPath();
				ctx.moveTo(src.x + SQUARE_SIZE*0.5, src.y + SQUARE_SIZE*0.5);
				ctx.lineTo(dst.x + SQUARE_SIZE*0.5, dst.y + SQUARE_SIZE*0.5);
				ctx.stroke();
				ctx.restore();
				ctx.globalAlpha = 1.0;
				
				
				
				// draw a bomb
				if (write.opcode == "HCF") {
					ctx.font = "" + (.75 * SQUARE_SIZE) + "px helvetica";
					ctx.textBaseline = "hanging";
					ctx.drawImage(FIRE_IMG, pos.x, pos.y);
				}
				else {
					ctx.fillStyle = "#fff";
					ctx.fillRect(pos.x, pos.y, 4, 4);
				}
			}
		}
		
		replayer._animate_cycle++;
	}


	replayer.normalize_addr = function(addr) {
		if (addr < 0) {
			addr = 256 + addr;
		}
		return (addr % 256);
	}

	replayer.draw_code = function(is_tied) {
		var ctx = canvas_fg.getContext("2d");
		var status = replayer._current_journal.status;
		ctx.clearRect(CANVAS_SIZE+SQUARE_SIZE, 0, 2000, CANVAS_SIZE*2);

		if (status < 0) {
			ctx.globalAlpha = .8;
			ctx.fillStyle = "#000";
			ctx.fillRect(0, CANVAS_SIZE*.25, CANVAS_SIZE, CANVAS_SIZE/2);
			ctx.globalAlpha = 1;

			ctx.fillStyle = P2_HILIGHT_COLOR;

			ctx.strokeStyle = ctx.fillStyle;
			ctx.strokeRect(0, CANVAS_SIZE*.25, CANVAS_SIZE, CANVAS_SIZE/2);
			ctx.save();
			ctx.translate(0, CANVAS_SIZE*.25);
			ctx.textAlign='center';
			ctx.font = "bold  " + (2 * SQUARE_SIZE) + 'px verdana';			
			ctx.fillText("TIE", CANVAS_SIZE/2, CANVAS_SIZE*.25);
			ctx.restore();
		}
		if (status > 0) {
			// draw winner
			var pname = replayer._replay.program1.player_name;

			ctx.globalAlpha = .8;
			ctx.fillStyle = "#000";
			ctx.fillRect(0, CANVAS_SIZE*.25, CANVAS_SIZE, CANVAS_SIZE/2);
			ctx.globalAlpha = 1;

			if (replayer._replay.winner == 1) {
				ctx.fillStyle = P1_HILIGHT_COLOR;
			}
			else {
				ctx.fillStyle = P2_HILIGHT_COLOR;
				pname = replayer._replay.program2.player_name;
			}

			ctx.strokeStyle = ctx.fillStyle;
			ctx.strokeRect(0, CANVAS_SIZE*.25, CANVAS_SIZE, CANVAS_SIZE/2);
			ctx.save();
			ctx.translate(0, CANVAS_SIZE*.25);
			ctx.textAlign='center';
			ctx.font = "bold  " + (.8 * SQUARE_SIZE) + 'px verdana';
			ctx.fillText(pname.toUpperCase(), CANVAS_SIZE/2, CANVAS_SIZE*.125);
			ctx.font = "bold  " + (2 * SQUARE_SIZE) + 'px verdana';
			ctx.fillText("WINS", CANVAS_SIZE/2, CANVAS_SIZE*.25);
			ctx.restore();
		}

		ctx.save();
		ctx.translate(SQUARE_SIZE/2, CANVAS_SIZE+(SQUARE_SIZE/2));
		ctx.clearRect(0, 0, 2000, 200);
		ctx.font = "bold " + (.6 * SQUARE_SIZE) + "px Helvetica";
		ctx.fillStyle = "#fff";
		var cycle = replayer._current_journal.cycle.toLocaleString(
			'en',
			{ minimumIntegerDigits:4,
			  minimumFractionDigits:0,useGrouping:false}
		)
		ctx.textBaseline = "hanging";
		ctx.fillText("CYCLE " + cycle, 0, SQUARE_SIZE*.25);

		ctx.strokeStyle = ctx.fillStyle;
		ctx.lineWidth=5;
		ctx.beginPath();
		ctx.moveTo(SQUARE_SIZE*4.5, 0);
		ctx.lineTo(SQUARE_SIZE*4.5, SQUARE_SIZE);
		ctx.stroke();


		var status_label = "";
		switch (status) {
		case -1:
			status_label = "tied."
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
			status_label = "died by JUMP 0";
			break;
		default:
			status_label = "???";
		}

		if (status > 0) {
			status_label = "program " + replayer._current_journal.program + " " + status_label;

		}

		ctx.font = "" + (.5 * SQUARE_SIZE) + "px Verdana";
		ctx.fillText(status_label.toUpperCase(), CANVAS_SIZE/3, SQUARE_SIZE*.25);

		ctx.restore();

		for (var p = 0 ; p < 2 ; p++) {
			ctx.save();
			ctx.translate(CANVAS_SIZE + SQUARE_SIZE, (SQUARE_SIZE*2) + p * (CANVAS_SIZE/2.5));
			ctx.clearRect(0, 0, 600, (CANVAS_SIZE/2));

			if (p == 0) {
				ctx.fillStyle = P1_COLOR;
			}
			else {
				ctx.fillStyle = P2_COLOR;
			}

			ctx.strokeStyle = ctx.fillStyle;
			ctx.lineWidth=5;
			ctx.beginPath();
			ctx.moveTo(SQUARE_SIZE/3, SQUARE_SIZE);
			ctx.lineTo(SQUARE_SIZE/3, SQUARE_SIZE * 5.2);
			ctx.stroke();

			var player = replayer._replay.program1;
			if (p == 1) {
				player = replayer._replay.program2;
			}

			ctx.font = "bold  " + (.6 * SQUARE_SIZE) + 'px verdana';
			ctx.fillText(player.player_name.toUpperCase(), 0, 0);


			for (var a = 0 ; a < 7 ; a++) {
				var pc = replayer._pcs[p];
				var addr = replayer.normalize_addr((pc -3) + a);
				var inst = replayer._mem[addr];

				var op = inst.opcode;
				var arg = inst.arg;

				if (op === null || op === undefined) {
					op = "NIL";
				}
				if (arg === null || arg === undefined) {
					arg = "";
				}

				if (op == "HCF") {
					op = "HALT/CATCH-FIRE";
				}

				if (addr == pc) {
					ctx.font = "bold " + (.5 * SQUARE_SIZE) + "px verdana";
				} else {
					ctx.font = "" + (.5 * SQUARE_SIZE) + "px verdana";
				}

				var ppc = addr.toLocaleString(
					'en',
					{ minimumIntegerDigits:4,
					  minimumFractionDigits:0,useGrouping:false}
				)
				ctx.fillText(ppc + " " + op + " " + arg, SQUARE_SIZE, (SQUARE_SIZE*.5)+(1+a) * (SQUARE_SIZE*.6));
			}
			ctx.restore();
		}
	};

	replayer.draw_mem = function() {
		var ctx = canvas_fg.getContext("2d");
		var i = 0;
		for (var y = 0 ; y < 16 ; y++) {
			for (var x = 0 ; x < 16 ; x++) {
				var m = replayer._mem[i];

				var sx = x * (SQUARE_SIZE) + 1;
				var sy = y * (SQUARE_SIZE) + 1;

				// draw program space
				if (m.type == 1 && m.opcode != "HCF") {
					if (m.program == 0) {
						ctx.fillStyle = P1_COLOR;
					}
					else {
						ctx.fillStyle = P2_COLOR;
					}

					ctx.fillRect(sx, sy, SQUARE_SIZE-CELL_BUFFER, SQUARE_SIZE-CELL_BUFFER);
				}
				// draw something that is not a b***
				else if (m.type == 1) {
					ctx.textBaseline = "hanging";

					if (m.program == 0) {
						ctx.fillStyle = P1_COLOR;
					}
					else {
						ctx.fillStyle = P2_COLOR;
					}
					ctx.fillRect(sx, sy, SQUARE_SIZE-CELL_BUFFER, SQUARE_SIZE-CELL_BUFFER);
					ctx.drawImage(FIRE_IMG, sx, sy);

					if ("cluster" in m && m.cluster) {
						ctx.fillStyle = "#fff";
						ctx.font = "bold 18px verdana";
						ctx.fillText("*", sx, sy);
					}
				}
				// draw empty
				else {
					if ("program" in m) {
						if (m.program == 0) {
							ctx.fillStyle = P1_COLOR;
						}
						else {
							ctx.fillStyle = P2_COLOR;
						}
					}
					else {
						ctx.fillStyle = "#191919";
					}
					ctx.fillRect(sx, sy, SQUARE_SIZE-CELL_BUFFER, SQUARE_SIZE-CELL_BUFFER);
				}
				i++;
			}
		}
	}


	replayer.init_mem();
	replayer.reset();
	
	return replayer
}





var RUN_QUEUE = [];

function trigger(ev) {
	document.dispatchEvent(new Event(ev));
}
var R;
document.addEventListener('replay_done',
						  function (ev) {
							  var next_replay = RUN_QUEUE.pop();

							  if (next_replay === undefined) {
								  trigger('run_queue_empty');
							  }
							  else {
								  R = Replayer(next_replay,
											   function () {
												   trigger('replay_done');
											   });
								  R.run();
							  }
						  });

document.addEventListener('run_queue_empty',
						  function (ev) {
							  RUN_QUEUE  = [];
							  $.ajax({
								  cache: false,
								  dataType: 'json',
								  url: '/mx/api/leaderboard',
								  success: function (data) {
									  var ajaxes = [];
									  for (var i = 0 ; i < data.leaders.length ; i++) {
										  var d = data.leaders[i];
										  var r = 1+Math.floor(Math.random() * 4);
											  ajaxes.push(
												  $.ajax({
													  dataType: 'json',
													  url: "/mx/api/journal/" + d.last_battle_id + "/" + r,
												  }));
									  }

									  $.when.apply(undefined, ajaxes).then(
										  function () {
											  var rq = [];
											  // im sure there's a great reason why arguments isn't just a normal array.
											  for(var i = 0 ; i < arguments.length ; i++) {
												  rq.push(arguments[i][0]);
											  }
											  RUN_QUEUE = rq;

											  // shuffle the run-queue
											  for (var i = 0 ; i < RUN_QUEUE.length ; i++) {
												  var swap_to = Math.floor(Math.random() * RUN_QUEUE.length);
												  var t = RUN_QUEUE[i];

												  RUN_QUEUE[i] = RUN_QUEUE[swap_to];
												  RUN_QUEUE[swap_to] = t;
											  }

											  trigger("replay_done");
										  },
										  function () {
											  // failed to pull all the rounds. wait 10 seconds and try again.
											  setTimeout(function() { trigger('run_queue_empty') }, 10 * 1000);
										  });
								  },
								  error: function () {
									  // wait 10 seconds and try again
									  setTimeout(function() { trigger('run_queue_empty') }, 10 * 1000);
								  },
							  });
						  });

window.onerror = function() {
	location.reload();
}

var test = window.location.search.match(/(\d+)$/);

if (test == null) {
	// start the train rolling
	trigger('replay_done');
}
else {
	var ajaxes = [];
	for (var r = 1 ; r < 5 ; r++) {
		ajaxes.push(
			$.ajax({
				dataType: 'json',
				url: "/mx/api/journal/" + test[0] + "/" + r,
			}));
	}

	$.when.apply(undefined, ajaxes).then(
		function () {
			var rq = [];
			// im sure there's a great reason why arguments isn't just a normal array.
			for(var i = 0 ; i < arguments.length ; i++) {
				rq.push(arguments[i][0]);
			}
			RUN_QUEUE = rq;

			trigger("replay_done");
		},
		function () {
			alert("Failed to load specific battle, defauling to all");
			setTimeout(function() { trigger('run_queue_empty') }, 1000);
		});
}


