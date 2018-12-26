$(document).ready(function () {
    let queryDict = {};
    location.search.substr(1).split("&").forEach(function(item) {queryDict[item.split("=")[0]] = item.split("=")[1]});

    if(/[a-zA-Z]{3}\+?[1-4a-dA-D][0-9]{2}/.test(queryDict["oq"])){
        getInfo(queryDict["oq"].replace("+", ""));
    }
});

function getInfo(code) {
    $.ajax({
        url: "https://cobalt.qas.im/api/1.0/courses/filter?q=code:%22" + code + "%22&key=bolBkU4DDtKmXbbr4j5b0m814s3RCcBm&limit=30",
        success: function (response) {
            if(response.length > 0) {
                $(".card-section").parent().remove();

                let boot = document.createElement("div");
                boot.className = "bootstrapiso";

                let card = createCard(code, response[0]);
                boot.append(card);

                $("#topstuff").append(boot);
            }
        }
    });
    // return res;


}

function createHeader(code, name, department) {
    let header = document.createElement("div");
    header.className = "card-header";
    // header.setAttribute("style", "background: navy;");

    let card_title = document.createElement("h5");
    card_title.className = "card-title";
    card_title.innerText = code.toUpperCase() + ": " + name;

    let subtitle = document.createElement("h6");
    subtitle.className = "card-subtitle mb-2 text-muted";
    subtitle.innerText = department;

    let nav = document.createElement("ul");
    nav.className = "nav nav-tabs card-header-tabs pull-right";
    nav.setAttribute("role", "tablist");

    let first = true;
    ["Overview", "Requirements", "Instructors", "Offerings"].forEach(function (name) {
       let row = document.createElement("li");
       row.className = "nav-item";

       let link = document.createElement("a");
       link.innerText = name;
       let link_class = "nav-link";
       if(first) link_class += " active";
       link.className = link_class;
       link.setAttribute("id", name.toLowerCase() + "-tab");
       link.setAttribute("data-toggle", "tab");
       link.setAttribute("href", "#" + name.toLowerCase());
       link.setAttribute("role", "tab");
       link.setAttribute("aria-controls", name.toLowerCase());
       link.setAttribute("aria-selected", first.toString());
       first = false;
       row.append(link);
       nav.append(row);

    });
    header.append(card_title);
    header.append(subtitle);
    header.append(nav);
    return header;
}


function createCard(code, info) {
    let card = document.createElement("div");
    card.className = "card";
    card.setAttribute("style", "margin-bottom: 15px;");

    let body = document.createElement("div");
    body.className = "card-body";

    let description = document.createElement("p");
    description.className = "card-text";
    description.innerText = info.description;

    let prerequisites = document.createElement("p");
    prerequisites.className = "card-text";
    prerequisites.innerText = "Prerequisites: " + info.prerequisites;

    let exclusions = document.createElement("p");
    exclusions.className = "card-text";
    exclusions.innerText = "Exclusions: "+ info.exclusions;

    let extension_label = document.createElement("div");
    extension_label.className = "card-footer";

    let extension_text = document.createElement("small");
    extension_text.className = "text-muted";
    extension_text.innerText = "Provided by UofT Course Info Extension. Not affiliated with University of Toronto or Google.";

    let textbooks = document.createElement("a");
    textbooks.className = "btn btn-primary";
    textbooks.setAttribute("href", "http://murad-akh.ca/uoftbooks/cinfo/index.html?filter?q=course_code:%22" + code + "%22");
    textbooks.innerText = "View Textbooks";

    let exams = document.createElement("a");
    exams.className = "btn btn-primary";
    exams.setAttribute("style", "margin-left: 10px;");
    exams.setAttribute("href", "https://exams-library-utoronto-ca.myaccess.library.utoronto.ca/simple-search?location=%2F&query=" + code );
    exams.innerText = "View Exams";


    body.append(description);
    body.append(prerequisites);
    body.append(exclusions);
    body.append(textbooks);
    body.append(exams);
    card.append(createHeader(code, info.name, info.department));
    card.append(body);
    card.append(extension_label);
    extension_label.append(extension_text);
    return card;

}