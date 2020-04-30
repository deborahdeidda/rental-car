$(document).ready(function() {

    $('#alert-data-edited').hide()
    $('#alert-edit-error').hide()
    $('#edit-form').hide()

    $.ajax({
        type: "GET",
        url: 'http://localhost:3000/users?id=' + localStorage.getItem("idfy"),
        contentType: "json",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
            console.log(localStorage.getItem("jwt"))
        }
    }).done(function (response) {
        console.log("done:", response)
    }).fail(function (err)  {
        console.log("failed:", err)
    })

    getUser()

    function getUser(){
        //variables
        $user_data = $('#customer-data')

        //retrieve Json data
        $.getJSON('http://localhost:3000/users?id=' + localStorage.getItem("idfy"), function(data) {
            console.log(data)

            $user_data.html('')

            // now let's populate with Json data
            if(data){
                $user_data.append('<h4 id=" ' + data[0]['id'] + ' ">' + data[0]['name'] + " " + data[0]['surname'] + '</h4>' + "<br>" + '<p>' + "<b>NAME </b>" + data[0]['name'] + '</p>' + "<br>" + '<p>' + "<b>SURNAME </b>" + data[0]['surname'] + '</p>' + "<br>" + '<p>' + "<b>DATE OF BIRTH </b>" + data[0]['birthday'] +  '</p>' + "<br>" + '<p>' + "<b>EMAIL </b>" + data[0]['email'] + '</p>' + "<br>" +

                    '<div class="row pb-3 justify-content-center"><div class="col-12 d-inline-block">' +
                    '<i id="editData" data-userid="' + data[0]['id'] + '" class="far fa-edit"></i></div>' + '</div>')
            }

            loadButton()
        })
    }


    function getData(id){
        $.ajax({
            url: "http://localhost:3000/users/" + id,
            method: "get",
            dataType: "json",
            success: function(data){
                var pass = data.password
                console.log("la password è:", data.password)
                $($('#edit-form ')[0].userId).val(data.id)
                $($('#edit-form')[0].name).val(data.name)
                $($('#edit-form')[0].surname).val(data.surname)
                $($('#edit-form')[0].birthday).val(data.birthday)
                $($('#edit-form')[0].email).val(data.email)
                $('#edit-form').show()

                $('#edit-data').click( function(e){
                    console.log("clicked")
                    let data = {
                        name: $($('#edit-form')[0].name).val(),
                        surname: $($('#edit-form')[0].surname).val(),
                        birthday: $($('#edit-form')[0].birthday).val(),
                        email: $($('#edit-form')[0].email).val(),
                        role: "customer",
                        password: pass
                    }

                    editUser($($('#edit-form')[0].userId).val(), data)
                    e.preventDefault()
                })
            }
        })
    }

    function loadButton(){
        $('#editData').on('click', function(e){
            $("#edit-form").show()
            getData($($(this)[0]).data('userid'))
            $('html, body').animate({
                scrollTop: ($('#edit-form').offset().top)
            },'slow')
            e.preventDefault()
        })
    }

    function editUser(id, data){
        $.ajax({
            url: "http://localhost:3000/users/" + id,
            method: "PUT",
            dataType: "json",
            data: data,
            success: function(data){
                console.log("data edited: ", data)
                $('#edit-form').trigger("reset")
                $('#edit-form').hide()
                $('#alert-data-edited').show()
                getUser()
            }
        })
    }
})
