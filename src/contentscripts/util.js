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

function getTextbookUrl(code){
    if (navigator.userAgent.search("Firefox") > -1) {
        return 'http://murad-akh.ca/uoftbooks/index.html?filter?q=course_code:%22' + code + '%22';
    } else {
        return 'http://murad-akh.ca/uoftbooks/cinfo/index.html?filter?q=course_code:%22' + code + '%22';
    }
}

function crawlOfferings(info) {
    let utsg = "", utsc = "", utm = "";
    let profs = [];
    for (let i = 0; i < info.length; i++) {
        if (!upToDate(info[i].term)) {
            continue;
        }
        let link = document.createElement('a');
        link.setAttribute('href', 'http://coursefinder.utoronto.ca/course-search/search/courseInquiry?methodToCall=start&viewId=CourseDetails-InquiryView&courseId='
            + info[i].id);
        link.innerText = info[i].term + ';  ';

        let campus = info[i].campus;
        if (campus === "UTSG") {
            utsg += link.outerHTML;
        }
        else if (campus === 'UTSC') {
            utsc += link.outerHTML;
        }
        else if (campus === 'UTM') {
            utm += link.outerHTML;
        }

        let meets = info[i].meeting_sections;
        for (let j = 0; j < meets.length; j++) {
            let b = meets[j].instructors;
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

    return {profs: profs, utsg: utsg, utsc: utsc, utm: utm};
}





