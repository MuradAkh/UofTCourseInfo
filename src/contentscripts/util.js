function upToDate(str) {
    let curr = new Date().getFullYear();
    let prev = curr - 1;
    let next = curr + 1;
    return (str.includes(curr) || str.includes(prev) || str.includes(next))

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

function getTextbookUrl(code) {
    if (navigator.userAgent.search("Firefox") > -1) {
        return 'http://murad-akh.ca/uoftbooks/index.html?filter?q=course_code:%22' + code + '%22';
    } else {
        return 'http://murad-akh.ca/uoftbooks/cinfo/index.html?filter?q=course_code:%22' + code + '%22';
    }
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
            let b = meets[j].instructors;
            curr_profs = curr_profs.concat(b);
        }
        profs.all = profs.all.concat(curr_profs);

        let campus = info[i].campus;
        if (campus === "UTSG") {
            sessions.utsg.push({id: info[i].id, term: info[i].term});
            profs.utsg = profs.utsg.concat(profs);
        } else if (campus === 'UTSC') {
            sessions.utsc.push({id: info[i].id, term: info[i].term});
            profs.utsc = profs.utsc.concat(profs);
        } else if (campus === 'UTM') {
            sessions.utm.push({id: info[i].id, term: info[i].term});
            profs.utm = profs.utm.concat(profs);
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