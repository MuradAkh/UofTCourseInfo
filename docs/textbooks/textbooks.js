const FB_URL = 'https://www.facebook.com/groups/183712131723915/for_sale_search/?forsalesearchtype=for_sale&availability=available&query=';
const AMZN_URL = 'https://www.amazon.ca/s/field-keywords=';
const EBAY_URL = 'https://www.ebay.ca/sch/i.html?_nkw=';
const GOOG_URL = 'https://www.google.com/search?tbm=bks&q=';

const cprovider = localStorage.provider !== undefined ? JSON.parse(localStorage.provider) : false;


$(document).ready(function () {

    document.getElementById('search-books').addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            handle();
        }
    });


    function handle() {
        let query = $('#search-books').val();
        if (/[0-9]{13}/.test(query)) {
            window.location.href = `index.html?filter?q=isbn:"${query}"`
        } else if (/\b[a-zA-Z]{3}([1-4]|\b)([0-9]|\b)([0-9]|\b)/.test(query)) {
            window.location.href = `index.html?filter?q=course_code:"${query}"`;
        } else {
            window.location.href = `index.html?search?q="${query}"`;

        }
    }

    let url = window.location.href;
    let params = url.split('?');
    if (params.length === 3) {
        let query = params[2].substring(params[2].indexOf('%') + 3, params[2].lastIndexOf('%'));
        displayBooks(fetcher(params[1] + '?' + params[2]), query);
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
    xmlhttp.open("GET", `http://cobalt.murad-akh.ca/api/1.0/textbooks/${query}&key=bolBkU4DDtKmXbbr4j5b0m814s3RCcBm&limit=100`, false);
    xmlhttp.send();
    return json;
}


function displayBooks(json, query) {

    if (json.length === 0) {
        $('#no_results').html('No results for <b>' + query + '</b>');
    }

    json.forEach(function (item) {
        let courses = "Courses:";
        item.courses.forEach(function (course) {
            courses += ` ${course.code}`;
        });

        // monstrosity
        let title = `<h3><b>${item.title}</b>  ${item.author}<span style='float: right'>ISBN:${item.isbn}</span></h3>`;
        let facebook = `<a class='btn-outline-primary btn' href=${FB_URL}${item.courses[0].code.substring(0, 6)}>Facebook</a>`;
        let ebay = `<a class='btn-outline-primary btn margined' href=${EBAY_URL}${item.isbn}>Ebay</a>`;
        let google = `<a class='btn-outline-primary btn margined' href=${GOOG_URL}${item.isbn}>Google Books</a>`;
        let amazon = `<a class='btn-outline-primary btn margined' href=${AMZN_URL}${item.isbn}>Amazon</a>`;
        let custom = '';
        if (cprovider) custom = `<a class='btn-outline-primary btn margined' href=${cprovider.providerUrl}${item.isbn}>${cprovider.providerNickName}</a>`;

        const addCustom = `<a href="" id="addCustom" class="card-link" href=${cprovider.providerUrl}${item.isbn}>Add/Change Custom Search Provider (Advanced)</a>`;

        let external = `</br></br>${facebook}${amazon}${ebay}${google}${custom}<br>${addCustom}`;
        let image = `<img class='pic' src='${item.image}'>`;
        let bookstore = '<b>UofT BookStore</b><br/>';
        bookstore += (`new: $${item.price}<br/>`);
        bookstore += `See the <a href="${item.url}">listing</a> for more information, including the price for a used item`;


        let content = `<div style='float: right; width: 80%'>${courses}<br/><br/>${bookstore}${addDbook(item.isbn)}${external}</div>`;
        $('#accordion').prepend(`${title}<div style='overflow: hidden'>${image}${content}</div>`)
    });
    $('#addCustom').click(addProvider);

    $('#accordion').accordion({
        collapsible: true,
        heightStyle: "content"
    });
}


function getDiscount() {
  let json = [];
  let xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
          json = JSON.parse(this.responseText);
      }
  };
  xmlhttp.open("GET", 'https://courseinfo.murad-akh.ca/textbooks/discounttb.json', false);
  xmlhttp.send();
  return json;
}

function addProvider(){
    const providerUrl = window.prompt("Enter ISBN search provider url, in format: www.exampleprovider.com/search?q= ");
    const providerNickName = window.prompt("Add a nickname");
    localStorage.provider = JSON.stringify({providerNickName, providerUrl});
}

function addDbook(isbn) {
    let discount = getDiscount();
    let output = '<b>Discount Textbooks Store</b><br/>';
    if (discount[isbn] == null) {
        output += 'Not found <br/>';
    } else {
        if (discount[isbn]['new'] !== 'N/A') {
            output += 'new: $' + discount[isbn]['new'] + '<br/>'

        } else
            output += '<br/>';
        if (discount[isbn]['used'] !== 'N/A') {
            output += 'used: $ ' + discount[isbn]['used']

        } else {
            output += '<br/>';

        }

    }

    return '<br/><br/>' + output + '<br/><a class="card-link" href="http://www.discounttextbookstoronto.com">Visit the website for more info</a>';
}
