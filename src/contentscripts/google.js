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
                $(".card-section").remove();

                let boot = document.createElement("div");
                boot.className = "bootstrapiso";

                let card = createCard(code, response[0]);
                boot.append(card);

                $("#topstuff").append(boot);
                $("#topstuff").append('<br/>');
            }
        }
    });
    // return res;


}


function createCard(code, info) {
    let card = document.createElement("div");
    card.className = "card";

    let card_body = document.createElement("div");
    card_body.className = "card-body";

    let card_title = document.createElement("h5");
    card_title.className = "card-title";
    card_title.innerText = code.toUpperCase() + ": " + info.name;

    let subtitle = document.createElement("h6");
    subtitle.className = "card-subtitle mb-2 text-muted";
    subtitle.innerText = info.department;

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
    extension_text.innerText = "Provided by UofT Course Info Extension. Not affiliated with University of Toronto or Google";

    let textbooks = document.createElement("a");
    textbooks.className = "btn btn-primary";
    textbooks.setAttribute("href", "http://murad-akh.ca/uoftbooks/cinfo/index.html?filter?q=course_code:%22" + code + "%22");
    textbooks.innerText = "View Textbooks";

    let exams = document.createElement("a");
    exams.className = "btn btn-primary";
    exams.setAttribute("style", "margin-left: 10px;");
    exams.setAttribute("href", "https://exams-library-utoronto-ca.myaccess.library.utoronto.ca/simple-search?location=%2F&query=" + code );
    exams.innerText = "View Exams";



    card_body.append(card_title);
    card_body.append(subtitle);
    card_body.append(description);
    card_body.append(prerequisites);
    card_body.append(exclusions);
    card_body.append(textbooks);
    card_body.append(exams);
    card.append(card_body);
    card.append(extension_label);
    extension_label.append(extension_text);
    return card;

}