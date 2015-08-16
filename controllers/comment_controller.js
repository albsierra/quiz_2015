var models = require('../models/models.js');

// Autoload :commentId de comentarios
exports.load = function(req, res, next, commentId) {
	models.Comment.find({
		where: { id: Number(commentId) }
	}).then(
		function(comment) {
			if (comment) {
				req.comment = comment;
				next();
			} else { next(new Error('No existe commentId= ' + commentId));}
		}
	).catch(function(error) { next(error);});
};

// GET /quizes/:quizId/comments/new
exports.new = function(req,res) {
	res.render('comments/new', {quizId: req.params.quizId, errors: [] });
};

// POST /quizes/:quizId/comments
exports.create = function(req,res) {
	var comment = models.Comment.build(
			{
				texto:req.body.comment.texto,
				QuizId: req.params.quizId
			}
		);

	comment.validate().then(function(err) {
		if(err){
			res.render('comments/new', {comment: comment, quizId: req.params.quizId, errors: err.errors});
		}else{
			//guarda en DB los campos pregunta, tema y respuesta de quiz
			comment.save({fields: ["texto","QuizId"]}).then(function(){
				res.redirect('/quizes/'+req.params.quizId);
			}) // Redirección HTTP (URL relativo) lista de preguntas
		}
	}).catch(function(error){next(error)});
};

// GET /quizes/:quizId/comments/:commentId/publish
exports.publish = function(req, res) {
	req.comment.publicado = true;

	req.comment.save( {fileds: ["publicado"]})
		.then( function(){ res.redirect('/quizes/'+req.params.quizId);})
		.catch(function(error){next(error)});
};