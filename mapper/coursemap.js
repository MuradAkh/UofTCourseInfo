let button = document.getElementById('run');
button.onclick = execute;

document.getElementById('courses').addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        document.getElementById('run').click();
    }
});

function execute() {
    let input = document.getElementById('courses').value;
    input = input.replace(/\s/g, '');
    let courses = input.split(',');
    let courseMap = [];

    courses.forEach(function (element) {
        addCourse(element)
    });


    function addCourse(element) {
        let response = getInfo(element, 0).concat(getInfo(element, 100));
        response = response.concat(getInfo(element, 200));
        let regexp = /[A-Z]{3}[0-9]{3}/gi ;
        response.forEach(function (course) {
                let code = course.code.substring(0, 6);
                let temp = courseMap[code];
            if (temp == null) {
                    courseMap[code] = {code: code, prereq_list: course.prerequisites.match(regexp),
                        prerequisites: course.prerequisites, exclusions: course.exclusions, name: course.name,
                        description: course.description}
                }
            }
        )


    }

    let allNodes = [];
    let allEdges = [];

    Object.keys(courseMap).forEach(function(key) {
        let val = courseMap[key];
        let colour = getColour(val.code);
        allNodes.push({id: val.code , label: val.code, color: colour});
        if(val.prereq_list != null) {
            val.prereq_list.forEach(function (element) {
                if(val.code !== element){
                    allEdges.push({to: val.code, from: element})
                }
            })
        }

    });

    function getColour(code){
        let level = code.charAt(3);
        switch (level){
            case '1':
                return '#d4f7c5';
            case '2':
                return '#f2f7c5';
            case '3':
                return '#f7e4c5';
            case '4':
                return'#cfc5f7';
        }
    }

    function getInfo(code, skip) {
        let res = "error";
        let xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
                res = JSON.parse(this.responseText);
            }
        };
        xmlhttp.open("GET", 'https://cors.io/?https://cobalt.qas.im/api/1.0/courses/filter?q=code:"' + code + '" AND campus:"UTSG"&key=bolBkU4DDtKmXbbr4j5b0m814s3RCcBm&limit=100&skip=' + skip, false);
        xmlhttp.send();

        return res;
    }

    let nodes = new vis.DataSet(allNodes);
    let edges = new vis.DataSet(allEdges);

// create a network
    let container = document.getElementById('mynetwork');

// provide the data in the vis format
    let data = {
        nodes: nodes,
        edges: edges
    };
    let options = {
        edges:{
            arrows: 'to',
            color: 'red',
            font: '12px arial #ff0000',
            scaling:{
                label: true
            },
            shadow: true,
            smooth: true
        },
        layout: {
            randomSeed: undefined,
            improvedLayout: true,
            hierarchical: {
                enabled: true,
                levelSeparation: 150,
                nodeSpacing: 200,
                treeSpacing: 50,
                blockShifting: true,
                edgeMinimization: true,
                parentCentralization: false,
                direction: 'LR',        // UD, DU, LR, RL
                sortMethod: 'hubsize'   // hubsize, directed
            }
        },
        physics: false
    };

// initialize your network!
    let network = new vis.Network(container, data, options);

    function displayInfo(course) {
        if(course == null){return}
        document.getElementById('title').innerHTML = course.name;
        document.getElementById('prerequisites').innerHTML = course.prerequisites;
        document.getElementById('exclusions').innerHTML = course.exclusions;
        document.getElementById('code').innerHTML = course.code;
        document.getElementById('description').innerHTML = course.description;


    }

    network.on("select", function (properties) {
        displayInfo(courseMap[properties.nodes[0]])

    })

};



