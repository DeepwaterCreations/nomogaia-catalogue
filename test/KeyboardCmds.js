var keyboardCmds = function(){
    var gui = require('nw.gui');
    require('events').EventEmitter;

    //Enabling ctrl-s to save
    var keyboardCommand = new gui.Shortcut({
        key: "Ctrl+S",
        active: function () {
            filename = FilenameRememberer.getFilename();
            if (filename) {
                //If we already have a filename, save to the existing file.
                save(filename, function (error) {
                    if (error)
                        console.log("ERROR: ", error);
                    else {
                        FilenameRememberer.setClean();
                        console.log("Finished saving");
                    }
                });
            }
            else {
                //Otherwise, open the dialog to select a new filename.
                $('#save').click();
            }
        }
    });
    gui.App.registerGlobalHotKey(keyboardCommand);

    //We need to bind and unbind the shortcut when the window loses and gains focus, otherwise
    //we'll steal Ctrl-S from other programs!
    var win = gui.Window.get();
    win.on('focus', function(){
        gui.App.registerGlobalHotKey(keyboardCommand);
    });
    win.on('blur', function () {
        gui.App.unregisterGlobalHotKey(keyboardCommand);
    });
};
