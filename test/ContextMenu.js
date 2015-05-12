var gui = require('nw.gui');
var context_menu = new gui.Menu();

context_menu.append(new gui.MenuItem({
    label: 'Cut',
    click: function () {
        console.log("Cut clicked!");
        document.execCommand("cut");
    }
}));
context_menu.append(new gui.MenuItem({
    label: 'Copy',
    click: function () {
        console.log("Copy clicked!");
        document.execCommand("copy");
    }
})); context_menu.append(new gui.MenuItem({
    label: 'Paste',
    click: function () {
        console.log("Totally pasted!");
        document.execCommand("paste");
    }
}));

$(document).on("contextmenu", function (event) {
    event.preventDefault();
    context_menu.popup(event.pageX, event.pageY);
    return false;
});