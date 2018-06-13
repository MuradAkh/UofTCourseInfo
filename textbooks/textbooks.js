const FB_URL = 'https://www.facebook.com/groups/183712131723915/for_sale_search/?forsalesearchtype=for_sale&availability=available&query=';
const FB_STYLE = ' style=\'background-color: #3B5998; font-family: Tahoma, Arial, serif; text-decoration:none; border: 4px solid #3B5998; color: white; font-size: larger\'';

const AMZN_STYLE = ' style=\'background-color: #ff9900; font-family: Tahoma, Arial, serif; text-decoration:none; border: 4px solid #ff9900; color: black; font-size: larger\'';
const AMZN_URL = 'https://www.amazon.ca/s/field-keywords=';

const EBAY_STYLE = ' style=\'background-color: #e53238; font-family: Tahoma, Arial, serif; text-decoration:none; border: 4px solid #e53238; color: white; font-size: larger\'';
const EBAY_URL = 'https://www.ebay.ca/sch/i.html?_nkw=';
$(document).ready(function () {
    $('#run-course').click(function () {
        window.location.href = 'index.html?course_code:"' + $('#course-books').val() + '"'
    });

    $('#run-isbn').click(function () {
        window.location.href = 'index.html?isbn:"' + $('#isbn-books').val() + '"'
    });

    let url = window.location.href;
    let params = url.split('?');
    if (params.length === 2) {
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
        let courses ="";
        item.courses.forEach(function (course) {
            courses += " " + course.code;
        });
        let title = "<h3><b>" + item.title + "</b>  " + item.author + "<span style='float: right'>ISBN:" + item.isbn + "</span></h3>";
        let facebook = "<div style='float: right'><a"+ FB_STYLE+ " href="+ FB_URL + item.courses[0].code.substring(0, 6) + ">Search on Facebook" + "</a></div>";
        let ebay = "<div style='float: right'><a"+ EBAY_STYLE+ " href="+ EBAY_URL + item.isbn + ">Search on Ebay" + "</a></div>";
        let amazon = "<div style='float: right'><a"+ AMZN_STYLE+ " href="+ AMZN_URL + item.isbn + ">Search on Amazon" + "</a></div>";
        let external = facebook + "<br/><br/>" + amazon + "<br/><br/>" + ebay;
        let image = "<img style='max-height: 300px; float: left; width: 18%' src='" + item.image + "'>";
        let bookstore = "<b>UofT Bookstore Price:</b> $" + item.price;
        let content = "<div style='float: right; width: 80%'>" + bookstore + external + "</div>";
        $('#accordion').append(title + "<div>" + image + content + "</div>")
    });
    $('#accordion').accordion("refresh");
}