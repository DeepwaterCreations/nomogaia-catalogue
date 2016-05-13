RecentFiles = function () {
}

RecentFiles.private = {}
var pathLib = require('path');
RecentFiles.private.currentAddress = pathLib.dirname(process.execPath);
RecentFiles.private.currentName = "untitled"

RecentFiles.get = function () {
    var recentFiles = localStorage.getItem("recentFiles");
    if (recentFiles == undefined || recentFiles == "") {
        recentFiles = [];
        localStorage.setItem("recentFiles", JSON.stringify(recentFiles));
    } else {
        recentFiles = JSON.parse(localStorage.getItem("recentFiles"));
    }
    console.log("", recentFiles);
    return recentFiles;
}

RecentFiles.push = function (path) {
    // remove all files with a matching name from the list and autosave with the same file name
    var recentFiles = JSON.parse(localStorage.getItem("recentFiles"));
    for (var i = 0; i < recentFiles.length; ) {
        if (RecentFiles.getAddress(recentFiles[i].path) == RecentFiles.getAddress(path) && (
           RecentFiles.getName(recentFiles[i].path) == RecentFiles.getName(path) ||
            RecentFiles.getName(recentFiles[i].path) == RecentFiles.getName(path) + "-autosave"
            )) {
            recentFiles.splice(i, 1);
        } else {
            i++
        }
    }
    recentFiles.unshift(
        {
            path: path,
            name: RecentFiles.getName(path)
        }
    );
    RecentFiles.private.currentAddress = RecentFiles.getAddress(path);
    RecentFiles.setCurrentFileName(RecentFiles.getName(path));
    localStorage.setItem("recentFiles", JSON.stringify(recentFiles));
}

RecentFiles.getName = function(path) {
    var filename = path.replace(/^.*[\\\/]/, '');
    filename = filename.substr(0, filename.indexOf("."));
    return filename;
}

// return just the address and not the file name
RecentFiles.getAddress = function (path) {
    var filename = path.replace(/^.*[\\\/]/, '');
    var address = path.substr(0, path.indexOf(filename));
    return address;
}

RecentFiles.getCurrentFileAddress = function () {
    return RecentFiles.private.currentAddress;
}

RecentFiles.getCurrentFileName = function () {
    return RecentFiles.private.currentName;
}
// we don't want the name to include -autosave
RecentFiles.setCurrentFileName = function (name) {
    if (name.endsWith("-autosave")) {
        name = name.substr(0, name.indexOf("-autosave"));
    }
    RecentFiles.private.currentName = name;
}

RecentFiles.getAutoSaveName = function () {
    return pathLib.join(RecentFiles.private.currentAddress, RecentFiles.private.currentName + "-autosave.json")
}