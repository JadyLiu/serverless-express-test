---
title: Contact Me
---

<link href="contact.css" rel="stylesheet"></link>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>

<div class="alert"></div>
<form class="form" id="contactform">
        <input class="input" type="text" name="name" placeholder="NAME" required>
        <input class="input" id="emailaddr" type="email" name="_replyto" placeholder="E-MAIL" required>
        <textarea class="input" id="message" name="message" placeholder="MESSAGE" required></textarea>
        <input id="submit" type="submit" value="GO!">
        <!-- <button type="submit" id="submit">Submit</button> -->

</form>

<script type="text/javascript">
  $(document).ready(function() {
    
    var form = $('#contactform');
    var alert = $('.alert');
    var submit = $('#submit');
    
    $(form).submit(function(e) {
        e.preventDefault();  
        var msg = document.getElementById('message').value;
        var emailaddress = document.getElementById('emailaddr').value;
        var data = {
        "email": emailaddress,
        "message": msg
        };
        $.ajax({
            type: 'POST',
            crossDomain: true,
            url: '',
            contentType: 'application/json',
            data: JSON.stringify(data),
            dataType: 'json',
            beforeSend: function() {
               alert.fadeOut();
               submit.html('Sending....');
            },
            success: function (response) {
              console.log(response);
              if ( response === 'success' ) {
                $(location).attr('href','success.html');
              } else {
                alert.html(data.status).fadeIn();
                submit.val('Send up').removeAttr('disabled');
              }
            },
            error: function (e) {
                console.log(e);
                alert.html('Sending request fail').fadeIn();
                submit.val('Send Up').removeAttr('disabled');
            },
        });  
      });
    });
</script>