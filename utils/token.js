const pool = require('./pool')

module.exports = async function (req, res, next) {
    let token = req.headers['x-access-token'];
    if (token) {
        try{
            let data = await pool.query("select * from UserInfo where  accessToken= ?", [token]);
            req.userInfo = data[0][0];
            next();
        }catch (err){
            res.status(500).json(err);
            next();
        }
    } else {
        next();
    }
}