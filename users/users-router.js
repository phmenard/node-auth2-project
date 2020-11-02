const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Users = require("./users-model")
const { restrict } = require("./users-middleware")

const router = express.Router()

router.get("/users", restrict("hr"),  async (req, res, next) => {
	try {
		res.json(await Users.find())
	} catch(err) {
		next(err)
	}
})

router.post("/register", async (req, res, next) => {
	try {
		const { username, password, department } = req.body
		const user = await Users.findByUsername(username)

		if (user) {
			return res.status(409).json({
				message: "Username has already been taken",
			})
		}

		const newUser = await Users.add({
			username,
            password: await bcrypt.hash(password, 12),
            department
		})

		res.status(201).json(newUser)
	} catch(err) {
		next(err)
	}
})

router.post("/login", async (req, res, next) => {
	try {
        
        const { username, password } = req.body
        //console.log(username)
		const user = await Users.findByUsername(username)
		
		if (!user) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})
		}

		// check for valid password
		const passwordValid = await bcrypt.compare(password, user.password)

		if (!passwordValid) {
			return res.status(401).json({
				message: "Invalid Credentials",
			})
		}

		// generate a new JSON web token with some user details and sign it
		const token = jwt.sign({
			userID: user.id,
			userDepartment: user.department,
		}, "jacob 123")

		// tell the client to save the cookie
		res.cookie("token", token)

		res.json({
			message: `Welcome to my API ${user.username}!`,
		})
	} catch(err) {
		next(err)
	}
})

router.get("/logout", async (req, res, next) => {
	try {
        // log out of the session
        res.cookie("token").destroy()                 //.cookie("token").destroy()
		res.status(204).end()
		
	} catch (err) {
		next(err)
	}
})

/*router.get("/logout", async (req, res, next) => {
	try {
        // log out of the session
        res.cookie("token").destroy((err) => {
			if (err) {
				next(err)
			} else {
				res.status(204).end()
			}
		})
	} catch (err) {
		next(err)
	}
})*/

module.exports = router