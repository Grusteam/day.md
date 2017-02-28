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
	localDataDate,
	currentDate,
	citiesObj = {
		Kishinev: 618426,
		Beltsi: 618605,
		Bender: 618577,
		Vulkanistsi: 617094,
		Dubasari: 618365,
		Kagul: 618456,
		Orhei: 617638,
		Ribnita: 617486,
		Tiraspol: 617239,
	},
	citiesArr = [618426, 618605, 618577, 617094, 618365, 618456, 617638, 617486, 617239];

firstStep();
function firstStep(argument) {

	$.ajax({
			url: 'data/datArr9.json',
			type: 'GET',
			dataType: 'json'
		})
		.done(function(data) {
			currentData = data;
		});

}

$('[data-cities]').click(function (e) {
	e.preventDefault();
	var x = + e.target.dataset.cit,
	y = citiesArr[x];
	if (x) {
		secondStep(currentData[x]);
		/*localData = localStorage.getItem(x);
		if (localData) {
		secondStep(JSON.parse(localData));
		} else {
			console.log('нету');
		}*/
	}
});


/*function firstStep() {
	localData = localStorage.getItem('618426'); // локал сторэдж версия
	localDataDate = Date.parse(localStorage.getItem('date')); // когда забирали данные ранее
	currentDate = Date.parse(new Date());
	if (localData) {
		console.log('localData');
		secondStep(JSON.parse(localData));
	} else if ((currentDate - localDataDate) / 60000 > 12 ) {
		$.ajax({
				url: 'http://api.openweathermap.org/data/2.5/forecast/city?id=618426&units=metric&APPID=077dd80b15fedc5b0d726ad229710dca',
				type: 'GET',
				dataType: 'json'
			})
			.done(function(data) {
				console.log('WebData');
				var recievedData = typeof data === 'string' ? JSON.parse(data) : data;
				localStorage.setItem('date', new Date());
				if ('city' in data){
					setLocalStorage(recievedData);
					secondStep(recievedData);
				} else {
					console.log(data);
				}
			})
			.fail(function() {
				console.log("error");
			})
			.always(function() {});
	} else {
		console.log('прошло меньше 12 минут');
	}
}*/

// 
function secondStep(recievedData) {
	currentData = recievedData;
	triWeater(currentData);
}

// погода на 4 периода
function triWeater(WeaterData) {
	for (var i = 0; i < 4; i++) {
		var
			code = +WeaterData.list[i].weather[0].id,
			iconCode = WeaterData.list[i].weather[0].icon,
			temp = WeaterData.list[i].main.temp,
			time = WeaterData.list[i].dt_txt,
			windS = WeaterData.list[i].wind.speed,
			city = WeaterData.city.name,
			sowIcon = 'i' + typeOfWeater(code),
			outstr = 'В ' + city + ' в ' + time + ' будет ' + code + ' погода с температурой ' + temp + ' градусов и ветром скоростью ' + '<div class="i iw"></div>' + ' ' + windS + ' м/с.' + '<img src="http://openweathermap.org/img/w/' + iconCode + '.png" alt="">' + '<div class="i ' + sowIcon +'"></div>' +'</br>';
		$('.wrapper').append(outstr);
		// $(sowIcon).show();
	}
}

// тип погоды
function typeOfWeater(code) {
	var
		weatherCondition =
		code >= 200 && code < 202? 8 :
		code >= 202 && code < 210 ? 9 :
		code >= 210 && code < 300 ? 10 :
		code >= 300 && code < 400 ? 6 :
		code >= 500 && code < 511 ? 5 :
		code >= 511 && code < 600? 7 :
		code >= 600 && code < 602 ? 11 :
		code >= 602 && code < 612 ? 12 :
		code >= 612 && code < 700 ? 13 :
		code >= 700 && code < 800 ? 3 :
		code === 800 ? 1 :
		code === 801 ? 2 :
		code === 802 ? 3 :
		code >= 803 && code < 900 ? 4 :
		code >= 900 && code < 906 ? 10 :
		3;
	return weatherCondition;
}


// запись в localStorage
function setLocalStorage(recievedData) {
	var toLocalStorage = JSON.stringify(recievedData);
	localStorage.setItem('618426', toLocalStorage);
	// sendData(toLocalStorage);
}

// ajax отправка данных через localhost
// function sendData(data) {
// 	$.ajax('/api', {
// 		data: data,
// 		type: 'POST',
// 		success: function(responseData) {
// 			console.log(responseData);
// 		}
// 	});
// }
// 
// ключи
// 4fcbb5699c6ac2b65fea058f7c6fd3f7
// 077dd80b15fedc5b0d726ad229710dca