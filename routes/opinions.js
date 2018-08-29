const express = require('express');
const router = express.Router();

// Opinion Model
let Opinion = require('../models/opinion');
// Article Model
let Article = require('../models/article');

// Add Opinion
router.get('/addop', ensureAuthenticated, function(req, res){
  res.render('add_opinion', {
    title:'Añadir Comentario'
  });
});

// Add Submit POST Route
router.post('/addop', function(req, res){
  //req.checkBody('author','Author is required').notEmpty();
  req.checkBody('opinion','El Comentario es un campo obligatorio').notEmpty();

  // Get Errors
  let errors = req.validationErrors();

  if(errors){
    console.log("error en el iff")
    res.render('add_opinion', {
      title:'Añadir Opinion',
      errors:errors
    });
  } else {
    console.log("paso el if ")
    let opinion = new Opinion();
    // opinion.article = req.article._id;
    opinion.article = "5b86409ad6ed4529d0d83c3a";
    opinion.opinion = req.body.opinion;

    opinion.save(function(err){
      if(err){
        console.log("error en el iff x2")
        console.log(err);
        return;
      } else {
        console.log("Opinion añadida exitosamente");
        req.flash('success','Opinion añadida exitosamente');
        res.redirect('/articles/'+opinion.article);
        // res.redirect('/opinions/'+req.article._id);

        // res.redirect('/');
      }
    });
  }
});

// Get Single Article
// router.get('/:id', function(req, res){
//   Article.findById(req.params.id, function(err, article){
//     User.findById(article.author, function(err, user){
//       res.render('article', {
//         article:article,
//         author: user.name
//       });
//     });
//   });
// });

// Access Control
function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  } else {
    req.flash('danger', 'Necesita acceder a su cuenta');
    res.redirect('/users/login');
  }
}

module.exports = router;
