$(document).ready(function() {

    //variables



    //retrieve Json data
    $.getJSON('http://localhost:3000/users', function(data) {

        

        //$ul.html('') clear select

        //now let's populate our select with Json data
        // for(var i = 0; i < data.length; i++){
        //     $ul.append('<li id=" ' + data[i]['id'] + '">' + " <b>ID:</b> " + data[i]['id'] + " <b>Name:</b> " + data[i]['name'] + '</li>');
        // }

    })

})
