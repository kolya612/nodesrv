// подключение express и
const express = require("express"),
    	form = require("express-form"),
    	field = form.field;

const { Pool } = require('pg');
const connectionString = 'postgres://root:111111@database:5432/testdb'
const sql = new Pool({
  connectionString: connectionString,
});

var app = express();

// ADD USER
app.post("/users",
	form(
		field("name").trim().required().is(/^[a-zA-Zа-яА-ЯёЁ]+$/).minLength(2).maxLength(50),
		field("email").trim().required().isEmail(),
		field("sex").trim().required().is(/^[1-2]{1}$/)
	),
	function (req, rs) {

		if (!req.form.isValid) {
			rs.status(406).send(req.form.getErrors());
		} else {
			// положим в базу данных получив id     req.form.name
			const text = 'INSERT INTO users (name, email, sex) VALUES ($1,$2,$3) RETURNING *';
			const values = [req.form.name, req.form.email, req.form.sex];
			sql.query(text, values, (err, res) => {
			  	if (err) {
			    	rs.status(500).send(err.stack);
			  	} else {
			  		// Created
			    	rs.status(201).send(res.rows[0]); 
			  	}
			})
		}
	}
);

// GET USERS
app.get("/users", function(req, rs){

	const text = 'SELECT * FROM users';
	sql.query(text, (err, res) => {
		if (err) {
		    rs.status(500).send(err.stack);
		} else {
		  	if(res.rowCount == 0){
		  		//No content
				rs.status(204).send(res.rows); 
		  	} else {
		  		rs.status(200).send(res.rows); 
		  	}
		}
	})
});

// GET USER BY ID
app.get("/users/:id", 
	form(field("id").trim().required().is(/^[0-9]+$/)), 
	function(req, rs){	
		if (!req.form.isValid) {
			rs.status(406).send(req.form.getErrors());
		} else {
			// положим в базу данных получив id     req.form.name
			const text = 'SELECT * FROM users WHERE id = $1';
			const values = [req.form.id];
			sql.query(text, values, (err, res) => {
			  	if (err) {
			    	rs.status(500).send(err.stack);
			  	} else {
				  	if(res.rowCount == 0){
				  		//No content
						rs.status(204).send(); 
				  	} else {
				  		rs.status(200).send(res.rows); 
				  	}
			  	}
			})
		}
	}
);

// UPDATE USER
app.put("/users/:id", 

	form(
		field("id").trim().required().is(/^[0-9]+$/), 
		field("name").trim().required().is(/^[a-zA-Zа-яА-ЯёЁ]+$/).minLength(2).maxLength(50),
		field("email").trim().required().isEmail(),
		field("sex").trim().required().is(/^[1-2]{1}$/)
	),
	function (req, rs) {
		if (!req.form.isValid) {
			rs.status(406).send(req.form.getErrors());
		} else {
			// положим в базу данных получив id     req.form.name
			const text = 'UPDATE users SET name = $1, email = $2, sex = $3 WHERE id = $4';
			const values = [req.form.name, req.form.email, req.form.sex, req.form.id];
			sql.query(text, values, (err, res) => {
			  	if (err) {
			    	rs.status(500).send(err.stack);
			  	} else {
			  		// Created
			    	rs.status(201).send(res.rows[0]); 
			  	}
			})
		}
	}
);

// DELETE USER
app.delete("/users/:id",
	form(field("id").trim().required().is(/^[0-9]+$/)), 
	function(req, rs){	

		if (!req.form.isValid) {
			rs.status(406).send(req.form.getErrors());
		} else {
			// положим в базу данных получив id     req.form.name
			const text = 'DELETE FROM users WHERE id = $1';
			const values = [req.form.id];
			sql.query(text, values, (err, res) => {
			  	if (err) {
			    	rs.status(500).send(err.stack);
			  	} else {
				  	rs.status(204).send();
			  	}
			})
		}
	}
);

// 404
app.all("*", function(request, response){
	//Bad Request
    response.status(404).send("404");
});

// начинаем прослушивать подключения на 3000 порту
app.listen(3000);