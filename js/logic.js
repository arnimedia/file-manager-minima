$(document).ready(function(){

  // Table search
  $("#search-box").on("keyup", function() {
    var value = $(this).val().toLowerCase();
    $("#filestable tr").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });

  // Form button active
  $('#createfolder').on('input change', function() {
    $('#createfolder-but').attr('disabled', false);
  });

  // Clears input field
  $('#staticBackdrop').on('hidden.bs.modal', function () {
    $('#createfolder').val('');
  });

  //Removing spaces for underscore for folder name
  $("#createfolder").on('input', function(key) {
    var value = $(this).val();
    $(this).val(value.replace(/ /g, '_'));
  })

  // Upload file button
  $('#myForm').on('change', "input#fileInput", function (e) {
    e.preventDefault();
    $("#myForm").submit();
   });

  // Search bar
  $( "#search-close" ).append(closeIcon);
  $( "#search-but" ).append(searchIcon);
  $( "#delete-icon" ).append(deleteIcon);

  $( "#search-close" ).on( "click", function() {
    $( "#search-container" ).hide("fast");
  });

  $( "#search-but" ).on( "click", function() {
    $( "#search-container" ).show("fast");
  });

  //Calling delete modal
  $('#confirm-delete').on('show.bs.modal', function(e) {
    $(this).find('.btn-dark').attr('href', $(e.relatedTarget).data('href'));
    $('.show-type').html($(e.relatedTarget).data('type'));
    $('.file-folder-name').html('Delete '+ $(e.relatedTarget).data('type') + ':' + ' <strong>' + $(this).find('.btn-dark').attr('href').split('%2F').pop() + '</strong>');
  });

  $('#image-viewer').on('show.bs.modal', function(e) {

    var imageloc = decodeURIComponent($(e.relatedTarget).data('href'));

    MDS.file.loadbinary(imageloc,function(msg){
      MDS.log(JSON.stringify(msg));
      
      var imgdata = msg.response.load.data;
      var img = document.getElementById("image-output");
      var b64 = MDS.util.hexToBase64(imgdata.substring(2));
      var src = 'data:image/*;base64,' + b64;
      
      img.src = src;
    });

    $('.show-type').html($(e.relatedTarget).data('type'));
    $('.file-folder-name').html($(e.relatedTarget).data('href').split('%2F').pop());
  });


  // console.log(localStorage.getItem('wasVisited'));

  // Onboarding management via LocalStorage

  if (localStorage.getItem('wasVisited') == 1) {

    $('main').removeClass('visually-hidden');
  
  } else {
    
    localStorage.setItem('wasVisited', 1);

    $('#filez-logo').modal('show');

    setTimeout(function(){ 
      $('#filez-logo').modal('hide');
      $('#onboarding').modal('show');
      $('#onboarding').on('shown.bs.modal', function () {
        $(".modal-backdrop").hide();
      })
    }, 2000);

    setTimeout(function(){
      $('#onboarding').modal('hide'); 
      $('main').removeClass('visually-hidden');
    }, 20000);
  }

  $( "#onboarding-cancel" ).on( "click", function() {
    $('#onboarding').modal('hide'); 
    $('main').removeClass('visually-hidden');
  });

  $( "#onboarding" ).on('slide.bs.carousel', function (ev) {
      if(ev.from == 1){
        $('#onboarding .modal-footer .finish').removeClass("visually-hidden");
        $('#onboarding .modal-footer .btn-link').html("");
        $('#onboarding .modal-footer .continue').hide();
      }
  })

  $( ".finish" ).on( "click", function() {
    $('#onboarding').modal('hide'); 
    $('main').removeClass('visually-hidden');
  });
    

  // Table sorting
  const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;

  const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
      v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
      )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx));

  // Do the work...
  document.querySelectorAll('th').forEach(th => th.addEventListener('click', (() => {
      const table = th.closest('table');
      const tbody = table.querySelector('tbody');
      Array.from(tbody.querySelectorAll('tr ~ tr:not(#row-marker)'))
        .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
        .forEach(tr => tbody.appendChild(tr) );
  })));

});
