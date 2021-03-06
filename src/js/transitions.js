const constants = require("./constants.js");
// let rand = require("./rand.js");
import {num, int} from "./rand.js";

let transitions = (() => {
	let con = console;

	let getXY = (pixel, modifier = {}) => {
		var gapX = modifier.gapX || constants.gap;
		var gapY = modifier.gapY || constants.gap;
		var x = (-pixel.x + constants.cols / 2) * (constants.size.width + gapX);
		var y = (-pixel.y + constants.rows / 2) * (constants.size.height + gapY);
		var z = -2000;
		return {
			x: x,
			y: y
		};
	};


	let animateIn = (index, box, pixel, style) => {
		box.active = true;
		if (style === 0) con.warn("animateIn - you are passing in style which is 0!");
		style = style || 0; // int(0,1);

		switch(style) {

			case 1 : // standard transition in to varying y depths, then stabilise
				var pos = getXY(pixel);
				pos.z = -2000;
				box.position.set(pos.x, pos.y, pos.z);

				var time = num(0.5, 1.5), delay = num(0.2, 1.5);

				var anim0 = TweenMax.to(pos, time, {
					z: num(-25, 25),
					delay: delay,
					onUpdate: () => {
						box.position.set(pos.x, pos.y, pos.z);
					}
				});
				var anim1 = TweenMax.to(pos, 0.3, {
					z: 0,
					delay: 3,
					onUpdate: () => {
						box.position.set(pos.x, pos.y, pos.z);
					}
				});
				break;

			case 2 : // zoom in with gaps then circular to centre
				var pos = getXY(pixel, {gapX: 2, gapY: 2});
				pos.z = -2000;
				box.position.set(pos.x, pos.y, pos.z);

				var finalPos = getXY(pixel);
				var time = 1.5, delay = Math.sqrt(finalPos.x * finalPos.x + finalPos.y * finalPos.y) * 0.01;
				var anim0 = TweenMax.to(pos, time, {
					z: 0,
					onUpdate: () => {
						box.position.set(pos.x, pos.y, pos.z);
					}
				});
				var anim1 = TweenMax.to(pos, 2.3, {
					x: finalPos.x,
					y: finalPos.y,
					delay: delay,
					// ease: "Bounce.easeOut",
					ease: Elastic.easeInOut,
					onUpdate: () => {
						box.position.set(pos.x, pos.y, pos.z);
					}
				});
				break;



			case 3 : // horizontal pan
				var pos = getXY(pixel);
				pos.z = -2000;
				box.position.set(pos.x, pos.y, pos.z);

				var time = 2, delay = (pos.y * 0.2 + pos.x + constants.cols / 2) * 0.01;
				var anim0 = TweenMax.to(pos, time, {
					z: 0,
					delay: delay,
					ease: "Bounce.easeOut",
					onUpdate: () => {
						box.position.set(pos.x, pos.y, pos.z);
					}
				});
				break;


		}



		// setTimeout(() => {
		// 	con.log("now... ");
		// 	anim.timeScale( 0.2 ); //sets timeScale to half-speed
		// }, 1000)

		// TweenMax.to(pos, num(0.5, 1.5), {
		// 	// x: x,
		// 	// y: y,
		// 	z: num(50, 100),
		// 	delay: num(0.2, 1.5),
		// 	onUpdate: () => {
		// 		box.position.set(pos.x, pos.y, pos.z);
		// 	}
		// });

	}

	let animateBetween = (index, box, pixel, style) => {
		box.active = true;
		if (style === 0) con.warn("animateBetween - you are passing in style which is 0!");
		// style = style;// || int(0, 1);
		// con.log("animateBetween");

		style = 4;

		box.material.color.setHex(pixel.colour);

		switch(style) {
			case 1 : // wiggle to new position.
				var pos = {
					x: box.position.x,
					y: box.position.y,
					z: box.position.z
				};


				var finalPos = getXY(pixel);

				// con.log("animateBetween");

				var time = 2, delay = num(0.2, 1);
				var anim0 = TweenMax.to(pos, time, {
					x: finalPos.x,
					y: finalPos.y,
					z: -100,
					delay: delay,
					// ease: "Bounce.easeOut",
					onUpdate: () => {
						box.position.set(pos.x, pos.y, pos.z);
					}
				});
				break;


			case 2 : // bezier to new position.
				var pos = {
					x: box.position.x,
					y: box.position.y,
					z: box.position.z
				};

				var finalPos = getXY(pixel);
				var xv = 100, yv = 100, zv = 100
				var anim0 = TweenMax.to(pos, 5, {
					bezier:[
						{x: num(-xv, xv), y: num(-yv, yv), z: num(-zv, zv)},
						{x: num(-xv, xv), y: num(-yv, yv), z: num(-zv, zv)},
						{x: finalPos.x, y: finalPos.y, z: 0}
					],
					ease: Power1.easeInOut,
					onUpdate: () => {
						box.position.set(pos.x, pos.y, pos.z);
					}
				});
				break;

			case 3 : // exterior projected bezier to new position.
				var pos = {
					x: box.position.x,
					y: box.position.y,
					z: box.position.z
				};

				var finalPos = getXY(pixel);
				var m = 2;
				var anim0 = TweenMax.to(pos, 2, {
					//*/
					bezier:[
						{
							x: num(-1, 1) * 10,
							y: num(-1, 1) * 10,
							z: 300 //num(-1, 1) * 1000
						},
						{
							x: finalPos.x,
							y: finalPos.y,
							z: 0
						}
					],
					//*/
					// x: finalPos.x,
					// y: finalPos.y,
					// z: 0,
					delay: num(0, 1),
					ease: Power1.easeInOut,
					onUpdate: () => {
						box.position.set(pos.x, pos.y, pos.z);
					}
				});
				break;

			case 4 : // zoom to centre
				var pos = {
					x: box.position.x,
					y: box.position.y,
					z: box.position.z
				};

				var finalPos = getXY(pixel);
				var anim0 = TweenMax.to(pos, 2, {
					bezier:[
						{
							x: num(-1, 1) * 10,
							y: num(-1, 1) * 10,
							z: -300
						},
						{
							x: finalPos.x,
							y: finalPos.y,
							z: 0
						}
					],
					delay: num(0, 1),
					ease: Power1.easeInOut,
					onUpdate: () => {
						box.position.set(pos.x, pos.y, pos.z);
					}
				});
				break;
			}

	}


	let animateOut = (index, box, pixel, style) => {
		if (box.active === false) return;
		if (style === 0) con.warn("animateOut - you are passing in style which is 0!");
		var pos = {
			x: box.position.x,
			y: box.position.y,
			z: box.position.z
		};

		var anim0 = TweenMax.to(pos, 2, {
			x: box.position.x * num(100, 200),
			y: box.position.y * num(100, 200),
			z: 200,
			ease: Power4.easeIn,
			onUpdate: () => {
				box.position.set(pos.x, pos.y, pos.z);
			},
			onComplete: () => {
				box.active = false;
			}
		});
	}

	return {
		animateIn: animateIn,
		animateBetween: animateBetween,
		animateOut: animateOut
	}
})();

module.exports = transitions;