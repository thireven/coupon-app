'use strict';

function signupHandler(){
  $('#signup-section').on('submit', '#js-signup-form', (e) => {
    e.preventDefault();
    console.log("signup form submitted");

    $.ajax({
      url: '/users',
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

        // window.location.href = '/login';

        $('#js-msg-output').html(`<div class="alert alert-success alert-dismissible fade show" role="alert">Your Account has been registered!
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          </div`);
      },
      error: (err) => {
        const errorMsg = (`This username is taken or the password is invalid`);
        $('#js-msg-output').html(`<div class="alert alert-danger" role="alert">This username is taken or the password is invalid</div>`);
      }
    });
  });
}

function loginHandler() {
  $('#login-section').on('submit', '#js-login-form', (e) => {
    e.preventDefault();
    $.ajax({
      url: 'auth/login',
      data: {
        username: $('#input-username').val(),
        password: $('#input-password').val()
      },
      type: 'POST',
      success: function(res) {
        localStorage.setItem('Token', res.authToken);
        logInWithToken();
      },
      error: (err) => {
        console.log(err);
      }
    });
  });
}

function logInWithToken(){
	// get user information
	$.ajax({
		url: '/users/logged',
		type: 'GET',
		beforeSend: function(xhr){
			xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('Token')}`);
		},
		success: function(res){
			//profile_basics = res;
      console.log("jessica");
      console.log(res);
      $('#input-username').val('');
      $('#input-password').val('');

      console.log('our Account has been successfully created');
      $('#js-msg-output').html(`<div class="alert alert-success text-center" role="alert">Success</div>`);

      window.location.href = '/coupon';
    },
		error: function(err){
      console.log('something went wrong');
		}
	});
}

function initApp() {
  signupHandler();
  loginHandler();
}

$(initApp);
