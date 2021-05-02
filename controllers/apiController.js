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

    app.get("/api/room/:number/sensors", function (req, res) {
        db.any(
        "SELECT sensor.sensorname FROM sensor INNER JOIN controller_sensor ON controller_sensor.id_sensor=sensor.id " +
        "WHERE controller_sensor.room=" + req.params.number + ":: varchar"
        )
        .then(function (data) {
            res.json({
                status: "success",
                data: data,
            });
        })
        .catch(function (err) {
            return next(err);
        });
    });
};