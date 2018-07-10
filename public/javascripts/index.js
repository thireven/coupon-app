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


        $('#js-msg-output').html(`<div class="alert alert-success alert-dismissible fade show text-center" role="alert">Your Account has been registered!
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          </div`);


        window.location.href = '/login';
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
        console.log('What is res.authToken Value?' + res.authToken);

        $('.js-logout').removeClass('hide');
        $('.js-coupon').removeClass('hide');
        // window.location.href = '/coupon';
        //loadUserCoupons();

        getUserCoupons();
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

function logoutHandler() {
  $('.js-logout').on('click', (e) => {
    var token = localStorage.getItem('Token');

    if(token) {
      localStorage.removeItem('Token');
      // location.reload();
      console.log('you are logged out!');

      $('#js-msg-output').show();

      $('#js-msg-output').html(`<div class="alert alert-success alert-dismissible fade show text-center" role="alert">You have successfully Logged out!
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
        </div`);

      window.location.href = '/';

      setTimeout(() => {
        $('#js-msg-output').hide();
      }, 1000);
    }
    else{
      console.log('there is no token. you you are not signed in');
    }
  });
}

function loadUserCoupons() {
  $('.js-logout').removeClass('hide');
  $('.js-coupon').removeClass('hide');
  var token = localStorage.getItem('Token');
  //I want to pass the bear token in the headers to gain access to coupon
  $.ajax({
    url: '/coupon/' + token,
    type: 'GET',
    success: function(res) {
      var html = "";
      res.coupons.map(function(coupon){
        html +=`<section role="region" class="coupon-container js-coupon-container" data-id="${coupon._id}">
                  <div class="coupon-actions-nav">
                      <button type="button" class="btn-transparent edit-btn js-edit-coupon-btn " data-toggle="modal" data-target="#editCouponModal">
                        <span class="icons icon-budicon-classic js-edit-icon" alt="edit-icon"></span>
                      </button>
                      <button type="button" class="btn-transparent" >
                        <span class="icons icon-budicon-classic-2 js-delete-icon" alt="delete-icon"></span>
                      </button>
                  </div>
                  <h2 class="coupon-merchant-name">${coupon.merchantName}</h2>
                  <p class="coupon-code js-coupon-code">${coupon.code}</p>
                  <p class="coupon-expiration-date">${coupon.expirationDate}</p>
                  <p class="coupon-description">${coupon.description}</p>
                </section>`
      });
      $('#coupons').html(html);
    },
    error: function(err) {
      if(token === null) {
        console.log('Token is empty and you are not logged in. Please log in!!!');
      }
      else{
        console.log('something went wrong when trying to get to the protected endpoint');
      }
    }
  })
}

function getUserCoupons() {
  $('.js-logout').removeClass('hide');
  $('.js-coupon').removeClass('hide');
  $.ajax({
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('Token')}`);
    },
    url: '/coupon/',
    type: 'GET',
    success: function(res) {
      console.log(res);
      var html = "";
      res.coupons.map(function(coupon){
        html +=`<section role="region" class="coupon-container js-coupon-container" data-id="${coupon._id}">
                  <div class="coupon-actions-nav">
                      <button type="button" class="btn-transparent edit-btn js-edit-coupon-btn " data-toggle="modal" data-target="#editCouponModal">
                        <span class="icons icon-budicon-classic js-edit-icon" alt="edit-icon"></span>
                      </button>
                      <button type="button" class="btn-transparent" >
                        <span class="icons icon-budicon-classic-2 js-delete-icon" alt="delete-icon"></span>
                      </button>
                  </div>
                  <h2 class="coupon-merchant-name">${coupon.merchantName}</h2>
                  <p class="coupon-code js-coupon-code">${coupon.code}</p>
                  <p class="coupon-expiration-date">${coupon.expirationDate}</p>
                  <p class="coupon-description">${coupon.description}</p>
                </section>`
      });
      $('#coupons').html(html);
      //window.location.href = '/coupon';
    },
    error: function(err) {
      if(token === null) {
        console.log('Token is empty and you are not logged in. Please log in!!!');
      }
      else{
        console.log('something went wrong when trying to get to the protected endpoint');
      }
    }
  })
}

function index() {

}
function initApp() {

  signupHandler();
  loginHandler();
  logoutHandler();
}

$(initApp);
