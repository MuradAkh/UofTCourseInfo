/*Licensed under MIT  LICENSE
 * 
 * Murad Akhundov 2017
 */
$(document).ready(function () {

    function getTitle(code) {
        var res = "error";
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var myArr = JSON.parse(this.responseText);
                console.log(myArr);
                res = myArr;
            }
        };
        xmlhttp.open("GET", "https://cobalt.qas.im/api/1.0/courses/filter?q=code:%22" + code + "%22&key=bolBkU4DDtKmXbbr4j5b0m814s3RCcBm&limit=1", false);
        xmlhttp.send();

        return res;


    }

    function getDepartment(key) {
        key = key.replace(/ /g, "-");
        key = "https://fas.calendar.utoronto.ca/section/" + key;
        return key;

    }

    $('.corInf').each(function () {
        var info = getTitle($(this).data('title'));
        try {
            var a = info[0].name;
        } catch (err) {
            $(this).replaceWith($(this).data('title'));
        }

        Tipped.create("." + this.id, function (element) {

            return {
                title: "" + info[0].name + "   [" + '<a href=' + getDepartment(info[0].department) + '>' + info[0].department + '</a>' + "]"
                ,
                content: (info[0].description + "<br /><br />" + " <b>Prerequisites:</b> " + info[0].prerequisites
                    + "<br /><b>Exclusions:</b> " + info[0].exclusions
                    + "<br /><b>Breadths:</b> " + info[0].breadths +
                    "<b><p align=\"right\"><a href='https://chrome.google.com/webstore/detail/uoft-course-info/jcbiiafabmhjeiepopiiajnkjhcdieme?hl=en'>" +
                    "UofT Course Info 2.0</a></p></b>")

            };
        }, {
            skin: 'light',
            size: 'x-small',
            maxWidth: 800,
            background: '#1a0f9e'
        });


    });

});