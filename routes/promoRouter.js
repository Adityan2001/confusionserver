const express = require('express');
const mongoose = require('mongoose');
const Promotions = require('../models/promotions');
const promoRouter = express.Router();

const authenticate = require('../authenticate');

promoRouter.route('/')
    .get((req, res, next) => {
        Promotions.find({})
        
            .then((promotions) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotions);
            }, (err) => {
                next(err);
            })
            .catch((err) => {
                next(err);
            });
    })


    .post(authenticate.verifyUser,(req, res, next) => {
        Promotions.create(req.body)
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, (err) => {
                next(err);
            })
            .catch((err) => {
                next(err);
            });
    })


    .put(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 403;
        res.end('Not Supported on ' + 'promotions');
    })


    .delete((req, res, next) => {
        Promotions.deleteMany({})
            .then((promo) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, (err) => {
                next(err);
            })
            .catch((err) => {
                next(err);
            });
    });





promoRouter.route('/:promoId')       //PRomotion Id
    .get((req, res, next) => {
        Promotions.findById(req.params.promoId).
            then((promotion) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotion);
            }, (err) => {
                next(err);
            })
            .catch((err) => {
                next(err);
            });
    })


    .post((req, res, next) => {
        res.end('Post not supported on promotions/promoId');
    })


    .put(authenticate.verifyUser,(req, res, next) => {
        Promotions.findByIdAndUpdate(req.params.promoId, { $set: req.body },
            { new: true }).
            then((promo) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, (err) => {
                next(err);
            })
            .catch((err) => {
                next(err);
            });
    })

    .delete(authenticate.verifyUser,(req, res, next) => {
        Promotions.findByIdAndDelete(req.params.promoId)
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

    module.exports = promoRouter;
