var map;

var markers = [];

var default_locations;

var location;

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
	
	
    // this.contentString = '<div>' + data.title + '</div>';
	
	this.largeInfowindow = new google.maps.InfoWindow();

  
    this.infoWindow = new google.maps.InfoWindow({content: self.contentString});

    
    this.marker = new google.maps.Marker({
        position: new google.maps.LatLng(data.location.lat, data.location.lng),
        map: map,
        title: data.title
    });
	
	this.marker.setMap(map);
	
	/*this.showMarker = ko.computed(function() {
		this.marker.setMap(map);
		return true;
    }, this);*/
	
	// Only makes the one selected marker visible.
    this.showMarker = ko.computed(function() {
        if(this.visible() === true) {
            this.marker.setMap(map);
        } else {
            this.marker.setMap(null);
        }
        return true;
    }, this);

		
	
	this.marker.addListener('click', function(){
			self.contentString = '<div class="info-window-content"><div class="title"><b>' + data.title + "</b></div>";

        self.infoWindow.setContent(self.contentString);

        self.infoWindow.open(map, this);

       
	 });
		
};
var ViewModel = function() {
	var self = this;
	// alert("ViewModel");
	 // Initializes a blank array for locations
    this.all_locations = ko.observableArray([]);
	
	this.searchSchools = ko.observable('');

	this.firstName = ko.observable('');
	
	//this.locationList = ko.observableArray([]);
	//this.locationList = ko.observableArray([]);
	
	
	map = new google.maps.Map(document.getElementById('map'), {
	// center: {lat: 40.7413549, lng: -73.9980244},
		//center: {lat: 12.94715, lng: 77.57888},
		center: {lat: 17.498038, lng: 78.410369},
		zoom: 10
	});
	
	
	
    initial_locations.forEach(function(location_obj){
		self.all_locations.push( new SchoolClass(location_obj));
    }); 
	

   
	
	// this.searchTerm = ko.observable('');
	this.searchTerm = ko.observable('');

	this.filteredList = ko.computed( function() {
		//return self.all_locations();
        var filter = self.searchTerm().toLowerCase();
		
        if (!filter) {
			self.all_locations().forEach(function(locationItem){
                locationItem.visible(true);
            });
            return self.all_locations();
        } else {
			//alert(filter);
            return ko.utils.arrayFilter(self.all_locations(), function(locationItem) {
				alert(locationItem);
								alert(locationItem.long);

                var string = locationItem.title.toLowerCase();
                var result = (string.search(filter) >= 0);
                locationItem.visible(result);
                return result;
            });
			
        }
    }, self);
	
	
    
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

