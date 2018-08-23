

function load() {
	defaultCanvas();
	$('svg').addClass('svg');
	setSwatches(theScheme);
}



var activeHue = 200;
var activeSat = 100;
var activeLit = 60;



function defaultCanvas() {
	$("[data-name='outline'], [data-name='outlines'], #outline").css('pointer-events','none');
	
}


// $('#gallery svg *, #gallery svg g *').mousedown(function(){
//   $(this).css("fill", activeColor);
// });


$('g g').on('click', function() {
  var chosenGroup = '#' + this.id + ' *';
  $(chosenGroup).css('fill', activeColor);

});
// $('#gallery svg *, #gallery svg g *').hover(function(){
// 	if (down) {
// 	  	$(this).css("fill", activeColor);		
// 	}
// });


// $('#gallery svg *, #gallery svg g *').click(function(){



// var brushing = setInterval(brush,50);

var scaleTo = changeScale.value;
var check = setInterval(scaleVal,10);

function scaleVal() {
	scaleTo = changeScale.value;
	// $('.activeModal svg').css('transform','scale(' + (scaleTo/20) + ')');
	$('.activeModal svg').css('height', scaleTo*3 + '%');

}


// var xi, yi;
// function showCoords(event) {
// 	if (activeSVG !== undefined) {
// 		xi = event.pageX - ($('#activeSVG').offset().left);
//     	yi = event.clientY - ($('#activeSVG').offset().top);	
//     	console.log("x = " + xi + ", y = " + yi);	
// 	}
// }


// function brush() {
// 	if ( $('#activeSVG:active').length) {

// 	  var draw = SVG('activeSVG');
// 	  var circle = draw.circle(bwidth).attr({ fill: activeColor }).move(xi,yi);

// 	  // circle.attr({ cx: xi, cy: yi });
// 	  // group.add(circle);
// 	  // $('#activeSVG').
// 	}
// }





//  TOOL KIT

var bucket = false;
var eyeDrop = false;
var eraser = false;
var marker = false;


$(document).on('keypress', function(event) {
	hey(event.keyCode);
	// Activate Bucket
	if (event.keyCode == 32) {
		if (!eyeDrop) {
			$('activeModal.SVGbox svg').addClass('eyeDrop');
			$('#toolkit div').removeClass('activeTool');
			$('#eyeDropTool').addClass('activeTool');
			eyeDrop = false;
		}
		eyeDrop = true;
	}
});

$('.eyeDrop path, .eyeDrop * path').click(function(){
	hey();
});


var x, y, w, h;

document.addEventListener('mousemove', onMouseUpdate, false);

var down = false;
$('#colorPicker, .SVGbox').mousedown(function(){
	down = true;
	idleTime = 0;
});

$('#colorPicker').click(function(){
	idleTime = 0;
	x = event.clientX - $('#colorPicker').offset().left;
	y = event.clientY - $('#colorPicker').offset().top;
	clickMove(x, y);
});

$('#colorPicker, .SVGbox').mouseup(function() {down = false;});
// $('#colorPicker, .SVGbox').mouseout(function() {down = false;});

function onMouseUpdate(e) {
	x = e.clientX - $('#colorPicker').offset().left;
	y = e.clientY - $('#colorPicker').offset().top;

	if (x > 0 && y > 0 && down) {
		idleTime=0;
		clickMove(x, y);
	}

}

function clickMove(x, y) {
	activeHue = Math.floor(360*x/w);
	activeLit = 100 - Math.floor(100*y/h);

	pickerButton.style.left = x + "px";
	pickerButton.style.top = y + "px";
	changeColor(activeHue, activeSat, activeLit);	
}


function changeColor(hue,sat,lit) {
	activeColor = "hsl(" + hue + ", " + sat + "%, " + lit + "%)";
	console.log(activeColor);

	activeSwatch.style.background = activeColor;
	swatches.style.background = activeColor;
	pickerButton.style.background = activeColor;

}



var swatchOpened = false;



var schemes = [];
for (var i = 0; i < palettes.children.length; i++) {
	let aScheme = [];
	for (var j = 0; j < palettes.children[i].children.length; j++) {
		aScheme.push(palettes.children[i].children[j].innerHTML);
	}
	schemes.push(aScheme);
	var first = palettes.children[i].children[0].innerHTML;
	var second = palettes.children[i].children[1].innerHTML;
	var third = palettes.children[i].children[2].innerHTML;
	var fourth = palettes.children[i].children[3].innerHTML;
	palettes.children[i].style.background = "linear-gradient(90deg, " + first + " 0%, " + second + " 33%, " + third + " 67%, " + fourth + " 100%)";
}

