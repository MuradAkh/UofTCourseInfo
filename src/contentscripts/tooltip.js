'use-strict';
/*Licensed under MIT  LICENSE
 * 
 * Murad Akhundov 2017
 */
$(document).ready(function () {
    generateTooltips();
});

function generateTooltips() {
    let size;
    let link;
    let brr;
    let prereq;
    let inst;
    let sess;
    let maxtt;
    let descript;

    let data = [];
    let directory;
    let num = ($(".corInf").length);

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
        link = items.link;
        brr = items.breadths;
        prereq = items.prereq;
        sess = items.sess;
        maxtt = items.maxtt;
        inst = items.inst;
        descript = items.descript;
        start();
    });


    function getInfo(code) {
        $.ajax({
            url: "https://cobalt.qas.im/api/1.0/courses/filter?q=code:%22" + code + "%22&key=bolBkU4DDtKmXbbr4j5b0m814s3RCcBm&limit=30",
            success: function (response) {
                data[code] = response;
                load(code, response)

            }
        });
        // return res;


    }

    function getDirectory() {
        let dir;
        const xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                dir = JSON.parse(this.responseText);
            }
        };
        xmlhttp.open("GET", chrome.runtime.getURL("../../data/directory.json"), false);
        xmlhttp.send();
        return dir;
    }

    function getDepartment(key) {
        if (link === "artsci") {
            key = key.replace(/ /g, "-");
            return "https://fas.calendar.utoronto.ca/section/" + key;
        } else {

            for (i = 0; i < directory.length; i++) {
                var name = directory[i].name.toString().toUpperCase();
                key = key.toUpperCase();
                if (name.startsWith(key)) {
                    return directory[i].url;
                }
            }
            return "https://www.utoronto.ca/a-to-z-directory";
        }

    }


    function getOffers(info) {
        var utsg = "", utsc = "", utm = "";
        var profs = [];
        for (i = 0; i < info.length; i++) {
            if (!upToDate(info[i].term)) {
                continue;
            }
            var link = "<a style='color: lightgrey' href='http://coursefinder.utoronto.ca/course-search/search/courseInquiry?methodToCall=start&viewId=CourseDetails-InquiryView&courseId="
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
        if (sess) {
            output = output + "<b>UTSG:</b> " + utsg
                + "<br /><b>UTM:</b> " + utm
                + "<br /><b>UTSC:</b> " + utsc;
        }
        if (inst) {
            output = output + "<br /><br /><b>Instructors:</b> " + profs.join(", ");

        }
        return output;

    }

    function getContent(info) {
        var breadths = info[0].breadths;
        if (breadths.length === 0) {
            breadths = "N/A"
        }

        let output = "";
        if (descript) {
            output = output + info[0].description + "<br /><br />";
        }
        if (prereq) {
            output = output + " <b>Prerequisites:</b> " + info[0].prerequisites
                + "<br /><b>Exclusions:</b> " + info[0].exclusions
                + "<br />";
        }
        if (brr) {
            output = output + "<b>Breadths:</b> " + breadths + "<br /><br />"
        }
        return output

    }


    function getTitle(info) {
        var dept = getDepartment(info[0].department);
        return "" + info[0].name + "   [" + '<a style=\'color: lightgrey\' href="' + dept + '">' + info[0].department + '</a>' + "]";

    }

    function cobaltCourses() {
        $('.corInf').each(function () {
            let title = $(this).data('title');
            let info = data[title];
            if (info == null) {
                getInfo(title)
            }
        })
    }

    function load(code, info) {
        $('.' + code).each(function () {
            // if(info == null){info = getInfo(title)}

            try {
                let a = info[0].name;
            } catch (err) {
                $(this).replaceWith($(this).data('title'));
            }

            Tipped.create("." + this.id, function (element) {

                return {
                    title: getTitle(info),
                    content: (getContent(info) + getOffers(info) +
                        "<div style='float: right; text-align: right'>" +
                        "<a target=\"_blank\" style='padding-right: 10px; color: lightgrey' href='http://murad-akh.ca/uoftbooks/cinfo/index.html?filter?q=course_code:%22" + code + "%22'>" + code + " Textbooks</a>" +
                        "<a target=\"_blank\" style='color: lightgrey' href='chrome-extension://jcbiiafabmhjeiepopiiajnkjhcdieme/src/settings/settings.html' \" +\n" +
                        "                        \" >Configure & Explore</a></div>")

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

        if (num < maxtt) {
            directory = getDirectory();
            cobaltCourses()
        } else {
            $(".corInf").each(function () {
                $(this).replaceWith($(this).data('title'));

            });
            let warning = localStorage.warning || "true";
            if (warning === "true") {
                var show = confirm("UofT Course Info: did not load the contentscripts, too many courses mentioned. " +
                    "\n\n" +
                    "The current limit is " + maxtt + ", you can now change it in the settings" +
                    "\n\n Click 'Cancel' to never see this popup again");
                localStorage.warning = show.toString();
            }


        }
    }
}