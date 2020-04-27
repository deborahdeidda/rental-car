$(document).ready(function() {

    //variables
    var $bus = $('#bus')


    //retrieve Json data
    $.getJSON('http://localhost:3000/bus_vehicles', function(data) {

        $bus.html('');//clear select

        //now let's populate our col with Json data
        for(var i = 0; i < data.length; i++){
            $bus.append('<div class="col-12 col-md-4" id=" ' + data[i]['id'] + '">' + '<div class="card" style="width: 18rem;"><img class="card-img-top" src="../img/bus.jfif" alt="Card image cap"><div class="card-body"><h5 class="card-title">' + data[i]['vehicle_type'] + '</h5>' + '<p class="card-text">Some quick example text to build on the card title and make up the bulk of the cards content.</p>' + '</div>' + '<ul class="list-group list-group-flush"><li class="list-group-item">' + "<b>Model </b>" + data[i]['model'] + '</li><li class="list-group-item">' + "<b>Manufacturer </b>"  + data[i]['manufacturer'] + '</li><li class="list-group-item">' + "<b>Registration year </b>" + data[i]['registration_year'] + '</li><li class="list-group-item">' + "<b>Number plate </b>" + data[i]['number_plate'] + '</li><li class="list-group-item">' + "<b>Availability </b>" + data[i]['availability'] + '</li>' + '</div>');
        }

        //let's write the total number of users
        var $number_vehicles = data.length;
        $('#h2').html(function(data) {
            return "Number of vehicles: " + $number_vehicles;
        });
    })
})
