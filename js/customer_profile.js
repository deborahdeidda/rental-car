$(document).ready(function() {

  //hide alert in html
  $('#alert-data-edited').hide()
  $('#alert-edit-error').hide()
  $('#edit-form').hide()

  getUser()

  function getUser(){
    $user_data = $('#customer-data')
		$.ajax({
			type: "GET",
			url:"http://localhost:3000/600/users/" + localStorage.getItem("userid"),
			contentType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			}
		}).done(function (response) {
      $user_data.html('')
      if(response){
        $user_data.append('<h4 id=" ' + response.id + ' ">' + response.name + " " + response.surname + '</h4>' + "<br>" +
        '<p>' + "<b>NAME </b>" + response.name + '</p>' + "<br>" +
        '<p>' + "<b>SURNAME </b>" + response.surname + '</p>' + "<br>" +
        '<p>' + "<b>DATE OF BIRTH </b>" + response.birthday +  '</p>' + "<br>" +
        '<p>' + "<b>EMAIL </b>" + response.email + '</p>' + "<br>" +
        '<div class="row pb-3 justify-content-center">' +
        '<div class="col-12 d-inline-block">' +
        '<i id="editData" data-userid="' + response.id + '" class="far fa-edit"></i></div></div>')
        loadButton()
			} else {
				false
			}
		}).fail(function (err)  {
			return err
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
      var pass = response.password
      $('#userId').val(response.id)
      $('#name').val(response.name)
      $('#surname').val(response.surname)
      $('#birthday').val(response.birthday)
      $('#email').val(response.email)
      $('#edit-form').show()

      $('#edit-data').click( function(e){
        let data = {
          name: $('#name').val(),
          surname: $('#surname').val(),
          birthday: $('#birthday').val(),
          email: $('#email').val(),
          role: "customer",
          password: pass
        }
        editUser($('#userId').val(), data)
        e.preventDefault()
      })
		}).fail(function (err) {
			return err
		})
  }

  function loadButton(){
    $('#editData').on('click', function(e){
      $("#edit-form").show()
      getData( $(e.target).data('userid') )
      $('html, body').animate({
          scrollTop: ($('#edit-form').offset().top)
      },'slow')
      e.preventDefault()
    })
  }

  function editUser(id, data){
    $.ajax({
			method: "put",
			url:"http://localhost:3000/600/users/" + id,
			dataType: "json",
			beforeSend: function (xhr) {
				xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("jwt"))
			},
      data: data,
      success: function(data){
        $('#edit-form').trigger("reset")
        $('#edit-form').hide()
        $('#alert-data-edited').show()
        getUser()
      },
      error: function(err){
        return err
      }
		})
  }

})
