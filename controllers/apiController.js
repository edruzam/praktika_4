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

    app.get("/api/room/:number/sensors-with-last-data", function (req, res) {
        db.any(
        "SELECT distinct on (datasensor.id_controllersensor) datasensor.id, datasensor.date_time, datasensor.data, typevalue.dimension, typevalue.valuetype, c1.sensorname, c1.room FROM datasensor " +
        "INNER JOIN (SELECT controller_sensor.id, controller_sensor.room, sensor.sensorname FROM controller_sensor " +
		"               INNER JOIN sensor ON sensor.id=controller_sensor.id_sensor) c1 " +
	    "    ON c1.id=datasensor.id_controllersensor " +
        "INNER JOIN typevalue ON typevalue.id=datasensor.id_typevalue " +
        "WHERE c1.room=" + req.params.number + "::varchar " +
        "ORDER BY datasensor.id_controllersensor, datasensor.date_time DESC"
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

    // Näidata, millised kontrollerid on andmebaasis
    app.get("/api/controllers", function (req, res) {
        db.any("SELECT DISTINCT controller FROM controller")
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch((err) => {
                res.json({
                    description: "Can't find any controller",
                    error: err,
                });
            });
    });

    // Näidata, millised andurid on konkreetse kontrolleriga ühendatud
    app.get("/api/controller/:number/sensors", function (req, res) {
        db.any(
        "SELECT sensor.sensorname FROM sensor INNER JOIN controller_sensor ON controller_sensor.id_sensor=sensor.id " +
        "WHERE controller_sensor.id_controller=" + req.params.number + ":: integer"
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

    // Näidata auditooriumi nr 44 andurite andmeid täna
    app.get("/api/room44today", function (req, res) {
        db.any(
        "SELECT datasensor.date_time, datasensor.data, typevalue.dimension, typevalue.valuetype, c1.sensorname, c1.room FROM datasensor " +
        "INNER JOIN (SELECT controller_sensor.id, controller_sensor.room, sensor.sensorname FROM controller_sensor " +
		"               INNER JOIN sensor ON sensor.id=controller_sensor.id_sensor) c1 " +
	    "    ON c1.id=datasensor.id_controllersensor " +
        "INNER JOIN typevalue ON typevalue.id=datasensor.id_typevalue " +
        "WHERE c1.room=44::varchar AND datasensor.date_time::date = CURRENT_DATE + 0 " +
        "ORDER BY datasensor.date_time DESC"
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

    // * Näidata, millised controller_sensors on andmebaasis
    app.get("/api/controller_sensors", function (req, res) {
        db.any("SELECT DISTINCT controller_sensor FROM controller_sensor")
            .then(function (data) {
                res.json({
                    status: "success",
                    data: data,
                });
            })
            .catch((err) => {
                res.json({
                    description: "Can't find any controller_sensor",
                    error: err,
                });
            });
    });
};