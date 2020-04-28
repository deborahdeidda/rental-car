$(document).ready(function() {

    //variables
    $user_data = $('#user-data')

    //retrieve Json data
    $.getJSON('http://localhost:3000/users', function(data) {

        $user_data.html('')

        // now let's populate with Json data
        if(data[0]){
            $user_data.append('<h4 id=" ' + data[0]['id'] + ' ">' + data[0]['name'] + " " + data[0]['surname'] + '</h4>' + "<br>" + '<p>' + "<b>ID </b>" + data[0]['id'] +  '</p>' + "<br>" + '<p>' + "<b>NAME </b>" + data[0]['name'] + '</p>' + "<br>" + '<p>' + "<b>SURNAME </b>" + data[0]['surname'] + '</p>' + "<br>" + '<p>' + "<b>DATE OF BIRTH </b>" + data[0]['birthday'] +  '</p>' + "<br>" + '<p>' + "<b>MAIL </b>" + data[0]['mail'] + '</p>' + "<br>" + '<p>' + "<b>BOOKINGS </b>" + data[0]['bookings'] + "<br>" + '<div id="user" class="row text-center"><div class="col-6"><a href="../public/update_own_data.html" type="button" class="btn btn-outline-success"><b>Update data</b></div>' + '<div class="col-6"><a href="../public/manage_own_bookings.html" type="button" class="btn btn-outline-success"><b>Manage bookings</b></div></div>' + '</button>')
        }

    })

})
