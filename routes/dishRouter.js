const express = require('express');
const mongoose = require('mongoose');
const Dishes = require('../models/dishes');
const dishRouter = express.Router();


dishRouter.route('/')
    .get((req, res, next) => {
        Dishes.find({})
            .then((dishes) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dishes);
            }, (err) => {
                next(err);
            })
            .catch((err) => {
                next(err);
            });
    })


    .post((req, res, next) => {
        Dishes.create(req.body)
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => {
                next(err);
            })
            .catch((err) => {
                next(err);
            });
    })


    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('Not Supported on ' + 'dishes');
    })


    .delete((req, res, next) => {
        Dishes.deleteMany({})
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => {
                next(err);
            })
            .catch((err) => {
                next(err);
            });
    });





dishRouter.route('/:dishId')       //DishId
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId).
            then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => {
                next(err);
            })
            .catch((err) => {
                next(err);
            });
    })


    .post((req, res, next) => {
        res.end('Post not supported on dishes/dishId');
    })


    .put((req, res, next) => {
        Dishes.findByIdAndUpdate(req.params.dishId, { $set: req.body },
            { new: true }).
            then((dish) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => {
                next(err);
            })
            .catch((err) => {
                next(err);
            });
    })

    .delete((req, res, next) => {
        Dishes.findByIdAndDelete(req.params.dishId)
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


dishRouter.route('/:dishId/comments')
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments);
                } else {
                    err = new Error('Dish' + req.params.dishId + 'not found!');
                    err.status = 404;
                    return next(err);

                }
            }, (err) => next(err))
            .catch((err) => next(err));

    })
    .post((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    dish.comments.push(req.body);
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish.comments);
                        }, (err) => next(err));
                } else {
                    err = new Error('Dish' + req.params.dishId + 'not found!');
                    err.status = 404;
                    return next(err);

                }
            }, (err) => next(err))
            .catch((err) => next(err));

    })


    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT not Supported on ' + 'dishes/' + req.params.dishId + '/comments');

    })


    .delete((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    for (var i = dish.comments.length - 1; i >= 0; i--) {
                        dish.comments.id(dish.comments[i]._id).remove();
                    }
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);

                        })

                } else {
                    err = new Error('Dish' + req.params.dishId + 'not found!');
                    err.status = 404;
                    return next(err);

                }
            }, (err) => next(err))
            .catch((err) => next(err));

    })




dishRouter.route('/:dishId/comments/:commentId')  //comment id

    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {

                if (dish == null || dish.comments.id(req.params.commentId) == null) {

                    if (dish == null) {

                        err = new Error('Dish ' + req.params.dishId + ' not found');
                        err.status = 404;
                        return next(err);

                    } else {

                        err = new Error('Comment ' + req.params.commentId + ' not found');
                        err.status = 404;
                        return next(err);

                    }
                }

                // res.statusCode = 200;
                // res.setHeader('Content-Type', 'application/json');
                res.statusCode(200).setHeader('Content-Type', 'application/json').json(dish.comments.id(req.params.commentId));

            }, (err) => {

                err = new Error('Dishes/dish' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);

            })
            .catch((err) => next(err));
    })


    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on Dishes/' + req.params.dishId
            + '/comments/' + req.params.commentId);
    })


    .put((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {

                if (dish == null) {

                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);

                }

                if (dish.comments.id(req.params.commentId) == null) {

                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }

                if (req.body.rating) {

                    dish.comments.id(req.params.commentId).rating = req.body.rating;
                }

                if (req.body.comment) {

                    dish.comments.id(req.params.commentId).comment = req.body.comment;
                }

                if (req.body.author) {

                    dish.comments.id(req.params.commentId).author = req.body.author;
                }

                dish.save().then((dish) => {

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);

                }, (err) => next(err));

            }, (err) => {

                err = new Error('Dishes/dish' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);

            })
            .catch((err) => next(err));
    })


    .delete((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {

                if (dish == null) {

                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);

                } if (dish.comments.id(req.params.commentId) == null) {

                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);

                }

                dish.comments.id(req.params.commentId).remove();

                dish.save().then((dish) => {

                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish);

                }, (err) => next(err));

            }, (err) => {

                err = new Error('Dishes/dish' + req.params.dishId + ' not found');
                err.status = 404;
                return next(err);

            })
            .catch((err) => next(err));
    })










module.exports = dishRouter;

// dishRouter.router('/');
// dishRouter.use(bodyParser.json());
// dishRouter.route('/')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
// .get((req,res,next) => {
//     res.end('Will send all the dishes to you!');
// })
// .post((req, res, next) => {
//     res.end('Will add the dish: ' + req.body.name + ' with details: ' +
//     req.body.description);
// })
// .put((req, res, next) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /dishes');
// })
//     .delete((req, res, next) => {
//     res.end('Deleting all dishes');
// });

// dishRouter.route('/:dishId')
// .all((req,res,next) => {
//     res.statusCode = 200;
//     res.setHeader('Content-Type', 'text/plain');
//     next();
// })
// .get((req,res,next) => {
//     res.end('Will send details of the dish: ' + req.params.dishId +' to you!');
// })
// .post((req, res, next) => {
//     res.statusCode = 403;
//     res.end('POST operation not supported on /dishes/'+ req.params.dishId);
// })
// .put((req, res, next) => {
//     res.write('Updating the dish: ' + req.params.dishId + '\n');
//     res.end('Will update the dish: ' + req.body.name +' with details: ' + req.body.description);
// })
// .delete((req, res, next) => {
//     res.end('Deleting dish: ' + req.params.dishId);
// });

// module.exports = dishRouter;