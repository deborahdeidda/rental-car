$(document).ready(function() {

    $('#alert-data-edited').hide()
    $('#alert-edit-error').hide()
    $('#edit-form').hide()

    $.ajax({
  		type: "GET",
  		url: 'http://localhost:3000/600/users/' + localStorage.getItem("userid"),
  		contentType: "json",
  		beforeSend: function (xhr) {
  			xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
  			console.log("jwt (I am user n) :", localStorage.getItem("jwt"))
  		}
  	}).done(function (response) {
  		console.log("I am user n:", response.id)
  	}).fail(function (err)  {
  		console.log("failed:", err)
  	})

    getUser()

    function getUser(){
      //variables
      $user_data = $('#customer-data')
  		$.ajax({
  			type: "GET",
  			url:"http://localhost:3000/600/users/"+ localStorage.getItem("userid"),
  			contentType: "json",
  			beforeSend: function (xhr) {
  				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
  				console.log("jwt (function get user n):", localStorage.getItem("jwt"))
  			}
  		}).done(function (response) {
  			console.log("function get user n:", response.id)
        $user_data.html('')

        // now let's populate with Json data
        if(response){
            $user_data.append('<h4 id=" ' + response.id + ' ">' + response.name + " " + response.surname + '</h4>' + "<br>" + '<p>' + "<b>NAME </b>" + response.name + '</p>' + "<br>" + '<p>' + "<b>SURNAME </b>" + response.surname + '</p>' + "<br>" + '<p>' + "<b>DATE OF BIRTH </b>" + response.birthday +  '</p>' + "<br>" + '<p>' + "<b>EMAIL </b>" + response.email + '</p>' + "<br>" +

            '<div class="row pb-3 justify-content-center"><div class="col-12 d-inline-block">' +
            '<i id="editData" data-userid="' + response.id + '" class="far fa-edit"></i></div>' + '</div>')
            loadButton()
  			} else {
  				console.log("no data")
  			}

  		}).fail(function (err)  {
  			console.log("failed")
  		})
  	}

    function getData(id){
        $.ajax({
            type: "GET",
            url: "http://localhost:3000/600/users/" + id,
            contentType: "json",
      			beforeSend: function (xhr) {
      				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
      				console.log("jwt (get single data):", localStorage.getItem("jwt"))
      			}
        }).done(function (response) {
    			console.log("get single data:", response)
          var pass = response.password
              $($('#edit-form ')[0].userId).val(response.id)
              $($('#edit-form')[0].name).val(response.name)
              $($('#edit-form')[0].surname).val(response.surname)
              $($('#edit-form')[0].birthday).val(response.birthday)
              $($('#edit-form')[0].email).val(response.email)
              $('#edit-form').show()

              $('#edit-data').click( function(e){
                  alert("clicked")
                  let data = {
                      name: $($('#edit-form')[0].name).val(),
                      surname: $($('#edit-form')[0].surname).val(),
                      birthday: $($('#edit-form')[0].birthday).val(),
                      email: $($('#edit-form')[0].email).val(),
                      role: "customer",
                      password: pass
                  }
                  console.log("I want my new data to be those:", data)
                  editUser($($('#edit-form')[0].userId).val(), data)
                  e.preventDefault()
              })

    		}).fail(function (err)  {
    			console.log("failed")
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
      console.log("data to be edited:", data, "with user:", id)
      $.ajax({
  			method: "put",
  			url:"http://localhost:3000/600/users/" + id,
  			dataType: "json",
  			beforeSend: function (xhr) {
  				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
  				console.log("jwt:", localStorage.getItem("jwt"))
  			},
        data: data,
        success: function(data){
          console.log("data edited: ", data)
          $('#edit-form').trigger("reset")
          $('#edit-form').hide()
          $('#alert-data-edited').show()
          getUser()
        },
        error: function(err){
          	console.log("failed")
        }
  		})
    }
})
