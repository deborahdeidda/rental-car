$(document).ready(function() {

    //variables
    var $bus = $('#bus')


    //retrieve Json data
    $.getJSON('http://localhost:3000/bus_vehicles', function(data) {

        $bus.html('');//clear select

        //now let's populate our col with Json data
        for(var i = 0; i < data.length; i++){
            $bus.append('<div class="col-12 col-md-4" id=" ' + data[i]['id'] + '">' + " <b>Manufacturer:</b> " + data[i]['manufacturer'] + "<br>" + " <b>Vehicle type:</b> " + data[i]['vehicle_type'] + "<br>" + " <b>Model:</b> " + data[i]['model'] + "<br>" + " <b>Number plate:</b> " + data[i]['number_plate'] + "<br>" + " <b>Registration year:</b> " + data[i]['registration_year'] + "<br>" + " <b>Availability:</b> " + data[i]['availability'] + '</div>');
        }

        //let's write the total number of users
        var $number_vehicles = data.length;
        $('#h2').html(function(data) {
            return "Number of vehicles: " + $number_vehicles;
        });

    })

})
