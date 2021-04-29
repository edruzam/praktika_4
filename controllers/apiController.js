var config = require("../config");
var pgp = require("pg-promise")();
var db = pgp(config.getDbConnectionString());

module.exports = function (app) {

    app.get('/', function (req, res) {
        res.send('Hello, World');
    });

    app.get('/tere', function (req, res) {
        res.send('Tere, Maailm');
    });

    app.get("/api/rooms", function (req, res) {
        db.any("SELECT DISTINCT room FROM controller_sensor")
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch((err) => {
                res.json({
                    description: "Can't find any room",
                    error: err,
                });
            });
    });
};