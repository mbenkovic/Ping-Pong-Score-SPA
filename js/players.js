// Add Player Modal
// let add_modal = document.getElementById("add_modal");
// let add_btn = document.getElementById("add");
// let add_close = document.getElementsByClassName("add_close")[0];

document.getElementById("add").onclick = function() {
  document.getElementById("add_modal").style.display = "block";
}

document.getElementsByClassName("add_close")[0].onclick = function() {
  document.getElementById("add_modal").style.display = "none";
}

// Edit Player Modal
// let edit_modal = document.getElementById("edit_modal");
// let edit_btn = document.querySelectorAll(".edit");
// let edit_close = document.getElementsByClassName("edit_close")[0];

for (let i = 0; i < document.querySelectorAll(".edit").length; i++){
  document.querySelectorAll(".edit")[i].onclick = function() {
    document.getElementById("edit_modal").style.display = "block";
  }
}

document.getElementsByClassName("edit_close")[0].onclick = function() {
  document.getElementById("edit_modal").style.display = "none";
}

// Form Player
$('#add_form').submit(function(e) { 
    console.log($('#fname').val(), $('#lname').val(), $('#birthdate').val());
    $.ajax({
    type: "POST",
    url: "/ppsingle/ajax/actions.php",
    data: {
      'ime'           : $('#fname').val(),
      'prezime'       : $('#lname').val(),
      'datum_rodenja' : $('#birthdate').val(),
      'action'        : 'add_player'
    },
    dataType: "json",
    success: function(a) {
      window.location.reload();
    }
  });
  e.preventDefault();
});

$('.delete').click(function() {
  let ime = $(this).closest('tr').find('.ime').text();
  let prezime = $(this).closest('tr').find('.prezime').text();
  if(confirm(`Da li sigurno želite izbrisati igrača ${ime} ${prezime}?`))
  {
    $.ajax({
      type: "POST",
      url: "/ppsingle/ajax/actions.php",
      data: {
        'id'           : $(this).val(),
        'action'       : 'delete_player'
      },
      dataType: "json",
      success: function(a) {
        window.location.reload();
      }
    });
  }
})

$('.edit').click(function() {
  let ime = $(this).closest('tr').find('.ime').text();
  let prezime = $(this).closest('tr').find('.prezime').text();
  let dt = $(this).closest('tr').find('.datum_rod').text();
  $('#efname').val(ime);
  $('#elname').val(prezime);
  $('#ebirthdate').val(dt);
  $('#user_id').val($(this).val());
})

$('#edit_form').submit(function() {
  $.ajax({
    type: "POST",
    url: "/ppsingle/ajax/actions.php",
    data: {
      'id'            : $('#user_id').val(),
      'ime'           : $("#efname").val(),
      'prezime'       : $("#elname").val(),
      'datum_rodenja' : $("#ebirthdate").val(),
      'action'        : 'edit_player'
    },
    dataType: "json",
    success: function(a) {
      window.location.reload();
    }
  });
})