theScheme = schemes[Math.floor(Math.random()*schemes.length)];



$('#palettes').on('click',function() {
	$(this).toggleClass('open');
});


$('.palette').on('click',function(){changePalette(this)});

function changePalette(that) {
	console.log(that);
	var theScheme = [];
	if(that !== undefined) {
	console.log(that);
		for (var i = 0; i < that.children.length; i++) {
			theScheme.push(that.children[i].innerHTML);
		}
	}
	setSwatches(theScheme);
}



function setSwatches(theScheme) {

		// changePalette();
		console.log(theScheme);

		for (var i = 0; i < $('.swatch').length; i++) {

		// activeHue = Math.floor(Math.random() * 360);
		// activeLit = Math.floor(25 + Math.random() * 51);

		activeHue = getRgbArray(theScheme[i], false, 'hsl')[0];
		activeLit = getRgbArray(theScheme[i], false, 'hsl')[2];

		console.log(swatches.children[i]);

		activeColor =  "hsl(" + activeHue + ", " + activeSat + "%, " + activeLit + "%)";

		swatches.children[i].style.background = activeColor;
		swatches.children[i].value = activeColor;
		changeColor(activeHue,activeSat,activeLit);
		movePicker();

	}
}


$('.swatch').click(function() {
	$('.swatch').attr("id","not");
	$(this).attr("id","activeSwatch");
	var colorArray = getRgbArray($(this).css('background'), false, 'hsl');
	idleTime=0;
	changeColor(colorArray[0], colorArray[1], colorArray[2]);
	movePicker(colorArray[0],colorArray[2]);
});


// Show color picker when you click a swatch, and hide it when you idle 

var idleInterval;
var idleTime = 0;

$('#swatches').on('doubletap',function(event){
	showRainbow();
});

$('#swatches').dblclick(function(){
	showRainbow();
});

function showRainbow() {
	$('#toolkits').addClass('showRainbow');
	clearInterval(idleInterval);
    idleInterval = setInterval(timer, 1000); 
}


$('.SVGbox').click(function(){
	$('#toolkits').removeClass('showRainbow');
	$('#palettes').removeClass('open');

});

function timer() {
    idleTime++;
    if (idleTime > 3) {
        $('#toolkits').removeClass('showRainbow');
        idleTime = 0;
    }
}


function movePicker(left, top) {
	w = colorPicker.clientWidth;
	h = colorPicker.clientHeight;
	pickerButton.style.left = (w*left/360) + "px";
	pickerButton.style.top = (h*(1-top/100)) + "px";

	console.log("picker left = " + pickerButton.style.left + ", picker top = " + pickerButton.style.top);
}



// UI INTERACTIONS


$('#title').click(function (){closeModals()});
$('#userBtn').click(function (){openModal('#userModal')});
$('#helpBtn').click(function (){openModal('#helpModal')});

$("#gallery").on("click", ".SVGbox", function() {
	openModal(this);
	$('#toolkits').removeClass('hide');
	title.src = "img/auroraLogo.png";
	nav.style.background = 'transparent';
	$('#title, .icon svg').css('filter','none');
	$('.icon svg path').css('fill','#2f2f2f');

	if (!swatchOpened) {
		setTimeout(function(){setSwatches();}, 500);		
		swatchOpened = true;
	}
});




function openModal(modal) {
	if ($(modal).hasClass('activeModal') && (!$(modal).hasClass('SVGbox'))) {
		closeModals();
	}else {
		title.src = "img/auroraLogoL.png";
		$('.SVGbox svg').css('height','15rem');
		$('*').removeClass('activeModal');
		if ($(modal).is('#userModal')) {			
			$('#userBtn svg path').css('fill','#ffba40');
			$('#helpBtn svg path').css('fill','#f5f5f5');
		}
		if ($(modal).is('#helpModal')) {			
			$('#helpBtn svg path').css('fill','#86fff7');
			$('#userBtn svg path').css('fill','#f5f5f5');
}
		$(modal).addClass('activeModal');
	}
}

function closeModals() {
	$('.activeModal svg').css('height','15rem');
	changeScale.value = 10;
	$('*').removeClass('activeModal');
	$('.toolkits').addClass('hide');

	title.src = "img/auroraLogoL.png";
	nav.style.background = 'linear-gradient(rgba(0,0,10,.7) 0%, transparent)';
	$('#userBtn svg path').css('fill','#f5f5f5');
	$('#helpBtn svg path').css('fill','#f5f5f5');
	$('#title, .icon svg').css('filter','drop-shadow(0 0 10px black)');
};




// HEY!

function hey(log) {
	if (log) {		
	console.log(log);
	} else {
	console.log('hey');
	}
}