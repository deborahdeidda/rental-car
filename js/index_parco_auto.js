$(document).ready(function() {

  $.ajax({
    url: 'http://localhost:3000/bus_vehicles',
    method: 'get',
    dataType: 'json',
    success: function (data) {
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
    }
  })

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
