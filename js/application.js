var map;
var location;
var markers = [];
var default_locations;

var initial_schools = [
	{title: 'Montessori High School', location: {lat: 17.498038, lng: 78.410369}
	,venue_id: "575a3d53498e520dcbd0ad15"},
	{title: 'Priyadarshini High School', location: {lat: 17.388872052208015, lng:  78.40040017037474}
	,venue_id: "575a3d53498e520dcbd0ad15"},
	{title: 'Nagarjuna Grammar High School', location: {lat: 17.49173, lng: 78.325663}
	,venue_id: "4f62c60ee4b086a3359d19d7"},
	{title: 'Model Mission High School', location: {lat: 17.493063, lng: 78.51185}
	,venue_id: "5ac7775bc824ae0eaf83dc2c"},
	{title: 'St.Anthonys High School', location: {lat: 17.372229, lng: 78.414474}
	,venue_id: "575a3d53498e520dcbd0ad15"}
	
]

SchoolClass = function(data) {
	var self = this;
    this.title = data.title;
    this.lat = data.location.lat;
    this.lng = data.location.lng;
	
	
	self.id = "";
	self.name = "";
	self.country = "";
	self.address = "";
	
	this.enabled = ko.observable(true);		

	
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
	

	 
	var FOREQUERE_SECREATCODE = "WFCFRLBFF2554T35P5AB0XQANYHD1TAP0IBPFEG40GSJ1HZY"
	var FOREQUERE_CLIENT_ID = "DSKHWK3XN2XPR2NKZFLORNPRMUU5MR4YTZDY33D3XRFGBSOF"
	var FOREQUERE_VERSION = "20180323"
	var FOREQUERE_QUERY = "school"
	var FOREQUERE_URL = "https://api.foursquare.com/v2/venues/search"

	$.ajax({
			type : "GET",
			url : FOREQUERE_URL,
			dataType: 'json',
			data: { "query": FOREQUERE_QUERY, 
					"client_id": FOREQUERE_CLIENT_ID,
					"client_secret": FOREQUERE_SECREATCODE,	
					"v": FOREQUERE_VERSION,
					ll: this.lat + ',' + this.lng
				  },
					
			success: function(result){
				var venue = result.response.venues[0];
				 self.id = venue.id;
				 self.name = venue.name;
				 self.country = venue.location.country;
				 self.address = venue.location.formattedAddress[0] ;
				 if (typeof venue.location.formattedAddress[0] === 'undefined') {
					self.address = "";
				 }
				
				},
			error : function(e) {
				alert("There is any issue with API & Please contact the Development team ");
				console.log("ERROR: ", e);
			}	
		});	
		
		
	

	this.contentString = '<div ><div ><b>' + data.title + "</b></div>" +
	'<div >' + self.id + "</div>" +
	'<div >' + self.name + "</div>" +
	'<div >' + self.address + "</div>" +
	'<div >' + self.country + "</div></div>";
	
	
	this.marker.addListener('click', function(){
	self.contentString = '<div ><div ><b>' + data.title + "</b></div>" +
	'<div >' + self.id + "</div>" +
	'<div >' + self.name + "</div>" +
	'<div >' + self.address + "</div>" +
	'<div >' + self.country + "</div></div>";

  
	self.infoWindow.setContent('<div ><div ><b>' + data.title + "</b></div>" +
	'<div >' + self.id + "</div>" +
	'<div >' + self.name + "</div>" +
	'<div >' + self.address + "</div>" +
	'<div >' + self.country + "</div></div>");

    self.infoWindow.open(map, this);
		
	self.marker.setAnimation(google.maps.Animation.DROP);
		       
       
	 });
	 
	 
	this.largeInfowindow = new google.maps.InfoWindow();  
    this.infoWindow = new google.maps.InfoWindow({content: self.contentString});
  
	 
	this.Bounce = function() {
        google.maps.event.trigger(self.marker, 'click');
    };
		
};
var ViewModel = function() {
	var self = this;
	
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
	
	this.searchSchool = ko.observable('');
	this.all_locations = ko.observableArray([]);

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
	
    initial_schools.forEach(function(location_obj)
	{
		self.all_locations.push( new SchoolClass(location_obj));
    }); 
	


    
};



