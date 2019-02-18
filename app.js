// подключение express
var express = require("express"),
    	bodyParser = require('body-parser'),
    	form = require('express-form'),
    	field = form.field;

// создаем объект приложения
var app = express();

app.use(bodyParser());


// определяем обработчик для маршрута "/"
app.get("/", function(request, response){
     
    // отправляем ответ
    response.send("<h2>Привет Express!!!</h2>");
});





app.post("/users", function(req, res){
	res.send("<h2>POST метод USERS</h2>");
});

app.get("/users", function(req, res){
	res.send("<h2>Получение всех пользователей</h2>");
});




app.get("/users/:id", 
	
	form(form.field("id").trim().required().is(/^[0-9]+$/)), 

	function(req, res){
	
		res.send("<h2>Получение данных об одном пользователе </h2>");
	}
);




app.put("/users/:id", function(req, res){
	res.send("<h2>PUTT</h2>");
});
app.delete("/users/:id", function(req, res){
	res.send("<h2>DELETE</h2>");
});

// начинаем прослушивать подключения на 3000 порту
app.listen(3003);