const { ValidationError } = require('./ValidationError');
const { KafkaEventBus } = require('./KafkaEventBus');
const express = require("express");
const app = express();
const form = require("express-form");
const connectionString = process.env.DATABASE_URL;
const { Pool } = require("pg");
const field = form.field;
const Kafka = new KafkaEventBus();
const sql = new Pool({ connectionString,});

/** 
 * ADD USER 
 */
app.post("/users",
	form(
		field("name").trim().required().is(/^[a-zA-Zа-яА-ЯёЁ]+$/).minLength(2).maxLength(50),
		field("email").trim().required().isEmail(),
		field("sex").trim().required().is(/^[1-2]{1}$/)
	),
	(req, rs, next) => {
		if (!req.form.isValid) {
			throw new ValidationError(req.form.getErrors());
		}
		next();
	}, 
	async (req, rs, next) => {
		const text = 'INSERT INTO users (name, email, sex) VALUES ($1,$2,$3) RETURNING *';
		const values = [req.form.name, req.form.email, req.form.sex];
		await sql.query(text, values, (err, res) => {
		  	if (err) {
		    	return rs.status(500).send(err.stack);
		  	} 
		   	rs.status(201).send(res.rows[0]); 
		});
	}
);

/** 
 * GET USERS  
 */
app.get("/users", 
	async (req, rs) => {
		const text = 'SELECT * FROM users';
		await sql.query(text, (err, res) => {
			Kafka.sender('qqqqqqqqqqqq','node-test-0');
			if (err) {
			    return rs.status(500).send(err.stack);
			} 
		  	if(res.rowCount == 0){
				return rs.status(404).send({ 'errorMessage': 'Users not found' }); 
		  	}

	  		rs.status(200).send(res.rows); 
		});
	},
);

/** 
 * GET USER BY ID 
 */
app.get("/users/:id", 
	form(field("id").trim().required().is(/^[0-9]+$/)), 
	(req, rs, next) => {	
		if (!req.form.isValid) {
			throw new ValidationError(req.form.getErrors());
		}
		next();
	}, 
	async (req, rs, next) => {
		const text = 'SELECT * FROM users WHERE id = $1';
		const values = [req.form.id];
		await sql.query(text, values, (err, res) => {
		  	if (err) {
		    	return rs.status(500).send(err.stack);
		  	} 
		  	if(res.rowCount == 0){
				return rs.status(404).send({ 'errorMessage': 'User not found' }); 
		  	} 
		  	rs.status(200).send(res.rows); 
		});
	}
);

/** 
 * UPDATE USER 
 */
app.put("/users/:id", 
	form(
		field("id").trim().required().is(/^[0-9]+$/), 
		field("name").trim().required().is(/^[a-zA-Zа-яА-ЯёЁ]+$/).minLength(2).maxLength(50),
		field("email").trim().required().isEmail(),
		field("sex").trim().required().is(/^[1-2]{1}$/)
	),
	(req, rs, next) => {
		if (!req.form.isValid) {
			throw new ValidationError(req.form.getErrors());
		}
		next();
	}, 
	async (req, rs, next) => {
		const text = 'UPDATE users SET name = $1, email = $2, sex = $3 WHERE id = $4 RETURNING *';
		const values = [req.form.name, req.form.email, req.form.sex, req.form.id];
		await sql.query(text, values, (err, res) => {
			if (err) {
		    	return rs.status(500).send(err.stack);
		  	}
		    rs.status(200).send(res.rows[0]); 
		});
	}
);

/** 
 * DELETE USER 
 */
app.delete("/users/:id",
	form(field("id").trim().required().is(/^[0-9]+$/)), 
    (req, rs, next) => {
		if (!req.form.isValid) {
			throw new ValidationError(req.form.getErrors());
		}
		next();
	}, 
	async (req, rs, next) => {
		const text = 'DELETE FROM users WHERE id = $1';
		const values = [req.form.id];
		await sql.query(text, values, (err, res) => {
		  	if (err) {
		    	return rs.status(500).send(err.stack);
		  	}
		  	rs.status(204).send({ 'message': 'User successfully deleted' });
		});
	}
);

/** 
 * 404
 */
app.all("*", (req, rs) => {
    rs.status(404).send({ 'MessageError': '404' });
});

/** 
 * Form validation error
 */
app.use((err, req, rs, next) => {
	rs.status(406).send(err);
});

module.exports = app;