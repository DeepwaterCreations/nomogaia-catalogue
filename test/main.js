$(document).ready(function () {
    console.log("testing 1,2,3");

    var sampleArray = [{ id: 0, text: 'enhancement' }, { id: 1, text: 'bug' }
                       , { id: 2, text: 'duplicate' }, { id: 3, text: 'invalid' }
                       , { id: 4, text: 'wontfix' }];

    var select2 = $(".html-multi-chosen-select").select2({
        data: sampleArray,
        createSearchChoice: function (term, data) {
            if ($(data).filter(function () {
              return this.text.localeCompare(term) === 0;
            }).length === 0) {
                return { id: term, text: term };
            }
        }
    });

    //$('.html-multi-chosen-select').chosen({ width: "210px" });

    $('#yoyo').click(function () {
    });
    

    //$('.html-multi-chosen-select').select2('data').text

    $('.html-multi-chosen-select').append('<option value="test">test</option>');
});