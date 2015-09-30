$ = jQuery;

$.ajax({
  url: '/docs/faq.html',
  success: function(data) {
    var questions = $(data).find('.question p[id]');
    $.each(questions, function(i){
      var q = document.createElement('p');
      var link = document.createElement('a');
      $(link).attr("href", "/docs/faq.html#" + questions[i].id);
      link.appendChild(document.createTextNode(questions[i].textContent));
      q.appendChild(link);
      $('#faq-stub').append(q);
    });
  }
});
