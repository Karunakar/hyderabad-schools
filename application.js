var map;
var location;
var markers = [];
var default_locations;

var initial_schools = [
	{title: 'Montessori High School', location: {lat: 17.498038, lng: 78.410369}},
	{title: 'Priyadarshini High School', location: {lat: 17.388872052208015, lng:  78.40040017037474}},
	{title: 'Nagarjuna Grammar High School', location: {lat: 17.49173, lng: 78.325663}}
]

SchoolClass = function(data) {
	var self = this;
    this.title = data.title;
    this.lat = data.location.lat;
    this.lng = data.location.lng;
	
	this.enabled = ko.observable(true);		
	this.largeInfowindow = new google.maps.InfoWindow();  
    this.infoWindow = new google.maps.InfoWindow({content: self.contentString});
    
    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.location.lat, data.location.lng),
        map: map,
        title: data.title,
		animation: google.maps.Animation.DROP
    });
	
	this.marker.setMap(map);
	
    this.showMarker = ko.computed(function() {
        if(this.enabled() === true) 
		{
            this.marker.setMap(map);
        } 
		else 
		{
            this.marker.setMap(null);
        }
        return true;
    }, this);
	
	
	this.marker.addListener('click', function(){
		self.contentString = '<div ><b>' + data.title + "</b></div>";

        self.infoWindow.setContent(self.contentString);

        self.infoWindow.open(map, this);
		
		self.marker.setAnimation(google.maps.Animation.BOUNCE);
		
        
       
	 });
	 
	this.Bounce = function() {
        google.maps.event.trigger(self.marker, 'click');
    };
		
};
var ViewModel = function() {
	var self = this;
	this.all_locations = ko.observableArray([]);
	this.searchSchool = ko.observable('');

	
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

	map = new google.maps.Map(document.getElementById('map'),
	{
		center: {lat: 17.498038, lng: 78.410369},
		zoom: 11,
		animation: google.maps.Animation.DROP,
		styles: styles

	});
	
    initial_schools.forEach(function(location_obj)
	{
		self.all_locations.push( new SchoolClass(location_obj));
    }); 
	

	this.searchSchools = ko.computed( function() {
		var search_school = self.searchSchool().toLowerCase();
        if (search_school) 
		{
			return ko.utils.arrayFilter(self.all_locations(), function(school) 
			{
				
                var school_in_lower = school.title.toLowerCase();
                var school_enabled = (school_in_lower.search(search_school) >= 0);
                school.enabled(school_enabled);
                return school_enabled;
            });
			
        } 
		else 
		{
			self.all_locations().forEach(function(school)
			{
                school.enabled(true);
            });
            return self.all_locations(); 
			
        }
    }, self);
    
};



