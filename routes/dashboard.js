var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard');
});

router.get('/movielist', function(req, res, next) {
  res.render('dashboard/data_table');
});

router.get('/form', function(req, res, next) {
  res.render('flatUI/form');
});

router.get('/test', function(req, res, next) {
  res.render('flatUI/form');
});


router.post('/movielist/enrollment',function(req,res,next){
  console.log(req.body);
  // creates DB schema

  // compiels our schema into a model
  // var User = mongoose.model('User', boardSchema);

  
  res.json(req.body);
});
module.exports = router;
