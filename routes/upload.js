exports.upload = function(req, res){
    res.render('upload',{ title: 'subir_imagen' });
  };


// Importamos el modulo para subir ficheros
var fs = require('fs');

exports.Uploads = function(req, res) {
    console.log(req.files);
    var tmp_path = req.files.photo.path;
    // Ruta donde colocaremos las imagenes
    //var target_path = 'C:\Users\chivi\Documents\github\NodeBlogTeam\images' + req.files.photo.name;
    var target_path = 'C:/Users/chivi/Documents/github/NodeBlogTeam/images' + req.files.photo.name;
   // Comprobamos que el fichero es de tipo imagen
    if (req.files.photo.type.indexOf('image')==-1){
                res.send('El fichero que deseas subir no es una imagen');
                console.log("hola")
    } else {
        console.log("hola1")
         // Movemos el fichero temporal tmp_path al directorio que hemos elegido en target_path
        fs.rename(tmp_path, target_path, function(err) {
            if (err) throw err;
            // Eliminamos el fichero temporal
            fs.unlink(tmp_path, function() {
                if (err) throw err;
                res.render('add_article',{message: '/images/' + req.files.photo.name,title: 'subir_imagen'});
            });
         });
     }
};