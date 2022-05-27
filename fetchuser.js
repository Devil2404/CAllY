const jwt = require('jsonwebtoken');
const JWT_SECRET = 'D3VIL';

const fetchuser = (req, res, next) => {
    const authToken = req.header('auth-Token');
    if (!authToken) {
        res.status(401).send({ error: "PLease authentication Using valid token" });
    }

    try {
        const data = jwt.verify(authToken, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        console.log(error);
        res.status(500).send("Internal Server Occured");
    }
}

module.exports = fetchuser;