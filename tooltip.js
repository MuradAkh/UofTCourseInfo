/*Licensed under MIT  LICENSE
 * 
 * Murad Akhundov 2017
 */
$(document).ready(function () {

    var data = [];
    var directory;
    function getTitle(code) {
        var res = "error";
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var myArr = JSON.parse(this.responseText);
                res = myArr;
            }
        };
        xmlhttp.open("GET", "https://cobalt.qas.im/api/1.0/courses/filter?q=code:%22" + code + "%22&key=bolBkU4DDtKmXbbr4j5b0m814s3RCcBm&limit=30", false);
        xmlhttp.send();

        data[code] = res;
        return res;


    }

    function getDirectory() {
        var dir;
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                var myArr = JSON.parse(this.responseText);
                dir = myArr;
            }
        };
        xmlhttp.open("GET", chrome.runtime.getURL("directory.json"), false);
        xmlhttp.send();
        return dir;
    }

    function getDepartment(key) {
        // console.log("ln" + directory.length);
        // key = key.replace(/ /g, "-");
        // key = "https://fas.calendar.utoronto.ca/section/" + key;
        for(i = 0; i < directory.length; i++){
            var name = directory[i].name.toString().toUpperCase();
            key = key.toUpperCase();
            if(name.startsWith(key)){
                console.log(directory[i].url);
                return directory[i].url;
            }
        }
        return "https://www.utoronto.ca/a-to-z-directory";

    }

    function upToDate(str) {
        return (str.includes("2018") || str.includes("2017 Fall"))

    }


    //taken from: https://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript
    function cleanArray(actual) {
        var newArray = new Array();
        for (var i = 0; i < actual.length; i++) {
            if (actual[i]) {
                newArray.push(actual[i]);
            }
        }
        return newArray;
    }

    Array.prototype.unique = function() {
        var a = [];
        for ( i = 0; i < this.length; i++ ) {
            var current = this[i];
            if (a.indexOf(current) < 0) a.push(current);
        }
        return a;
    };

    function getOffers(info) {
        var utsg = "", utsc = "", utm = "";
        var profs = [];
        for (i = 0; i < info.length; i++) {
            if (!upToDate(info[i].term)) {
                continue;
            }
            var link = "<a href='http://coursefinder.utoronto.ca/course-search/search/courseInquiry?methodToCall=start&viewId=CourseDetails-InquiryView&courseId="
                + info[i].id + "' >" + info[i].term + "</a>";

            var campus = info[i].campus;
            if (campus === "UTSG") {
                utsg = utsg + "&nbsp;" + link;
            }
            else if (campus === 'UTSC') {
                utsc = utsc + "&nbsp;" + link;
            }
            else if (campus === 'UTM') {
                utm = utm + "&nbsp;" + link;
            }

            var meets = info[i].meeting_sections;
            for (j = 0; j < meets.length; j++) {
                var b = meets[j].instructors;
                profs = profs.concat(b);
            }


        }

        if (utsg === "") {
            utsg = "Currently not offered"
        }
        if (utsc === "") {
            utsc = "Currently not offered"
        }
        if (utm === "") {
            utm = "Currently not offered"
        }

        profs = profs.unique();
        profs = cleanArray(profs);

        return "<b>UTSG:</b> " + utsg
            + "<br /><b>UTM:</b> " + utm
            + "<br /><b>UTSC:</b> " + utsc + "<br /><br /><b>Instructors:</b> " + profs.join(", ")

    }

    function load() {


        $('.corInf').each(function () {
            var title = $(this).data('title');

            var info = data[title];
            if(info == null){info = getTitle(title)}

            try {
                var a = info[0].name;
            } catch (err) {
                $(this).replaceWith($(this).data('title'));
            }

            Tipped.create("." + this.id, function (element) {
                var breadths = info[0].breadths;
                if (breadths.length === 0) {
                    breadths = "N/A"
                }
                var dept =  getDepartment(info[0].department);
                return {

                    title: "" + info[0].name + "   [" + '<a href="' + dept + '">' + info[0].department + '</a>' + "]"
                    ,
                    content: (info[0].description + "<br /><br />" + " <b>Prerequisites:</b> " + info[0].prerequisites
                        + "<br /><b>Exclusions:</b> " + info[0].exclusions
                        + "<br /><b>Breadths:</b> " + breadths + "<br /><br />" + getOffers(info) +
                        "<div style='float: right; text-align: right'>" +
                        "<b><a href='https://chrome.google.com/webstore/detail/uoft-course-info/jcbiiafabmhjeiepopiiajnkjhcdieme?hl=en'" +
                        " >" +
                        "UofT Course Info 2.0</a></b></div>")

                };
            }, {
                skin: 'light',
                size: 'x-small',
                maxWidth: 800,
                background: '#1a0f9e'
            });


        });
    }

    // console.log($(".corInf").length);
    if($(".corInf").length < 100){
        directory = getDirectory();
        load();
    }else{
        $(".corInf").each(function () {
            $(this).replaceWith($(this).data('title'));

        });
        alert("UofT Course Info: did not load the tooltips, too many courses mentioned. " +
            "\n\n" +
            "The current limit is 100, if you feel like it should be different, let me know in the webstore")
    }

});