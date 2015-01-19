function colinMain() {
    console.log("testing 1,2,3");

    var rightsHolders = ["colin", "chris", "poulami"]
    //[{ id: 'enhancement', text: 'enhancement' }, { id: 'bug', text: 'bug' }
    //               , { id: 'duplicate', text: 'duplicate' }, { id: 'invalid', text: 'invalid' }
    //              , { id: 'wontfix', text: 'wontfix' }];

    var select2 = $(".rightsHolders").select2({
        data: rightsHolders,
        tags: true,
        //Allow manually entered text in drop down. 
        createSearchChoice: function (term, data) {
            console.log(term + " , " + data);
            if ($(data).filter(function () {
              return this.text.localeCompare(term) === 0;
            }).length === 0) {
                return { id: term, text: term };
            }
        }
    });

    function isInt(n) {
        return (typeof n == 'number' && n % 1 === 0);
    }

    $(".rightsHolders").on("select2:select", function (e) {
        console.log(e);
        console.log(this);
        console.log(e.currentTarget.value);
        //todo remove the old one
        var list = $(this).find('Option');
        for (var option in list) {
            if (isInt(parseInt(option))) {
                var value = list[option].value;
                if (rightsHolders.indexOf(value) == -1) {
                    // add to list
                    rightsHolders.push(value);
                    // make the new one stick around
                    $(this).find('option[value="' + value + '"]').removeAttr('data-select2-tag');
                    //console.log(list[option].attr('data-select2-tag'));
                    //list[option].removeAttr('data-select2-tag');
                    //$('.html-multi-chosen-select').remove(list[option]);
                    //$('.rightsHolders option[value=' + value + ']').remove();

                    var rightsHoldersSelectList = $('.rightsHolders');
                    console.log(rightsHoldersSelectList);
                    for (var i = 0; i < rightsHoldersSelectList.length; i++) {
                        var rightsHoldersSelect = rightsHoldersSelectList[i];
                        if (rightsHoldersSelect != $(this)[0]) {
                            console.log(rightsHoldersSelect);
                            //rightsHoldersSelect.append('<option value=' + value + '>' + value + '</option>');
                        }
                    }
                }
            }
        }
        //$('.html-multi-chosen-select').append('<option value=' + e.currentTarget.value + '>' + e.currentTarget.value + '</option>');
    });

    //$('.html-multi-chosen-select').chosen({ width: "210px" });

    $('#yoyo').click(function () {
        console.log(rightsHolders);
    });


    //$('.html-multi-chosen-select').select2('data').text

    //sampleArray.push({ id: 5, text: 'test' });
}