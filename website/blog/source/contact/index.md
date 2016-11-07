---
title: contact
date: 2016-10-27 17:52:57
---
Contact me for questions, comments, suggestions, or to request a topic for a post.

<form class="form" id="contactform">
    <fieldset class="field">
        <input class="input" type="text" name="name" placeholder="Name" required>
        <label class="label" for="name"><span class="label-content">Your name</span></label>
    </fieldset>
    <fieldset class="field">
        <input class="input" id="emailaddr" type="email" size="30" name="_replyto" placeholder="example@domain.com" required>
        <label class="label" for="_replyto"><span class="label-content">Your email</span></label>
    </fieldset>
    <fieldset class="field">
        <textarea class="input" id="messageint" name="message" rows="7" cols="50" placeholder="Message" required></textarea>
        <label class="label" for="message"><span class="label-content">Your message</span></label>
    </fieldset>
    <input class="hidden" type="text" name="_gotcha" style="display:none">
    <input class="hidden" type="hidden" name="_subject" value="Message via http://domain.com">
    <fieldset class="field">
        <input class="button submit" type="submit" value="Send" onclick="sendmessage()">
    </fieldset>
</form>

<script type="text/javascript">

  function sendmessage(){

      var config = { invokeUrl:'https://ydof20cshi.execute-api.ap-southeast-2.amazonaws.com/prod' }
      var apigClient = apigClientFactory.newClient();
      var msg = document.getElementById('messageint').value;
      var emailaddress = document.getElementById('emailaddr').value;

      //alert(msg + emailaddress + 'config is ' + config);

      var body = {
        "email": emailaddress,
        "message": msg
      };
      var params = {
        //"msg": messg
      };
      var additionalParams = {
      };
    //  var messg = mesg;
    //      document.getElementById("demo").innerHTML = "messg";
      apigClient.sendmsqPost(params, body, additionalParams);

      alert(params + body + 'Parameter and body');

      messageint.value= "";
      emailaddr.value= "";
  }
</script>

