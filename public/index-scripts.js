$(document).ready(function() {

  var urlInput = $('.url-input');
  var shortenBtn = $('.shorten-button');
  var resultText = $('.result-text');
  
  shortenBtn.on('click', function shortenRequest(){
    console.log('Got a shorten button click');
    var reqType = $('.req-type option:selected').text();
    var target = reqType + urlInput.val();
    var loc = "https://tulip-switch.glitch.me?longURL="+target;
    console.log(loc); 
    $.ajax({
      type:"POST",
      url: "https://tulip-switch.glitch.me\?longURL="+target,
      success: function( result ) {
        console.log("I'm back from AJAX")
        console.log(result);

        var resultValid = !isEmpty(result)
        handleErrorSection(resultValid);
        handleResultSection(resultValid);
        if (resultValid) { resultText.val(result.shortURL);}
      }
    });
  });

  
  var errorSection = $('.error-section');
  var errorCloseBtn = $('.delete-error-button');
  var showError = false;
  
  errorCloseBtn.on('click', function(){
    errorSection.addClass('is-hidden');
      showError = false;
  });

  function handleErrorSection(urlResult){
    if (urlResult === true && showError === true){
      console.log('Error Section: URL was valid and already showing error....hiding error');
      errorSection.addClass('is-hidden');
      showError = false;
    }
    if (urlResult === false && showError === false){
      console.log('Error Section: URL was INVALID and already NOT showing error.....showing error');
      errorSection.removeClass('is-hidden');
      showError = true;
    }
  }

  
  var resultSection = $('.result-section');
  var showResult = false;
  
  function handleResultSection(urlResult){
    if (urlResult === false && showResult === true){
      console.log('result Section: URL was INVALID and already showing result....hiding result');
      resultSection.addClass('is-hidden');
      showResult = false;
    }
    if (urlResult === true && showResult === false){
      console.log('result Section: URL was valid and NOT showing result....showing result');
      resultSection.removeClass('is-hidden');
      showResult = true;
    }
  }

  function isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }  
  
  //var Clipboard = Window.Clipboard;
  var copyBtn = $('.copy-button');
  new Clipboard('.copy-button');
});