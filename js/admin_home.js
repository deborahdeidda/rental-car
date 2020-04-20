$(document).ready(function() {

    //global variable
    var $user = $('#user')
    var $h2 = $('#h2')

    //retrieve Json data
    $.getJSON('http://localhost:3000/users', function(data) {

        $user.html('') //clear select

        //now let's populate our col with Json data
        for(var i = 0; i < data.length; i++){
            $user.append('<div class="col-12 col-md-4">' + '<div class="card">' + ' <img src="../img/avatar.png" alt="Avatar" style="width:100%"> ' + '<div class="container">' + '<h4 id=" ' + data[i]['id'] + ' ">' + data[i]['name'] + " " + data[i]['surname'] + '</h4>' + "<br>" + '<p id="id">' + "<b>ID </b>" + data[i]['id'] +  '</p>' + "<br>" + '<p id="name">' + "<b>NAME </b>" + data[i]['name'] + '</p>' + "<br>" + '<p id="surname">' + "<b>SURNAME </b>" + data[i]['surname'] + '</p>' + "<br>" + '<p id="birthday">' + "<b>DATE OF BIRTH </b>" + data[i]['birthday'] +  '</p>' + "<br>" + '<p id="mail">' + "<b>MAIL </b>" + data[i]['mail'] + '</p>' + "<br>" + '<p id="bookings">' + "<b>BOOKINGS </b>" + data[i]['bookings'] + '</p>' + "<br>" + '<div id="user" class="row pb-3"><div class="col-3 mx-1"><a id="edit-user-btn" href="../public/edit_user_data.html" type="submit" class="btn btn-outline-success">Edit data</a href=".."></div>' + '<div class="col-4 ml-0 mx-1 "><button type="button" class="btn btn-outline-danger">Remove user</button></div><div class="col-3 mx-1"><a href="../public/show_single_user_bookings.html" type="button" class="btn btn-outline-primary">Bookings</a></div>' + '</div>' + '</div>')
        }

        // if(data[i]['bookings'] == undefined){
        //     let empty = "There are no bookings yet"
        //     return empty
        // }

        //let's write the total number of users
        var $numberofusers = data.length;
        $('#h2').html(function(data) {
            return "Number of users: " + $numberofusers
        })
    })
})
