const db = require("../database/config")

async function add(user) {
	const [id] = await db("users").insert(user)
	return findById(id)
}

function find() {
	return db("users as u")
		.select("u.id", "u.username", "u.department")
}

function findById(id) {
	return db("users")
		.select("id", "username")
		.where({ id })
		.first()
}

function findByUsername(username) {
    return db("users")
        .select("id", "username", "password")
        .where("username", username)
        .first()
		
}


module.exports = {
	add,
	find,
	findByUsername,
}