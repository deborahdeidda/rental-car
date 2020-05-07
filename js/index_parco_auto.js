$(document).ready(function() {

  $.ajax({
    url: 'http://localhost:3000/bus_vehicles',
    method: 'GET',
    dataType: 'json',
    success: function (data) {

      //Searchbox
      var datatableInstance = $('#datatable').DataTable({
        paging: true,
        sort: true,
        searching: true,
        data: data,
        columns: [
          { 'data': 'vehicle_type' },
          { 'data': 'model' },
          { 'data': 'registration_year' },
          { 'data': 'number_plate' },
          { 'data': 'availability' }
        ]
      })

      $('#datatable thead th').each(function () {
        var title = $('#datatable tfoot th').eq($(this).index()).text()
        $(this).html('<input type="text" placeholder="Search ' + title + '" />')
      })

      datatableInstance.columns().every(function () {
        var dataTableColumn = this

        var searchTextBoxes = $(this.header()).find('input')

        searchTextBoxes.on('keyup change', function () {
          dataTableColumn.search(this.value).draw()
        })

        searchTextBoxes.on('click', function(e){
          e.stopPropagation()
        })
      })

    },
    error: function(err){
      return err
    }

  })

  $('#bus').html('')
  //get bus vehicles
  $.ajax({
    url: 'http://localhost:3000/bus_vehicles',
    method: 'GET',
    dataType: 'json',
    data: {
      test: "test data"
    },
    success: function (data) {

      //vehicle cards
      $(data).each(function(i, vehicle){
        $('#bus').append('<div class="col-12 col-md-4" id=" ' + vehicle.id + '">' +
        '<div class="card" style="width: 18rem;">' +
        '<img class="card-img-top" src="../img/bus.jfif" alt="Card image cap">' +
        '<div class="card-body">' +
        '<h5 class="card-title">' + vehicle.vehicle_type + '</h5>' +
        '<p class="card-text">Some quick example text to build on the card title and make up the bulk of the cards content.</p></div>' +
        '<ul class="list-group list-group-flush">' +
        '<li class="list-group-item">' + "<b>Model </b>" + vehicle.model + '</li>' +
        '<li class="list-group-item">' + "<b>Manufacturer </b>" + vehicle.manufacturer + '</li>' +
        '<li class="list-group-item">' + "<b>Registration year </b>" + vehicle.registration_year + '</li>' + '<li class="list-group-item">' + "<b>Number plate </b>" + vehicle.number_plate + '</li>' +
        '<li class="list-group-item">' + "<b>Availability </b>" + vehicle.availability + '</li>' + '</div>')
      })

      //let's write the total number of users
      var $number_vehicles = data.length
      $('#h2').html(function(data) {
          return "Number of vehicles: " + $number_vehicles;
      })

    },
    error: function(err){
      return err
    }

  })
})
