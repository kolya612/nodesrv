const { ValidationError } = require('./src/ValidationError');

const express = require("express"),
    	form = require("express-form"),
    	field = form.field;

const { Pool } = require('pg');
const connectionString = process.env.DATABASE_URL;
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
	function (req, rs, next) {
		if (!req.form.isValid) {
			 throw new ValidationError(req.form.getErrors());
		}
		next();
	}, function (req, rs, next) {
			const text = 'INSERT INTO users (name, email, sex) VALUES ($1,$2,$3) RETURNING *';
			const values = [req.form.name, req.form.email, req.form.sex];
			sql.query(text, values, (err, res) => {
			  	if (err) {
			    	return rs.status(500).send(err.stack);
			  	} 
			   	rs.status(201).send(res.rows[0]); 
			})
	}
);

// GET USERS
app.get("/users", function(req, rs){

	const text = 'SELECT * FROM users';
	sql.query(text, (err, res) => {
		if (err) {
		    return rs.status(500).send(err.stack);
		} 
	  	if(res.rowCount == 0){
			return rs.status(404).send({'errorMessage':'Users not found'}); 
	  	}
	  	rs.status(200).send(res.rows); 
	})
});

// GET USER BY ID
app.get("/users/:id", 
	form(field("id").trim().required().is(/^[0-9]+$/)), 
	function(req, rs, next){	
		if (!req.form.isValid) {
			 throw new ValidationError(req.form.getErrors());
		}
		next();
	}, function (req, rs, next) {
			const text = 'SELECT * FROM users WHERE id = $1';
			const values = [req.form.id];
			sql.query(text, values, (err, res) => {
			  	if (err) {
			    	return rs.status(500).send(err.stack);
			  	} 
			  	if(res.rowCount == 0){
					return rs.status(404).send({'errorMessage':'User not found'}); 
			  	} 
			  	rs.status(200).send(res.rows); 
			})
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
	function (req, rs, next) {
		if (!req.form.isValid) {
			 throw new ValidationError(req.form.getErrors());
		}
		next();
	}, function (req, rs, next) {
			const text = 'UPDATE users SET name = $1, email = $2, sex = $3 WHERE id = $4 RETURNING *';
			const values = [req.form.name, req.form.email, req.form.sex, req.form.id];
			sql.query(text, values, (err, res) => {
			  	if (err) {
			    	return rs.status(500).send(err.stack);
			  	}
			    rs.status(200).send(res.rows[0]); 
			})
	}
);

// DELETE USER
app.delete("/users/:id",
	form(field("id").trim().required().is(/^[0-9]+$/)), 
	function (req, rs, next) {
		if (!req.form.isValid) {
			 throw new ValidationError(req.form.getErrors());
		}
		next();
	}, function (req, rs, next) {
			const text = 'DELETE FROM users WHERE id = $1';
			const values = [req.form.id];
			sql.query(text, values, (err, res) => {
			  	if (err) {
			    	return rs.status(500).send(err.stack);
			  	}
			  	rs.status(204).send({'message':'User successfully deleted'});
			})
	}
);

// 404
app.all("*", function(req, rs){
	//Bad Request
    rs.status(404).send({'MessageError':'404'});
});


// Form validation error
app.use(function(err, req, rs, next) {
	rs.status(406).send(err);
});

app.listen(3000);