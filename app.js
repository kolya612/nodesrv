// подключение express и
const express = require("express"),
    	form = require("express-form"),
    	field = form.field;

// const { User } = require('pg');
// const user = new User(
//   user: 'root',
//   host: 'database.server.com',
//   database: 'mydb',
//   password: 'secretpassword',
//   port: 3211	
// );

var app = express();


app.get("/", function(request, response){
    response.status(500).send("Error");
});

// ADD USER
app.post("/users",
		form(
			field("name").trim().required().is(/^[a-zA-Z ]+$/).minLength(2).maxLength(50),
			field("email").trim().required().isEmail(),
			field("sex").trim().required().is(/^[1-2]{1}$/)
		),

		function(req, res){
			if (!req.form.isValid) {

				var errUser = {};

				errUser['errors'] = req.form.errors;

				if(req.form.getErrors("name") != ''){
					errUser['name'] = 'error';
				} 
				if(req.form.getErrors("email") != ''){
					errUser['email'] = 'error';
				}
				if(req.form.getErrors("sex") != ''){
					errUser['sex'] = 'error';
				}

				res.status(500).send(errUser);

			} else {
				// положим в базу данных получив id



				// await client.connect()

				// const res = await client.query('SELECT $1::text as message', ['Hello world!'])
				// console.log(res.rows[0].message) // Hello world!
				// await client.end()

				res.status(200).send("<h2>POST метод USERS - добавление пользователя</h2>");
			}


			
			// вернем результат json
		}
);







app.get("/users", function(req, res){
	res.send("<h2>Получение перечня всех пользователей</h2>");
});

app.get("/users/:id", 
	
	form(field("id").trim().required().is(/^[0-9]+$/)), 

	function(req, res){	
		if (!req.form.isValid) {
			res.send("<h2>НЕ ТО: " + req.form.id + " </h2>");

		} else {

			res.send("<h2>Получение данных об одном пользователе " + req.form.id + " </h2>");
		}
	}
);




app.put("/users/:id", function(req, res){
	res.send("<h2>PUTT - редактирование пользователя</h2>");
});
app.delete("/users/:id", function(req, res){
	res.send("<h2>DELETE - удаление пользователя</h2>");
});

// начинаем прослушивать подключения на 3000 порту
app.listen(3000);