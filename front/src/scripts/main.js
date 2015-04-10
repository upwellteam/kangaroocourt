function betCount(startWith) {
    var count = startWith,
        $add = $('#add'),
        $remove = $('#remove');

    $('#bet').val(count);
    $remove.click(function () {
        count = count >= 1 ? (count - 1) : 0;
        $('#bet').val(count);
    });
    $remove.mousedown(function () {
        var timer = window.setInterval(function () {
            count = count >= 1 ? (count - 1) : 0;
            $('#bet').val(count);
        }, 100);
        $(this).mouseup(function () {
            clearInterval(timer);
        })
    });
    $add.click(function () {
        count = count <= 100 ? (count + 1) : 0;
        $('#bet').val(count);
    });
    $add.mousedown(function () {
        var timer = window.setInterval(function () {
            count = count <= 100 ? (count + 1) : 0;
            $('#bet').val(count);
        }, 100);
        $(this).mouseup(function () {
            clearInterval(timer);
        })
    });
}


function switchArgument() {
    var argument = {},
        $add = $('#addArgBtn'),
        $input = $('#argInput');

    $add.click(function(){
        $add.hide('fast');
        $input.show('fast');
    });
    $('#submit').click(function(){
        argument = {
            argument : $('#argument').val(),
            DisputeId : JSON.parse(localStorage.dispute).id,
            userId : JSON.parse(localStorage.user).id,
            role : 'Defendant'
        };
        $input.hide('fast').parent().append('<span class="text">'+argument.argument+'</span>');
        $.post('/api/argument', argument)
    });
}

/* TEMP */
function votes() {

    // TODO: запись в базу

    var $voteRes = $('#voteResult'),
        $voteD = $('#forDefendant'),
        $voteP = $('#forPlaintiff'),
        votes = {
        defendant : 0,
        plaintiff : 0
    };

    $voteD.click(function(){

        $voteD.parent().parent().hide('fast');
        $voteRes.show('fast');
        votes.defendant++;
        $('#voteResult .progress .progress-bar-success').css('width', (votes.defendant/(votes.defendant+votes.plaintiff)*100+'%'));
        $('#voteResult .progress .progress-bar-primary').css('width', (votes.plaintiff/(votes.defendant+votes.plaintiff)*100+'%'));
    });
    $voteP.click(function(){
        $voteP.parent().parent().hide('fast');
        $voteRes.show('fast');
        votes.plaintiff++;
        $('#voteResult .progress .progress-bar-success').css('width', (votes.defendant/(votes.defendant+votes.plaintiff)*100+'%'));
        $('#voteResult .progress .progress-bar-primary').css('width', (votes.plaintiff/(votes.defendant+votes.plaintiff)*100+'%'));
    });
}

function cutText( text, limit) {
    text = text.trim();

    if(text.length <= limit) return text;

    text = text.slice( 0, limit);

    if(text.lastIndexOf(" ") > 0) {
        text = text.substr(0, text.lastIndexOf(" "));
    }

    return text + "...";
}