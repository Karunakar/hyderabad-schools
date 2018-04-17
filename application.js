var map;
var location;
var markers = [];
var default_locations;

var initial_locations = [
	{title: 'Montessori High School', location: {lat: 17.498038, lng: 78.410369}},
	{title: 'Priyadarshini High School', location: {lat: 17.388872052208015, lng:  78.40040017037474}},
	{title: 'Nagarjuna Grammar High School', location: {lat: 17.49173, lng: 78.325663}}
]

SchoolClass = function(data) {
	var self = this;
    this.title = data.title;
    this.lat = data.location.lat;
    this.long = data.location.lng;
	
	this.visible = ko.observable(true);
		
	this.largeInfowindow = new google.maps.InfoWindow();
  
    this.infoWindow = new google.maps.InfoWindow({content: self.contentString});
    
    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.location.lat, data.location.lng),
        map: map,
        title: data.title
    });
	
	this.marker.setMap(map);
	
    this.showMarker = ko.computed(function() {
        if(this.visible() === true) {
            this.marker.setMap(map);
        } else {
            this.marker.setMap(null);
        }
        return true;
    }, this);
	
	
	this.marker.addListener('click', function(){
			self.contentString = '<div ><b>' + data.title + "</b></div>";

        self.infoWindow.setContent(self.contentString);

        self.infoWindow.open(map, this);
		
		self.marker.setAnimation(google.maps.Animation.BOUNCE);
		
        setTimeout(function() {
            self.marker.setAnimation(null);
        }, 2100);
       
	 });
	 
	this.bounce = function() {
        google.maps.event.trigger(self.marker, 'click');
    };
		
};
var ViewModel = function() {
	var self = this;
	this.all_locations = ko.observableArray([]);
	
	var styles = [
          {
            featureType: 'water',
            stylers: [
              { color: '#19a0d8' }
            ]
          },{
            featureType: 'administrative',
            elementType: 'labels.text.stroke',
            stylers: [
              { color: '#ffffff' },
              { weight: 6 }
            ]
          },{
            featureType: 'administrative',
            elementType: 'labels.text.fill',
            stylers: [
              { color: '#e85113' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -40 }
            ]
          },{
            featureType: 'transit.station',
            stylers: [
              { weight: 9 },
              { hue: '#e85113' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'labels.icon',
            stylers: [
              { visibility: 'off' }
            ]
          },{
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [
              { lightness: 100 }
            ]
          },{
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [
              { lightness: -100 }
            ]
          },{
            featureType: 'poi',
            elementType: 'geometry',
            stylers: [
              { visibility: 'on' },
              { color: '#f0e4d3' }
            ]
          },{
            featureType: 'road.highway',
            elementType: 'geometry.fill',
            stylers: [
              { color: '#efe9e4' },
              { lightness: -25 }
            ]
          }
        ];

	map = new google.maps.Map(document.getElementById('map'), {
	// center: {lat: 40.7413549, lng: -73.9980244},
		//center: {lat: 12.94715, lng: 77.57888},
		center: {lat: 17.498038, lng: 78.410369},
		zoom: 11,
		styles: styles

	});
	
    initial_locations.forEach(function(location_obj){
		self.all_locations.push( new SchoolClass(location_obj));
    }); 
	
	this.searchSchool = ko.observable('');

	this.searchSchools = ko.computed( function() {
		//return self.all_locations();
        var filter = self.searchSchool().toLowerCase();
		
        if (!filter) {
			self.all_locations().forEach(function(school){
                school.visible(true);
            });
            return self.all_locations();
        } else {
			//alert(filter);
            return ko.utils.arrayFilter(self.all_locations(), function(school) {
				alert(school);
								alert(school.long);

                var string = school.title.toLowerCase();
                var result = (string.search(filter) >= 0);
                school.visible(result);
                return result;
            });
			
        }
    }, self);
	
	//elf.marker.setAnimation(google.maps.Animation.BOUNCE);
	
	
	
	
    
};



/*var ViewModel = function(first, last) {
    this.firstName = ko.observable(first);
    this.lastName = ko.observable(last);
 
    this.fullName = ko.computed(function() {
		alert(1);
        // Knockout tracks dependencies automatically. It knows that fullName depends on firstName and lastName, because these get called when evaluating fullName.
        return this.firstName() + " " + this.lastName();
    }, this);
}; */
 
//ko.applyBindings(new ViewModel());

