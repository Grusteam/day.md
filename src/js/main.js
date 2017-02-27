'use strict'
/*globals $:false, document:false, window:false, console:false, localStorage:false, google:false, setTimeout:false, clearTimeout:false */

var
	ourhref = window.location.href,
	teststr = 'http://day.md/city',
	tempind = teststr.indexOf('day.md/') + 7,
	ourcity = teststr.substring(tempind);

var
	currentData,
	localData,
	cities = {
		Tiraspol: 617239,
		Bender: 618577,
		Ribnita: 617486,
		Dubasari: 618365,
	};


firstStep();

function firstStep() {
	localData = localStorage.getItem('617239'); // локал сторэдж версия
	if (localData) {
		console.log('localData');
		secondStep(JSON.parse(localData));
	} else {
		$.ajax({
				url: 'http://api.openweathermap.org/data/2.5/forecast/city?id=617239&units=metric&APPID=4fcbb5699c6ac2b65fea058f7c6fd3f7',
				type: 'GET',
				dataType: 'json'
			})
			.done(function(data) {
				var recievedData = typeof data === 'string' ? JSON.parse(data) : data;
				secondStep(recievedData);
				setLocalStorage(recievedData);
				console.log('WebData');
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {});
	}
}

// если 
function secondStep(recievedData) {
	currentData = recievedData;
	triWeater(currentData);
}


// погода на 4 периода
function triWeater(WeaterData) {
	for (var i = 0; i < 4; i++) {
		var
			code = +WeaterData.list[i].weather[0].id,
			temp = WeaterData.list[i].main.temp,
			time = WeaterData.list[i].dt_txt,
			windS = WeaterData.list[i].wind.speed,
			outstr = 'В ' + time + ' будет ' + typeOfWeater(code) + ' погода с температурой ' + temp + ' градусов и ветром скоростью ' + windS + ' м/с.' + '</br>';
			
		$('.wrapper').append(outstr);
	}
}

// тип погоды
function typeOfWeater(code) {
	var
		weatherCondition =
		code >= 200 && code < 300 ? 'Thunderstorm' :
		code >= 300 && code < 400 ? 'Drizzle' :
		code >= 500 && code < 511 ? 'Rain' :
		code >= 500 && code < 511 ? 'Rain Rain' :
		code >= 600 && code < 700 ? 'Snow' :
		code >= 700 && code < 800 ? 'Atmosphere' :
		code === 800 ? 'Clear' :
		code > 800 && code < 900 ? 'Clouds' :
		code >= 900 && code < 906 ? 'Extreme' :
		'unknown';
	return weatherCondition;
}


// запись в localStorage
function setLocalStorage(recievedData) {
	var toLocalStorage = JSON.stringify(recievedData);
	localStorage.setItem('617239', toLocalStorage);
	localStorage.setItem('date', new Date());
	sendData();
}

// ajax отправка данных через localhost
function sendData() {
	$.ajax('/api', {
		data: JSON.stringify(currentData),
		type: 'POST',
		success: function(responseData) {
			console.log(responseData);
		}
	});
}