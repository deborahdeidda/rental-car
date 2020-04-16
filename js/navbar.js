fetch("./navbar.html")
    .then(response => {
        return response.text()
    })
    .then(data => {
        document.querySelector("header").innerHTML = data
    })

// $(document).ready(function() {
//     $("header").loadHTML("../public/navbar.html")
// })

