'use-strict';
/*Licensed under MIT  LICENSE
 *
 * Murad Akhundov 2017
 */
$(document).ready(generateTooltips);

/** Generate Tooltips for previously labeled course codes
 *
 */
function generateTooltips() {
    // let S_SIZE;
    let S_LINK;
    let S_BREADTH;
    let S_PREEXL;
    let S_INST;
    let S_OFFR;
    let S_MAXT;
    let S_DESRPT;

    let fetched = new Set();
    let directory;
    let num = ($(".corInf").length);

    fetchStoredData()
        .then(requestForTooltips)
        .catch(error => {
            if (!error instanceof TooManyCoursesError) {
                console.error(error)
            }
        });

    /** Fetches Stored information. Directory and settings.
     */
    async function fetchStoredData() {
        let dirpromise = await fetch(
            chrome.runtime.getURL("/../../data/directory.json")
        );
        directory = await dirpromise.json();
        await getSettings();
        if (num > S_MAXT) {
            handleTooManyCourses();
            throw new (class TooManyCoursesError extends Error {
            });
        }
    }


    function getSettings() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get({
                // size: 'medium',
                link: 'website',
                breadths: true,
                prereq: true,
                inst: true,
                sess: true,
                descript: true,
                maxtt: 300

            }, items => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError.message);
                } else {
                    S_LINK = items.link;
                    S_BREADTH = items.breadths;
                    S_PREEXL = items.prereq;
                    S_OFFR = items.sess;
                    S_MAXT = items.maxtt;
                    S_INST = items.inst;
                    S_DESRPT = items.descript;
                    resolve();
                }
            });
        });
    }


    /** Get information from cobalt, load when done.
     *
     * @param code
     */
    function getInfo(code) {
        $.ajax({
            url: "https://cobalt.qas.im/api/1.0/courses/filter",
            data: {
                q: 'code:"' + code + '"',
                key: "bolBkU4DDtKmXbbr4j5b0m814s3RCcBm",
                limit: 30
            },
            error: (XMLHttpRequest, textStatus, errorThrown) => {
                console.error("Status: " + textStatus);
                console.error("Error: " + errorThrown);
            },
            success: response => {
                fetched.add(code);
                load(code, response)
            }
        });
        // return res;


    }

    function getDepartment(key) {
        if (S_LINK === "artsci") {
            key = key.replace(/ /g, "-");
            return "https://fas.calendar.utoronto.ca/section/" + key;
        } else {

            for (let i = 0; i < directory.length; i++) {
                let name = directory[i].name.toString().toUpperCase();
                key = key.toUpperCase();
                if (name.startsWith(key)) {
                    return directory[i].url;
                }
            }
            return "https://www.utoronto.ca/a-to-z-directory";
        }

    }


    function getOffers(sessions) {
        return "<b>UTSG:</b> " + sessionToLinks(sessions.utsg)
            + "<br /><b>UTM:</b> " + sessionToLinks(sessions.utm)
            + "<br /><b>UTSC:</b> " + sessionToLinks(sessions.utsc);
    }

    function getProfs(profs) {
        return "<b>Instructors:</b> " + profs.join(", ");

    }

    /** extract the details: breadths, prereqs, exclusions
     *
     * @param info
     * @returns {string}
     */
    function getDetails(info) {
        let breadths = info[0].breadths;
        if (breadths.length === 0) {
            breadths = "N/A"
        }

        let output = "";
        if (S_PREEXL) {
            output +=
                "<b>Prerequisites:</b>" + info[0].prerequisites + "<br />" +
                "<b>Exclusions:</b> " + info[0].exclusions+ "<br />";
        }
        if (S_BREADTH) {
            output = output + "<b>Breadths:</b> " + breadths + "<br />"
        }
        return output

    }

    /** Get the title bar string
     *
     * @param info
     * @returns {string}
     */
    function getTitle(info) {
        let dept = getDepartment(info[0].department);
        let deptlink = document.createElement("a");
        deptlink.setAttribute('href', dept);
        deptlink.className = 'card-link';
        deptlink.setAttribute('style', 'margin-left: 10px; float: right; color: lightgray; text-decoration: underline');
        deptlink.innerHTML = '<b>' + info[0].department + '</b>';


        return "" + info[0].name + deptlink.outerHTML;

    }

    /** Request each course code from cobalt
     *  If previously requested, return it from the hashmap
     */
    function requestForTooltips() {
        $('.corInf').each(function () {
            let title = $(this).data('title');
            if (!fetched.has(title)) {
                getInfo(title)
            }
        })
    }

    /** Load each tooltip as cobalt responds
     *  called asynchronously
     *
     * @param code a course code (original fetch)
     * @param info array fetched from cobalt
     */
    function load(code, info) {
        $('.' + code).each(function () {
            try {
                let a = info[0].name;
            } catch (err) {
                $(this).replaceWith($(this).data('title'));
            }
            tippy("." + this.id, {
                content: buildPopover(code, info),
                arrow: true,
                arrowType: 'wide',
                distance: 0,
                size: 'small',
                theme: 'light',
                interactive: 'true',
                maxWidth: 700
            })


        });
    }


    function handleTooManyCourses() {
        $(".corInf").each(function () {
            $(this).replaceWith($(this).data('title'));

        });
        let warning = localStorage.warning || "true";
        if (warning === "true") {
            let show = confirm("UofT Course Info: did not load the tooltips, too many courses mentioned. " +
                "\n\n" +
                "The current limit is " + S_MAXT + ", you can now change it in the settings" +
                "\n\n Click 'Cancel' to never see this popup again");
            localStorage.warning = show.toString();
        }
    }

    /** Builds a tooltip/popover card with all the info
     *
     * @param code original course code
     * @param info array of fetched courses from cobalt
     * @returns {string} popover card HTML
     */
    function buildPopover(code, info) {

        let crawled = crawlOfferings(info);

        let slink = document.createElement("a");
        slink.setAttribute("href", getSettingsUrl());
        slink.className = 'font-weight-bold';
        slink.setAttribute('style', 'margin-left: 10px;');
        slink.innerText = "Configure Extension";

        let tlink = document.createElement("a");
        tlink.className = 'font-weight-bold';
        tlink.setAttribute("href", getTextbookUrl(code));
        tlink.innerText = code.toUpperCase() + " Textbooks";

        let main = document.createElement("div");
        main.className = "bootstrapiso";

        let card = document.createElement("div");
        card.className = "card";

        let body = document.createElement("div");
        body.className = "card-body";

        let description = document.createElement("p");
        description.className = "card-text";
        description.innerText = info[0].description;

        let details = document.createElement("p");
        details.className = "card-text";
        details.innerHTML = getDetails(info);

        let offerings = document.createElement("p");
        offerings.className = "card-text";
        offerings.innerHTML = getOffers(crawled.sessions);

        let extralinks = document.createElement("span");
        extralinks.setAttribute('style', 'float: right; margin-left: 10px;');
        extralinks.innerHTML = tlink.outerHTML + "  " + slink.outerHTML;

        let lastline = document.createElement("p");
        lastline.className = "card-text";
        if (S_INST) lastline.innerHTML = getProfs(crawled.profs.all);
        lastline.append(extralinks);

        let heading = document.createElement("div");
        heading.className = "card-header bg-primary text-white";

        let card_title = document.createElement("h6");
        card_title.className = "card-text";
        card_title.innerHTML = code.toUpperCase() + ": " + getTitle(info);

        card.append(heading);
        card.append(body);
        heading.append(card_title);
        if (S_DESRPT) body.append(description);
        if (S_BREADTH || S_PREEXL) body.append(details);
        if (S_OFFR) body.append(offerings);
        body.append(lastline);
        main.append(card);

        return main.outerHTML;
    }
}