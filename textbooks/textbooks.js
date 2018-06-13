$(document).ready(function () {
    $('#run-course').click(function () {
        window.location.href = 'index.html?course_code:"' +  $('#course-books').val() + '"'
    });

    $('#run-isbn').click(function () {
        window.location.href = 'index.html?isbn:"' +  $('#isbn-books').val() + '"'
    });

    let url = window.location.href;
    let params = url.split('?');
    if(params.length === 2){
        displayBooks(fetcher(params[1]));

    }
});

function fetcher(query) {
    let json = [];
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            json = JSON.parse(this.responseText);
        }
    };
    xmlhttp.open("GET", 'https://cors.io/?https://cobalt.qas.im/api/1.0/textbooks/filter?q=' + query + '&key=bolBkU4DDtKmXbbr4j5b0m814s3RCcBm&limit=100', false);
    xmlhttp.send();
    return json;
}


function displayBooks(json) {
    $('#accordion').accordion({
        collapsible: true,
        heightStyle: "content"
    });

    json.forEach(function (item) {
        let title = "<h3><b>" + item.title + "</b>  "+  item.author +"</h3>";
        let image = "<img style='max-height: 300px; float: left; width: 18%' src='"+item.image + "'>";
        let content = "<div style='float: right; width: 80%'> UofT Bookstore Price: " + item.price + "</div>";
        $('#accordion').append(title + "<div>" + image +  content+ "</div>")
    });
    $('#accordion').accordion("refresh");
}