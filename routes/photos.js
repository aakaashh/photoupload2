var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var PhotoModel = mongoose.model('PhotoModel');

var cloudinary = require('cloudinary');

cloudinary.config({ 
  cloud_name: 'aakaashh',
  api_key: '864237274186291', 
  api_secret: 'NWFn2MroCzVvNfEUCzQy4wuiNaA'  
});

router.get('/', function(req, res){
	PhotoModel.find(function(err, photo_data){
		if(err) console.log(err);
		res.json(photo_data);
	});
});

router.post('/', function(req, res){
	var url_dim = req.body;
	var urls = [];

	url_dim.forEach(function(each){
		if(each[0]==755)
			urls[0] = each[2];
		else if(each[0]==365 && each[1]==450)
			urls[1] = each[2];
		else if(each[0]==365)
			urls[2] = each[2];
		else
			urls[3] = each[2];
	});

	var photo_data = new PhotoModel({
		urls: urls
	});
	photo_data.save(function(err, photo_data1){
		if(err) console.log(err);
		res.json(photo_data1);
	});
});

router.get('/:id', function(req, res){
	PhotoModel.findOne({ _id: req.params.id.slice(1)}, function(err, photo_data){
		if(err) 
			console.log(err);
		else
			res.json(photo_data);
	});
});

router.delete('/delete/:id', function(req, res){

	PhotoModel.findOne({_id: req.params.id.slice(1)}, function(err, photo_data){
		if(err){
			console.log('error');
		}else{

			var urls = photo_data.urls;
			urls.forEach(function(url){
				var filename = url.split('/').pop();
				var public_id = filename.split('.')[0];	
				cloudinary.uploader.destroy(public_id, function(result){
					console.log(result);
				});
			});
			photo_data.remove(function(err, photo_data1){
				if(err)
					console.log(err);
				else{
					res.json(photo_data1);
				}
			});

		} 
	});
});

module.exports = router;