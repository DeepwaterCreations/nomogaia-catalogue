var noDataHTML = '<div class="nodata"><span>No Data</span><h6>Add rights, rightsholders and scores to the rows in the catalogue</h4></div>';

function getTooltipForRow(row) {
    var tooltipContent = "";
    tooltipContent += '<p class="head"><b>Topic</b> "' + row.getData("Topic") + '" <b>contributes score:</b> <span class="score ' + getScoreCategoryClass(row.getData("Score")) +'">' + row.getData("Score") + '</p>';
    tooltipContent += '<p class="body">' + (row.getData("Input") || "<i>No input</i>") + '</p>';
    return tooltipContent;
}


//Rounding.
Number.prototype.decRound = function (places) {
    var dec = Math.pow(10,places);
    return Math.round(this.valueOf() * dec) / dec;
}

function getRowID(rightName) {
    var idString = "row" + rightName.stripNonAlphanumeric(); 
    return idString;
}

function getDataCellClass(rightName, rightsholderName) {
    var returnVal = {};
    returnVal.rowClass = "row" + rightName.stripNonAlphanumeric() + "Data";
    returnVal.colClass = "column" + rightsholderName.stripNonAlphanumeric() + "Data";
    return returnVal;
}

function toClassName(column) {
    return column.stripNonAlphanumeric();
}

//Call this when data has changed or when a new monitor is made visible.
function setVisualizationsDirty() {
    impactedRights_dirty = true;
    matrix.dirty = true;
}

//Returns true if there is a row for which the specified right/rightsholder is one of the data items.  
function rightHasEntries(rightName) {
    for (var i = 0; i < monitorTables.backingData.length; i++) {
        if (monitorTables.backingData[i].tableData.getRowsWithScore("Impacted Rights", rightName).length != 0) {
            return true;
        }
    }
    return false;
}

function rightsholderHasEntries(rightsholderName) {
    for (var i = 0; i < monitorTables.backingData.length; i++) {
        if (monitorTables.backingData[i].tableData.getRowsWithScore("Impacted Rights-Holders", rightsholderName).length != 0) {
            return true;
        }
    }
    return false;
}

function generateHTMLout(javascript, css, html) {
    console.log("javascript", javascript);
    console.log("css", css);
    console.log("html", html);
    return '<!DOCTYPE html><html lang="en" xmlns="http://www.w3.org/1999/xhtml"><head><meta charset="utf-8" />' + javascript + ''+css+'<title></title></head><body>' + html+'</body></html>';
}


function exportViewToHTML(fileDialog, HTMLbody){
    // var fileDialog = $("#export-matrix-dialog");
    if(fileDialog === undefined){
        throw "Error: No file dialog defined";
        return;
    }

    var HTMLbody = HTMLbody || ""; 
    var javascript = "";
    var css = "";

    // we have to read in the JS
    // this needs to include jQuery
    var filesToRead = [{
        name: "jquery/jquery-2.1.3.min.js",
        type: "JS",
        res: ""
    }, {
        name: "jquery-ui/jquery-ui.min.js",
        type: "JS",
        res: ""
    },  {
        name: "ExportableMatrixFunctions.js",
        type: "JS",
        res: ""
    }, {
        name: "ExportableOnStart.js",
        type: "JS",
        res: ""
    }, {
        name: "jquery-ui/jquery-ui.min.css",
        type: "CSS",
        res: ""
    }, {
        name: "pure-release-0.5.0/pure.css",
        type: "CSS",
        res: ""
    }, {
        name: "DataTable.css",
        type: "CSS",
        res: ""
    }, {
        name: "Colin.css",
        type: "CSS",
        res: ""
    }];

    var filename = "";

    var allDone = function () {
        var pass = filename !== "";

        for (var i = 0; i < filesToRead.length; i++) {
            pass = pass && filesToRead[i].res !== "";
        }

        console.log("allDone ", pass);

        if (pass) {

            filesToRead.forEach(function (obj) {
                if (obj.type === "JS") {
                    javascript += "<script>" + obj.res + "</script>\n";
                } else if (obj.type === "CSS") {
                    css += "<style>" + obj.res + "</style>\n";
                }
            });

            if (filename.toLowerCase().indexOf(".html") != -1) {
                var htmlDoc = generateHTMLout(javascript, css, HTMLbody);
                console.log(htmlDoc);
                fs.writeFile(filename, htmlDoc, function (res) {
                    console.log(res);
                });
            } else {
                console.log("errrror! save must be .html");
            }
        }
    }
    filesToRead.forEach(function (obj) {
        fs.readFile(obj.name, { encoding: 'utf8' }, function (error, chunk) {
            if (error) {
                console.log("ERROR: ", error);
                return;
            }

            // we have to clean the chunk if it starts with a bom we need to remove it
            if (chunk.charAt(0) === '\ufeff') {
                chunk = chunk.substring(1, chunk.length);
            }

            obj.res = chunk;
            allDone();
        });
    });

    fileDialog.on("change", function (event) {
        filename = $(this).val();
        allDone();
    });
    fileDialog.trigger("click");
};
