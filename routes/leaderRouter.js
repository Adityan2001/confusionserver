const express = require('express');
const mongoose = require('mongoose');
const Leaders = require('../models/leaders');
const leaderRouter = express.Router();

leaderRouter.route('/')
    .get((req, res, next) => {
        Leaders.find({})
            .then(( leaders) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leaders);
            }, (err) => {
                next(err);
            })
            .catch((err) => {
                next(err);
            });
    })


    .post((req, res, next) => {
        Leaders.create(req.body)
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            }, (err) => {
                next(err);
            })
            .catch((err) => {
                next(err);
            });
    })


    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('Not Supported on ' + 'leaders');
    })


    .delete((req, res, next) => {
        Leaders.deleteMany({})
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            }, (err) => {
                next(err);
            })
            .catch((err) => {
                next(err);
            });
    });





    leaderRouter.route('/:leaderId')       //leader Id
    .get((req, res, next) => {
        Leaders.findById(req.params.leaderId).
            then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            }, (err) => {
                next(err);
            })
            .catch((err) => {
                next(err);
            });
    })


    .post((req, res, next) => {
        res.end('Post not supported on leaders/leaderId');
    })


    .put((req, res, next) => {
        Leaders.findByIdAndUpdate(req.params.leaderId, { $set: req.body },
            { new: true }).
            then((leader) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            }, (err) => {
                next(err);
            })
            .catch((err) => {
                next(err);
            });
    })

    .delete((req, res, next) => {
        Leaders.findByIdAndDelete(req.params.leaderId)
            .then((resp) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json');
                res.json(resp);
            }, (err) => {
                next(err);
            })
            .catch((err) => {
                next(err);


            });
    });

    module.exports = leaderRouter;
