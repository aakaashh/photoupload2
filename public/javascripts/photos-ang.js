var app = angular.module('PhotoApp', ['ngResource', 'ngRoute', 'ngJcrop', 'cloudinary', 'ngFileUpload']);

app.factory('mySharedService', function($rootScope){
	var sharedService = {};

	sharedService.imgSrc = '';

	sharedService.prepForBroadcast = function(img){
		this.imgSrc = img;
		this.broadcastItem();
	};

	sharedService.broadcastItem = function(){
		$rootScope.$broadcast('handleBroadcast');
	};

	return sharedService;
});

app.service('imageSelection1', function(){
	return {};
});

app.service('imageSelection2', function(){
	return {};
});

app.service('imageSelection3', function(){
	return {};
});

app.service('imageSelection4', function(){
	return {};
});

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
		.when('/', {
			templateUrl: 'partials/home.html',
			controller: 'HomeCtrl'		
		})
		.when('/upload', {
			templateUrl: 'partials/upload.html'
		})
		.when('/:id', {
			templateUrl: 'partials/image.html',
			controller: 'ImagePageCtrl'
		})
		.when('/delete/:id', {
			templateUrl: 'partials/delete.html',
			controller: 'DeleteCtrl'
		})
		.otherwise({
			redirectTo: '/'
		});

	}]);


app.config(['cloudinaryProvider', function(cloudinaryProvider){
	cloudinaryProvider
      .set("cloud_name", "aakaashh")
      .set("upload_preset", "f7w5rixk");
  }]);

app.config(function(ngJcropConfigProvider){

    ngJcropConfigProvider.setJcropConfig("config1", {
    	bgColor: 'black',
        bgOpacity: .4,
        maxWidth: 1024,
        maxHeight: 1024,
	    minSize: [755, 450],
    	maxSize: [755, 450],
    	aspectRatio: 755/450,
	});

	ngJcropConfigProvider.setPreviewStyle('config1', {
        'width': '755px',
        'height': '450px',
        'overflow': 'hidden',
        'margin': '0px'
    });

	ngJcropConfigProvider.setJcropConfig("config2", {
        bgColor: 'black',
        bgOpacity: 0.4,
        maxHeight: 1024,
        maxWidth: 1024,
        minSize: [365, 450],
        maxSize: [365, 450],
        aspectRatio: 365/450,
    });

	ngJcropConfigProvider.setPreviewStyle('config2', {
        'width': '365px',
        'height': '450px',
        'overflow': 'hidden',
        'margin': '0px'
    });

    ngJcropConfigProvider.setJcropConfig("config3", {
        bgColor: 'black',
        bgOpacity: 0.4,
        maxHeight: 1024,
        maxWidth: 1024,
        minSize: [365, 212],
        maxSize: [365, 212],
        aspectRatio: 365/212,
    });

	ngJcropConfigProvider.setPreviewStyle('config3', {
        'width': '365px',
        'height': '212px',
        'overflow': 'hidden',
        'margin': '0px'
    });

	ngJcropConfigProvider.setJcropConfig("config4", {
        bgColor: 'black',
        bgOpacity: 0.4,
        maxHeight: 1024,
        maxWidth: 1024,
        minSize: [380, 380],
        maxSize: [380, 380],
        aspectRatio: 1,
    });

	ngJcropConfigProvider.setPreviewStyle('config4', {
        'width': '380px',
        'height': '380px',
        'overflow': 'hidden',
        'margin': '0px'
    });

});

app.controller('HomeCtrl', ['$scope', '$resource', 
		function($scope, $resource){
			var Photos = $resource('/api/photos');
			Photos.query(function(photos){
				$scope.photos = photos;
			});

		}
]);

app.controller('ImagePageCtrl', ['$scope', '$resource', '$routeParams',
	function($scope, $resource, $routeParams){
		var Photo = $resource('/api/photos/:id');
		Photo.get({ id: $routeParams.id}, function(photo){
			$scope.photo = photo;
		});
	}
]);

app.controller('DeleteCtrl', ['$resource', '$routeParams', '$location',
	function($resource, $routeParams, $location){
		var Photo = $resource('/api/photos/delete/:id');
		Photo.delete({ id: $routeParams.id}, function(photo){
			$location.path('/');
		});
	}
]);


app.directive("ngFileSelect", function(fileReader, mySharedService){
	var validFormats = ['jpg', 'png'];
	return{
		link: function($scope, el){
			el.bind("change", function(e){
				var files = e.target.files || (e.dataTransfer && e.dataTransfer.files);
				$scope.file = files[0];
				var value = el.val();
				var ext = value.substring(value.lastIndexOf('.') + 1).toLowerCase();
				if(validFormats.indexOf(ext) !== -1){
					fileReader.readAsDataUrl($scope.file, $scope)
					.then(function(result){
						var image = new Image();
						image.src = result;
						image.onload = function(){
							if(image.width == 1024 && image.height == 1024){
								$scope.imageSrc = result;
								$scope.$apply();
								mySharedService.prepForBroadcast(result);
							}else{
								alert("Select image of only 1024px * 1024px");
								el.val(null);
							}
						};
					})					
				}else{
					alert('Formats jps and png only supported');
					el.val(null);
				}
			});
		}
	}
});

