$(function () {
  $('#ghsubmitbtn').on('click', function (e) {
    e.preventDefault();

    var username = $('#ghusername').val();
    var requri = 'https://api.github.com/users/' + username;
    var repouri = 'https://api.github.com/users/' + username + '/repos';

    requestJSON(requri, function (json) {
      if (json.message == 'Not Found' || username == '') {
        $('#ghapidata').html('<h2>No se ha encontrado información para este usuario.</h2>');
      } else {
        // else we have a user and we display their info
        var fullname = json.name;
        var username = json.login;
        var aviurl = json.avatar_url;
        var profileurl = json.html_url;
        var location = json.location;
        var followersnum = json.followers;
        var followingnum = json.following;
        var reposnum = json.public_repos;

        if (fullname == undefined) {
          fullname = username;
        }

        var outhtml = '<h2>' + fullname + ' <span class="smallname">(@<a href="' +
          profileurl + '" target="_blank">' + username + '</a>)</span></h2>';
        outhtml = outhtml + '<div class="ghcontent"><div class="avi"><a href="' +
          profileurl + '" target="_blank"><img src="' + aviurl +
          '" width="80" height="80" alt="' + username + '"></a></div>';
        outhtml = outhtml + '<p>Seguidores: ' + followersnum + ' - Siguiendo: ' +
          followingnum + '<br>Repositorios: ' + reposnum + '</p></div>';
        outhtml = outhtml + '<div class="repolist clearfix">';

        var repositories;
        $.getJSON(repouri, function (json) {
          repositories = json;
          outputPageContent();
        });

        function outputPageContent() {
          if (repositories.length == 0) {
            outhtml = outhtml + '<p>Sin repositorios!</p></div>';
          } else {
            outhtml = outhtml + '<p><strong>Lista de repositorios:</strong></p> <ul>';
            $.each(repositories, function (index) {
              outhtml = outhtml + '<li><a href="' + repositories[index].html_url +
                '" target="_blank">' + repositories[index].name + '</a></li>';
            });

            outhtml = outhtml + '</ul></div>';
          }

          $('#ghapidata').html(outhtml);
        }
      }
    });
  });

  function requestJSON(url, callback) {
    $.ajax({
      url: url,
      complete: function (xhr) {
        callback.call(null, xhr.responseJSON);
      },

    });
  }
});
