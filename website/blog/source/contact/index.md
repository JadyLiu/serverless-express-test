---
title: contact
date: 2016-10-27 17:52:57
---
Contact me for questions, comments, suggestions, or to request a topic for a post.
<!-- <style type="stylesheet" src="contact.css"></style> -->

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script>

<!-- <script type="text/javascript" src="lib/axios/dist/axios.standalone.js"></script>
<script type="text/javascript" src="lib/CryptoJS/rollups/hmac-sha256.js"></script>
<script type="text/javascript" src="lib/CryptoJS/rollups/sha256.js"></script>
<script type="text/javascript" src="lib/CryptoJS/components/hmac.js"></script>
<script type="text/javascript" src="lib/CryptoJS/components/enc-base64.js"></script>
<script type="text/javascript" src="lib/url-template/url-template.js"></script>
<script type="text/javascript" src="lib/apiGatewayCore/sigV4Client.js"></script>
<script type="text/javascript" src="lib/apiGatewayCore/apiGatewayClient.js"></script>
<script type="text/javascript" src="lib/apiGatewayCore/simpleHttpClient.js"></script>
<script type="text/javascript" src="lib/apiGatewayCore/utils.js"></script>
<script type="text/javascript" src="apigClient.js"></script> -->

<form class="form" id="contactform">
    <fieldset class="field">
        <input class="input" type="text" name="name" placeholder="Name" required>
        <label class="label" for="name"><span class="label-content">Your name</span></label>
    </fieldset>
    <fieldset class="field">
        <input class="input" id="emailaddr" type="email" size="30" name="_replyto" placeholder="your_email@domain.com" required>
        <label class="label" for="_replyto"><span class="label-content">Your email</span></label>
    </fieldset>
    <fieldset class="field">
        <textarea class="input" id="message" name="message" rows="7" cols="50" placeholder="Message" required></textarea>
        <label class="label" for="message"><span class="label-content">Your message</span></label>
    </fieldset>
    <fieldset class="field">
        <button type="submit" id="submit">Submit</button>
<!--         <input class="button submit" type="submit" value="Send" onclick="sendmessage()"> -->
    </fieldset>
</form>

<script type="text/javascript">
  $(document).ready(function() {

    $("#contactform").submit(function(e) {
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
            success: function (data) {
                console.log(data);
            },
            error: function (e) {
                console.log('error');
            },
        });
      });
    });
</script>

<!--<script type="text/javascript">

  function sendmessage(){

      var apigClient = apigClientFactory.newClient();
      var msg = document.getElementById('message').value;
      var emailaddress = document.getElementById('emailaddr').value;

      var body = {
        "email": emailaddress,
        "message": msg
      };
      var params = {
        //"msg": messg
      };
      var additionalParams = {
      };
      apigClient.sendmsqPost(params, body, additionalParams);
  }
</script>-->

