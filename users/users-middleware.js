const jwt = require("jsonwebtoken")

const roles = ["hr", "admin"]

function restrict(role) {
	return async (req, res, next) => {
		try {
			// get the token value from a cookie
			const token = req.cookies.token
			if (!token) {
				return res.status(401).json({
					message: "no cookie detected credentials",
				})
			}

			// make sure the signature on the token is valid and still matches the payload
			// (we need to use the same secret string that was used to sign the token)
			jwt.verify(token, "jacob 123", (err, decoded) => {
				if (err) {
					return res.status(401).json({
						message: "Invalid secret key",
					})
				}

				// use an index-based scale for checking permissions rather than a hard
				// equality check, since admins should still be able to access regular routes
				/*if (role && roles.indexOf(decoded.department) < roles.indexOf(role)) {
					return res.status(401).json({
						message: "Invalid role",
					})
				}*/

				// make the token's decoded payload available to other middleware
				// functions or route handlers, in case we want to use it for something
				req.token = decoded

				// at this point, we know the token is valid and the user is authorized
				next()
			})
		} catch(err) {
			next(err)
		}
	}
}

module.exports = {
	restrict,
}