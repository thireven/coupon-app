'use strict';

function signupHandler() {
  $('#signup-section').on('submit', '#js-signup-form', (e) => {
    e.preventDefault();
    console.log("signup form submitted");

    $.ajax({
      url: '/api/users',
      type: 'POST',
      data: {
        firstName: $('#input-firstName').val(),
        lastName: $('#input-lastName').val(),
        username: $('#input-username').val(),
        password: $('#input-password').val()
      },
      success: function(res) {
        //display message to user stating account has been successfully created
        $('#input-firstName').val('');
        $('#input-lastName').val('');
        $('#input-username').val('');
        $('#input-password').val('');

        //window.location.href = '/login';

        $('#js-msg-output').html(`<div class="alert alert-success alert-dismissible fade show text-center" role="alert">Your Account has been registered!
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          </div`);
      },
      error: (err) => {
        $('#js-msg-output').html(`<div class="alert alert-danger text-center" role="alert">This username is taken or the password is invalid</div>`);
      }
    });
  });
}

function loginHandler() {
  $('#login-section').on('submit', '#js-login-form', (e) => {
    e.preventDefault();
    $.ajax({
      url: '/api/auth/login',
      data: {
        username: $('#input-username').val(),
        password: $('#input-password').val()
      },
      type: 'POST',
      success: function(res) {
        //this saves the authToken that comes from response to the Token variable
        localStorage.setItem('Token', res.authToken);
        console.log("What is res.authToken Value? " + res.authToken);
        GoToProtectedEndpointWithToken();
      },
      error: (err) => {
        console.log(err);
        $('#js-msg-output').html(`<div class="alert alert-danger alert-dismissible fade show text-center" role="alert">Something is wrong!
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          </div`);
      }
    });
  });
}

function GoToProtectedEndpointWithToken() {
  //I want to pass the bear token in the headers to gain access to coupon
  $.ajax({
    url: '/coupon',
    type: 'GET',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('Token')}`);
    },
    success: function(res) {
      // window.location.href = '/coupon';
      console.log('You successfully got to protected endpoint');
    },
    error: function(err) {
      console.log('something went wrong when trying to get to the protected endpoint');
    }
  })
}

function logoutHandler() {
  $('.js-logout').on('click', (e) => {
    localStorage.removeItem('Token');
    console.log('you are logged out!');
    location.reload();
  });
}


function initApp() {
  signupHandler();
  loginHandler();
  logoutHandler();
}

$(initApp);
