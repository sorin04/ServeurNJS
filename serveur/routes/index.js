var express = require('express');
const {getAll, getId, add, sup, update} = require("../mysql/requettes");
var router = express.Router();
const jwt = require("jsonwebtoken");
const secretKey = "lavieestunlongfleuvetranquille";
const authenticate = (req, res, next) => {
    const accessToken = req.headers["authorization"];
    const refreshToken = req.cookies['refreshToken'];
    if (!accessToken && !refreshToken) {
        return res.status(401).send("Access denied. No token provided.");
    }
    try {
        const decoded = jwt.verify(accessToken, secretKey);
        req.user = decoded.user;
        next();
    } catch (error) {
        return res.status(401).send(error.name);
    }

}

router.get("/protected", authenticate, (req, res) => {
    res.send("Welcome to protected route");
});
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Bienvenue sur notre ServeurNodeJS'});
});

router.get('/getall', getAll);
router.get('/get/:id', getId);
router.post('/add', add);
router.delete('/delete/:id', sup);
router.put('/update/:id', update);
router.post('/login', (req, res) => {
        const user = {
            id:1,
            username:"bob",
            password:"1234"
        };
        const {login, password} = req.body;

        if(!password || !login) {
            return res.status(401).send("Login failed.");
        }
        if(login === user.username && password === user.password) {
            const accessToken = jwt.sign({user}, secretKey, {expiresIn: '20s'});
            const refreshToken = jwt.sign({user}, secretKey, {expiresIn: '1d'});
            return res.cookie("refreshToken", refreshToken, {httpOnly: true, sameSite: "strict"})
                .header("Authorization", accessToken).send(accessToken);
        } else {
            return res.status(401).send("Bad login or password.");
        }

    })

router.post('/refresh', (req, res) => {
        const refreshToken = req.cookies['refreshToken'];
        if (!refreshToken) {
            return res.status(401).send('Access Denied. No refresh token provided.');
        }

        try {
            const decoded = jwt.verify(refreshToken, secretKey);
            const accessToken = jwt.sign({ user: decoded.user }, secretKey, { expiresIn: '20s' });

            res
                .header('Authorization', accessToken)
                .send(accessToken);
        } catch (error) {
            return res.status(400).send('Invalid refresh token.');
        }
    });

module.exports = router;
