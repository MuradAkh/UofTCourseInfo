/*Licensed under MIT  LICENSE
 * 
 * Murad Akhundov 2017
 */
$(document).ready(function () {

    var size;
    var link;
    var brr;
    var prereq ;
    var inst ;
    var sess ;
    var maxtt;
    var descript;

    chrome.storage.local.get({
        size: 'medium',
        link: 'website',
        breadths: true,
        prereq: true,
        inst: true,
        sess: true,
        descript: true,
        maxtt: 300

    }, function (items) {
        size = items.size;
        console.log(size + "sy");
        link = items.link;
        brr = items.breadths;
        prereq = items.prereq;
        sess = items.sess;
        maxtt = items.maxtt;
        inst = items.inst;
        descript = items.descript;
        start();
    });


    var data = [];
    var directory;
    function getInfo(code) {
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
                dir = JSON.parse(this.responseText);
            }
        };
        xmlhttp.open("GET", chrome.runtime.getURL("directory.json"), false);
        xmlhttp.send();
        return dir;
    }

    function getDepartment(key) {
        if(link === "artsci") {
            console.log("ln" + directory.length);
            key = key.replace(/ /g, "-");
            return "https://fas.calendar.utoronto.ca/section/" + key;
        }else {

            for (i = 0; i < directory.length; i++) {
                var name = directory[i].name.toString().toUpperCase();
                key = key.toUpperCase();
                if (name.startsWith(key)) {
                    console.log(directory[i].url);
                    return directory[i].url;
                }
            }
            return "https://www.utoronto.ca/a-to-z-directory";
        }

    }

    function upToDate(str) {
        return (str.includes("2018") || str.includes("2017 Fall"))

    }


    //taken from: https://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript
    function cleanArray(actual) {
        var newArray = [];
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

        var output = "";
        if(sess){
            output = output + "<b>UTSG:</b> " + utsg
                + "<br /><b>UTM:</b> " + utm
                + "<br /><b>UTSC:</b> " + utsc;
        }
        if(inst){
            output = output + "<br /><br /><b>Instructors:</b> " + profs.join(", ");

        }
        return output;

    }

    function getContent(info){
        var breadths = info[0].breadths;
        if (breadths.length === 0) {
            breadths = "N/A"
        }

        output = "";
        if(descript){
            output = output + info[0].description + "<br /><br />";
        }
        if(prereq){
            output = output + " <b>Prerequisites:</b> " + info[0].prerequisites
                + "<br /><b>Exclusions:</b> " + info[0].exclusions
                + "<br />";
        }
        if(brr){
            output = output +"<b>Breadths:</b> " + breadths + "<br /><br />"
        }
        return   output

    }


    function getTitle(info) {
        var dept =  getDepartment(info[0].department);
        return "" + info[0].name + "   [" + '<a href="' + dept + '">' + info[0].department + '</a>' + "]";

    }

    function load() {


        $('.corInf').each(function () {
            var title = $(this).data('title');


            var info = data[title];
            if(info == null){info = getInfo(title)}

            try {
                var a = info[0].name;
            } catch (err) {
                $(this).replaceWith($(this).data('title'));
            }

            Tipped.create("." + this.id, function (element) {

                return {


                    title: getTitle(info),

                    content: (getContent(info) + getOffers(info) +
                        "<div style='float: right; text-align: right'>" +
                        "<a href='chrome-extension://jcbiiafabmhjeiepopiiajnkjhcdieme/settings.html' " +
                        " >" +
                        "Configure & Explore</a></div>")

                };
            }, {
                skin: 'light',
                size: size,
                maxWidth: 800,
                background: '#1a0f9e'
            });


        });
    }

    function start() {

        var len = ($(".corInf").length);
        if (len < maxtt) {
            directory = getDirectory();
            load();
        } else {
            console.log("UOFTCINFO  tags n " + len);
            $(".corInf").each(function () {
                $(this).replaceWith($(this).data('title'));

            });
            var warning = localStorage.warning || "true";
            console.log(warning);
            if (warning === "true") {
                var show = confirm("UofT Course Info: did not load the tooltips, too many courses mentioned. " +
                    "\n\n" +
                    "The current limit is " + maxtt + ", you can now change it in the settings" +
                    "\n\n Click 'Cancel' to never see this popup again");
                localStorage.warning = show.toString();
            }


        }
    }

});