app.controller('ImageCtrl1', ['$scope', 'mySharedService', 'imageSelection1', '$rootScope',
	function($scope, sharedService, imageSelection1, $rootScope){
		$scope.obj = imageSelection1;
		$scope.obj.src = 'tiny.jpg';
		$scope.obj.thumbnail = true;
        $scope.obj.selection = [0, 0, 755, 540, 755, 540];
        $rootScope.show = false;
		
		$scope.$on('handleBroadcast', function(){
			$rootScope.show = true;
			$scope.obj.src = sharedService.imgSrc;
	    	$scope.obj.selection = [0, 0, 755, 540, 755, 540];
	    	$scope.obj.thumbnail = true;
	    	$scope.$apply();
		});
	}]);

app.controller('ImageCtrl2', ['$scope', 'mySharedService', 'imageSelection2',
	function($scope, sharedService, imageSelection2){
		$scope.obj = imageSelection2;
		$scope.obj.src = 'tiny.jpg';
		$scope.obj.thumbnail = true;
        $scope.obj.selection = [0, 0, 365, 450, 365, 450];

		$scope.$on('handleBroadcast', function(){
	    	$scope.obj = {};
			$scope.obj.src = sharedService.imgSrc;
		    $scope.obj.selection = [0, 0, 365, 450, 365, 450];
	    	$scope.obj.thumbnail = true;
		});
	}]);

app.controller('ImageCtrl3', ['$scope', 'mySharedService', 'imageSelection3',
	function($scope, sharedService, imageSelection3){
		$scope.obj = imageSelection3;
		$scope.obj.src = 'tiny.jpg';
		$scope.obj.thumbnail = true;
        $scope.obj.selection = [0, 0, 365, 212, 365, 212];

		$scope.$on('handleBroadcast', function(){
	    	$scope.obj = {};
			$scope.obj.src = sharedService.imgSrc;
		    $scope.obj.selection = [0, 0, 365, 212, 365, 212];
	    	$scope.obj.thumbnail = true;
		});
	}]);

app.controller('ImageCtrl4', ['$scope', 'mySharedService', 'imageSelection4',
	function($scope, sharedService, imageSelection4){
		$scope.obj = imageSelection4;
		$scope.obj.src = 'tiny.jpg';
		$scope.obj.thumbnail = true;
        $scope.obj.selection = [0, 0, 380, 380, 380, 380];

		$scope.$on('handleBroadcast', function(){
	    	$scope.obj = {};
			$scope.obj.src = sharedService.imgSrc;
		    $scope.obj.selection = [0, 0, 380, 380, 380, 380];
	    	$scope.obj.thumbnail = true;
		});
	}]);


app.controller('submitCtrl', ['$scope', 'mySharedService', '$location', 'Upload', 'cloudinary', 'imageSelection1', 'imageSelection2', 'imageSelection3', 'imageSelection4', '$resource', '$location',
	function($scope, sharedService, $location, $upload, cloudinary, imageSelection1, imageSelection2, imageSelection3, imageSelection4, $resource, $location){
		$scope.imgSrc = '';
		$scope.imageSelection = [imageSelection1.selection, imageSelection2.selection, imageSelection3.selection, imageSelection4.selection]; 
		$scope.progress = false;
		$scope.upload = function(){
			$scope.progress = true;
			$scope.imgSrc = imageSelection1.src;
			var file = $scope.imgSrc;
			var urls = [];
			var waiting = 4;
			$scope.imageSelection.forEach(function(eachImageSelection){

				var newone = $scope.imageToDateUri(file, eachImageSelection, function(return_src){
					file.upload = $upload.upload({
	          		    url: "https://api.cloudinary.com/v1_1/" + cloudinary.config().cloud_name + "/upload",
	            		data: {
	              			upload_preset: cloudinary.config().upload_preset,
	              			file: return_src
	 			        }
			            }).progress(function(e){
				            eachImageSelection.progress = Math.round((e.loaded * 100.0) / e.total);
				            eachImageSelection.status = "Uploading... " + eachImageSelection.progress + "%";
			            }).success(function (data, status, headers, config) {
			            	eachImageSelection.result = "Success";
	        		    	urls.push([data.width, data.height, data.secure_url]);
							waiting--;
							if(waiting == 0){
								var Photos = $resource('/api/photos');
								Photos.save(urls, function(res){
									$location.path(':'+res._id);
								});
							}
	          			}).error(function (data, status, headers, config) {
	          				waiting = -1;
	          				alert("An error occured. Please try again");	          				
	            			eachImageSelection.result = "Error";
	          			});
				});				
			});


		};

		$scope.imageToDateUri = function(src, selection, callbackFunction) {
		    var canvas = document.createElement('canvas'),
		        ctx = canvas.getContext('2d');
		    var img = new Image();
			img.src = src;

		    canvas.width = selection[4];
		    canvas.height = selection[5];

		    ctx.drawImage(img, selection[0], selection[1], selection[4], selection[5], 0, 0, selection[4], selection[5]);
		    callbackFunction(canvas.toDataURL("image/jpeg"));

		};
}]);

