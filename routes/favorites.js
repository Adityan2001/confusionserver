var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

var authenticate = require('../authenticate');

favoriteRouter.route('/')
.get(authenticate.verifyOrdinaryUser,function(req, res, next){
    Favorites.find({"author": req.user._id
})  .populate ('author')
.populate ('dishes')
.then((favorite)=>{
    res.statusCode=200;
    res.setHeader('Content-Type', 'application/json');
    res.json(favorite);
}, (err) => {
    next(err);
})
.catch((err)=>{
    next(err);
});
})
// Favorites.find({}, function (err, favorite) {
//     if (err) throw err;
//     res.json(favorite);      
//})

.post(authenticate.verifyOrdinaryUser, function (req, res, next){
    Favorites.findOne({"author":req.user._id}, function (err, favorite){ 
        
        if(!favorite){
            Favorites.create(req.body, function (err, favorite) {
               if (err) throw err;
    
               favorite.author = req.user._id; 
               console.log(' favorite has been created!');
               for(var i=0;i<req.body.length;i++)
               {
                favorite.dishes.push(req.body[i]._id);
               }
                favorite.save() 
                .then((favorite) =>{
                    res.statusCode=200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);

                },(err) => next(err) )
                .catch((err)=>next(err));    
            });                
                
    
    } else{


        for(var i=0;i<req.body.length;i++)
        {
            var index = favorite.dishes.indexOf(req.body[i]._id);
        
            if(index > -1)
                continue;
        
            favorite.dishes.push(req.body[i]._id);
        }
        favorite.save()
            .then((fav)=>{
                res.statusCode=200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            },(err)=>  next(err) )
            .catch((err)=>next(err));        
        }
    
    });


})

.delete(authenticate.verifyOrdinaryUser, function (req, res, next) {
    Favorites.remove({"author":req.user._id})
    .then((fav)=>{
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.end("FAvorite list deleted");
    },(err)=>  next(err) )
    .catch((err)=>next(err)); 
})


favoriteRouter.route('/:favoriteId')

.post( authenticate.verifyOrdinaryUser, function (req, res, next) {
    Favorites.findOne({"author":req.user._id }, function (err, favorite) { 
        if(!favorite){
            Favorites.create(null,function (err, favorite) {
                if (err) 
                    throw err;
                favorite.user = req.user._id; 
                favorite.dishes.push(req.params.favoriteId);
                favorite.save(function (err, favorite) {
                    if (err) 
                        throw err;
                    res.json(favorite);
                }); 
            }); 

        }
        else{
            var index = favorite.dishes.indexOf(req.params.favoriteId);
            if(index > -1){
                res.statusCode = 401;
                res.setHeader('Content-Type', 'application/json');
                res.json({err: 'Dish already in Favorite\'s List'});
            }
            else{
                favorite.dishes.push(req.params.favoriteId);
                favorite.save(function (err, favorite) {
                    if (err) 
                        throw err;
                    res.json(favorite);
                });
            }
        } 
    });  
})




.delete(authenticate.verifyOrdinaryUser, function(req, res, next){
    Favorites.findOne({author: req.user._id}, function (err, favorite) {
        if (err) throw err;
        if (favorite) {
            var index = favorite.dishes.indexOf(req.params.favoriteId);
            if (index > -1) {
                favorite.dishes.splice(index, 1);//splice(start, deleteCount)
            }
            favorite.save(function (err, x) {
                if (err) throw err;
                res.json(x);
            });
        } else {
            var err = new Error('There is no Favorites');
            err.status = 404;
            return next(err);
        }
    });
});



module.exports =favoriteRouter;
