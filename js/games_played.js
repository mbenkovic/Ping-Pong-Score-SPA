// Form Games Played

$('.delete_game').click(function() {
  if(confirm('Da li sigurno želite izbrisati meč?'))
  {
    $.ajax({
      type: "POST",
      url: "/ppsingle/ajax/actions.php",
      data: {
        'id'           : $(this).val(),
        'action'       : 'delete_game'
      },
      dataType: "json",
      success: function(a) {
        window.location.reload();
      }
    });
  }
})

// Pagination

$('.forward').click(function() {
  let curr_active = $('.active_pag');
  if (curr_active.next().attr('class') != "forward") {
    curr_active.next().addClass('active_pag');
    curr_active.removeClass('active_pag');
  }
})

$('.back').click(function() {
  let curr_active = $('.active_pag');
  if (curr_active.prev().attr('class') != "back") {
    curr_active.prev().addClass('active_pag');
    curr_active.removeClass('active_pag');
  }
})