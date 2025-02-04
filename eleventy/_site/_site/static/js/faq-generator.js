$ = jQuery;

$.ajax({
  url: '/docs/faq.html',
  success: function(data) {
    $('#faq-stub').empty();
    var questions = $(data).find('.question p[id]');
    $.each(questions, function(i){
      var q = document.createElement('p');
      var a = document.createElement('span');
      $(a).text("Answer »");
      var link = document.createElement('a');
      $(link).attr("href", "/docs/faq.html#" + questions[i].id);
      link.appendChild(document.createTextNode(questions[i].textContent));
      link.appendChild(a);
      q.appendChild(link);
      $('#faq-stub').append(q);
    });
  }
});
