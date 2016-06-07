SaveLoad = function () {
}

var fs = require('fs');
var gui = require('nw.gui');
var path = require('path');
require('events').EventEmitter;

//Check if we have an existing filename to save to.
//If so, save directly. Otherwise, call saveAs.
SaveLoad.checkSave = function(){
    filename = RecentFiles.getPath();
    if (filename) {
        //If we already have a filename, save to the existing file.
        SaveLoad.save(filename, function (error) {
            if (error)
                console.log("ERROR: ", error);
            else {
                RecentFiles.setClean();
                console.log("Finished saving");
            }
        });
    }
    else {
        //Otherwise, open the dialog to select a new filename.
        SaveLoad.saveAs();
    }
};

//Enabling ctrl-s to save
var keyboardCommand = new gui.Shortcut({
    key: "Ctrl+S",
    active: SaveLoad.checkSave
});
gui.App.registerGlobalHotKey(keyboardCommand);

//We need to bind and unbind the shortcut when the window loses and gains focus, otherwise
//we'll steal Ctrl-S from other programs!
var win = gui.Window.get();
win.on('focus', function () {
    gui.App.registerGlobalHotKey(keyboardCommand);
});
win.on('blur', function () {
    gui.App.unregisterGlobalHotKey(keyboardCommand);
});


//What we're basically doing with these is using the button's onClick to trigger the (hidden) file input's onClick. That way, we get the dialog but not the
//standard filepath-and-"choose-file"-button UI element from the file input. See https://github.com/nwjs/nw.js/wiki/File-dialogs
// $('#save').click(function () {
SaveLoad.saveAs = function(){
    var fileDialog = $("#saveFileDialog");
    fileDialog.on("change", function (event) {
        var filename = $(this).val();
        SaveLoad.save(filename, function (error) {
            if (error)
                console.log("ERROR: ", error);
            else {
                console.log("Finished saving");
            }
        });
    });
    fileDialog.trigger("click");
};


var forceLoad = false;
$('#load').click(function () {
    //First, warn the user about unsaved changes.
    if (RecentFiles.getIsDirty() && !forceLoad) {
        $("#loadConfirmationDialog").dialog({
            buttons: [
                {
                    text: "Cancel",
                    click: function () {
                        $(this).dialog("close");
                    }
                },
                {
                    text: "Load",
                    click: function () {
                        forceLoad = true;
                        $('#load').click();
                        $(this).dialog("close");
                    }
                }
            ]
        });
        $(".ui-dialog").find("button").addClass("blueButton");

        return; //We'll call this function again and bypass this condition if we want to load after all. 
    }

    forceLoad = false;
    var fileDialog = $("#loadFileDialog");
    fileDialog.on("change", function (event) {
        var filename = $(this).val();
        if (!filename) return; //Maybe the user didn't specify a value.


        SaveLoad.load(filename);

        $(this).val(""); //Reset the filepath so that the event will be called again.
    });

    fileDialog.trigger("click");
});

gui.Window.get().on('close', function () {
    var that = this;
    if (RecentFiles.getIsDirty() && !($("#splash").is(":visible"))) {
        $("#exitConfirmationDialog").dialog({
            buttons: [
                {
                    text: "Cancel",
                    click: function () {
                        $(this).dialog("close");
                    }
                },
                {
                    text: "Exit",
                    click: function () {
                        forceLoad = true;
                        $('#load').click();
                        $(this).dialog("close");
                        that.close(true);
                    }
                }
            ]
        });
        $(".ui-dialog").find("button").addClass("blueButton");
    } else {
        that.close(true);
    }
});


SaveLoad.autosave = function (interval) {
    window.setTimeout(function () {
        console.log("Autosave Triggered!");
        if (RecentFiles.getIsDirty()) {
            SaveLoad.save(RecentFiles.getAutoSaveName());
        }
        SaveLoad.autosave(interval);
    }, interval);
}

SaveLoad.save = function (filename, callback) {
    if (filename.toLowerCase().indexOf(".json") != -1) {
        var saveobj = {};
        saveobj.monitortables = monitorTables.toOut();
        saveobj.dataoptions = DataOptions.toOut();
        fs.writeFile(filename, JSON.stringify(saveobj), callback);
        RecentFiles.push(filename, false);
    } else if (filename.toLowerCase().indexOf(".csv") != -1) {
        var str = monitorTables.toCSV();
        fs.writeFile(filename, str, callback);
    } else {
        console.log("errror! save must be .json or .csv");
    }
}

// checks if the file exists and can be read/written
SaveLoad.checkFile = function (filename, onTrue, onFalse) {
    onTrue = onTrue || function () { };
    onFalse = onFalse || function () { };

    fs.access(filename, fs.R_OK | fs.W_OK, function (err) {
        if (!err) {
            onTrue();
        } else {
            onFalse();
        }
    });
}

SaveLoad.load = function (filename, callback) {
    //Make a loading bar dialog
    //$("#loadingBarDialog").dialog({
    //    dialogClass: "no-close",
    //    closeOnEscape: false,
    //    draggable: false,
    //    modal: true,
    //    resizable: false
    //});
    //$("#loadingBar").progressbar({
    //    value: false //It should be an indeterminate progress bar until a file is loaded.
    //});

    callback = callback || function () { }
    if (filename.toLowerCase().indexOf(".json") != -1) {
        fs.readFile(filename, function (error, chunk) {
            if (error) {
                console.out("ERROR: ", error);
                return;
            }

            //TODO: We need to test this thoroughly! I'm not convinced that this will work properly for all valid data inputs.
            var obj = jQuery.parseJSON(chunk);
            var barMax = 0;//obj.length * obj[obj.length - 1].backingData.length; //The number of monitors times the number of rows in the last monitor.
            for (var i = 0; i < obj.monitortables.monitors.length; i++) {
                barMax += obj.monitortables.monitors[i].backingData.length;
            }

            //$("#loadingBar").progressbar("option", "max", barMax);
            //$("#loadingBar").progressbar("value", 0);

            DataOptions.loadCustom(obj.dataoptions)
            monitorTables.loadFile(obj.monitortables);
            //$("#loadingBarDialog").dialog("destroy");
            RecentFiles.push(filename, true);
            callback();
        });
    } else if (filename.toLowerCase().indexOf(".csv") != -1) {
        fs.readFile(filename, function (error, chunk) {
            if (error) {
                console.out("ERROR: ", error);
                return;
            }


            DataOptions.reset();
            monitorTables.loadCSV(chunk + "");
            RecentFiles.push(filename, true);
            callback();
        });
    } else {
        console.log("errror! load must be .json or .csv");
    }
    
   
}
