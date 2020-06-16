function upToDate(str) {
    let curr = new Date().getFullYear();
    let prev = curr - 1;
    let next = curr + 1;
    return (str.includes(curr) || str.includes(prev) || str.includes(next))

}

class TooManyCoursesError extends Error {
}

function fetchResource(url){
    return new Promise((resolve, reject)=>{
        chrome.runtime.sendMessage(
            {msg: "FETCH", url: url},
            response => {
                console.log(response)
                resolve(response.response)});
    })
}

function getInfo(code) {
    return fetchResource(`https://nikel.ml/api/courses/search?code=${code}`)
}



//taken from: https://stackoverflow.com/questions/281264/remove-empty-elements-from-an-array-in-javascript
function cleanArray(actual) {
    let newArray = [];
    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i]);
        }
    }
    return newArray;
}

Array.prototype.unique = function () {
    let a = [];
    for (let i = 0; i < this.length; i++) {
        let current = this[i];
        if (a.indexOf(current) < 0) a.push(current);
    }
    return a;
};

function getSettingsUrl() {
    return chrome.runtime.getURL(
        "src/settings/settings.html"
    )
}

function getAboutUrl() {
    return chrome.runtime.getURL(
        "src/about/index.html"
    )
}

function getTextbookUrl(code) {
    // if (navigator.userAgent.search("Firefox") > -1) {
    //     return 'http://courseinfo.murad-akh.ca/textbooks/index.html?filter?q=course_code:%22' + code + '%22';
    // } else {
        return 'http://courseinfo.murad-akh.ca/textbooks/index.html?filter?q=course_code:%22' + code + '%22';
    // }
}

function sessionToLinks(sessions) {
    let output = '';
    if (sessions.length === 0) return "Currently not Offered";
    sessions.forEach((offering) => {
            let link = document.createElement('a');
            link.setAttribute('href', 'http://coursefinder.utoronto.ca/course-search/search/courseInquiry?methodToCall=start&viewId=CourseDetails-InquiryView&courseId='
                + offering.id);
            link.innerText = offering.term + ';  ';
            output += link.outerHTML;
        }
    );

    return output;
}

function crawlOfferings(info) {

    let profs = {
        all: [],
        utsg: [],
        utsc: [],
        utm: []
    };
    let sessions = {
        utsg: [],
        utsc: [],
        utm: []
    };

    for (let i = 0; i < info.length; i++) {
        if (!upToDate(info[i].term)) {
            continue;
        }

        let meets = info[i].meeting_sections;
        let curr_profs = [];
        for (let j = 0; j < meets.length; j++) {
            let instructors = meets[j].instructors;
            instructors.forEach(prof => {
                let inst_listing = prof.split(" ");
                for (let k = 0; k < inst_listing.length; k += 2) {
                    curr_profs.push(inst_listing[k] + " " + inst_listing[k + 1]);
                }
            });
        }
        profs.all = profs.all.concat(curr_profs);

        let campus = info[i].campus;
        if (campus === "St. George") {
            sessions.utsg.push({id: info[i].id, term: info[i].term});
            profs.utsg = profs.utsg.concat(curr_profs);
        } else if (campus === "Scarborough") {
            sessions.utsc.push({id: info[i].id, term: info[i].term});
            profs.utsc = profs.utsc.concat(curr_profs);
        } else if (campus === "Mississauga") {
            sessions.utm.push({id: info[i].id, term: info[i].term});
            profs.utm = profs.utm.concat(curr_profs);
        }
    }

    $.each(profs, (index, value) => {
        profs[index] = value.unique();
        profs[index] = cleanArray(profs[index]);
    });

    return {
        profs: profs,
        sessions: sessions
    }
}
