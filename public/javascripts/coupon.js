/*
Coupons
    1. add functionality to add
        then needs to re-render page results
    2. add functionality to delete
        then needs to re-render page results
    3. add functionality to edit
        then needs to re-render page results
*/

function renderCoupons(res){
  return`
    <section role="region" class="coupon-container js-coupon-container" data-id="${res._id}">
        <div class="coupon-actions-nav">
        <button type="button" class="js-edit-coupon-btn" data-toggle="modal" data-target="#editCouponModal">
          <span class="icons icon-budicon-classic edit-icon js-edit-icon" alt="edit-icon"></span>
        </button>
            <span class="icons icon-budicon-classic-2 delete-icon js-delete-icon" alt="delete-icon"></span>
        </div>
        <h2 class="coupon-merchant-name">${res.merchantName}</h2>
        <p class="coupon-code">${res.code}</p>
        <p class="coupon-expiration-date">Valid til ${res.expirationDate}</p>
        <p class="coupon-description">${res.description}</p>
        <p class="coupon-id">${res._id}</p>
    </section>`;
}

function watchSubmitAddNewCouponHandler(){
    $('#js-submit-add-coupon-btn').on('click', (e) => {
        e.preventDefault();
        console.log('you added a coupon');
        $('#addNewCouponModal').modal('toggle');
        //do a call to post coupon to db with endpoint /coupon
        sendAddCouponDataToAPI();
    });
}

function sendAddCouponDataToAPI() {
    $.ajax({
  		url: '/coupon',
      type: 'POST',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('Token')}`);
      },
      data: {
        merchantName: $('#merchantName').val(),
        code: $('#code').val(),
        expirationDate: $('#expirationDate').val(),
        description: $('#description').val()
      },
      dataType:'json',///////////////////JUST ADDED THIS/////////////////////////
  		success: function(res){
        $('#merchantName').val('');
        $('#code').val('');
        $('#expirationDate').val('');
        $('#description').val('');

        $('.list-coupons-section').append(renderCoupons(res));

        $('#js-msg-output').html(`<div class="alert alert-success alert-dismissible fade show text-center" role="alert">You have successfully added a coupon!
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          </div`);
  		},
  		error: function(err){
        console.log('something went wrong');
  		}
  	});
}

function watchDeleteBtnHandler() {
    $('#js-list-coupons-section').on('click','.js-delete-icon', function(e) {
        e.preventDefault();
        const couponId = $(this).closest('.js-coupon-container').data('id');
        console.log(`The coupon id: ${couponId}`);
        $(this).closest('.js-coupon-container').remove();
        sendCouponToDeleteFromApi(couponId);
    });
}

function sendCouponToDeleteFromApi(id) {
  console.log(`if I got here then i should delete this id: ${id} from the DB`);
    $.ajax({
      url: `/coupon/${id}`,
      type: 'DELETE',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('Token')}`);
      },
      dataType: 'json',
      success: function(res) {
        console.log(`you successfully deleted a coupon`);
      },
      error: function(err) {
        console.log(`Something happened when trying to delete ${res}`);
      }
    });
}

function getCouponid(){
  $('#js-list-coupons-section').on('click','.js-edit-icon', function(e) {
      e.preventDefault();
      const couponId = $(this).closest('.js-coupon-container').data('id');
      console.log(`The coupon id of the edit coupon ${couponId}`);
      watchEditCouponHandler(couponId)
  });
}

function watchEditCouponHandler(id){
  console.log(id);
  $('#js-submit-edit-coupon-btn').on('click', function(e) {
      e.preventDefault();
      console.log('you want to update a coupon');
      $('#editCouponModal').modal('toggle');
      sendCouponToEditFromApi(id);
  });
}

function sendCouponToEditFromApi(id){
  console.log(`If I got here then I should edit this id: ${id} on the DB`);
    $.ajax({
      url: `/coupon/${id}`,
      type: 'PUT',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('Token')}`);
      },
      data: {
        merchantName: $('.merchantName').val(),
        code: $('.code').val(),
        expirationDate: $('.expirationDate').val(),
        description: $('.description').val()
      },
      dataType: 'json',
      success: function(res) {
        console.log(`you successfully updated a coupon`);

        // const merchantNameInput = $(this).find('.merchantName');
        // const codeInput = $(this).find('.code');
        // const expirationDateInput = $(this).find('.expirationDate');
        // const descriptionInput = $(this).find('.description');
        //
        // const merchantNameVal = merchantNameInput.val();
        // console.log(merchantNameVal);

        let form = event.target;
        let currentId = form.getAttribute('id');

        const taskInput = $(this).find('.merchantName' + currentId);

        const taskValue = taskInput.val();


        const editCoupon = {
          taskTitle: taskValue,

        };


        //clears the form
        $('.merchantName').val('');
        $('.code').val('');
        $('.expirationDate').val('');
        $('.description').val('');



        // $('.coupon-merchant-name').replaceWith(`<h2 class="coupon-merchant-name">chnaginhtext</h2>`);
        // $('.coupon-code').replaceWith(`<p class="coupon-code">hiJessica</p>`);
        // $('.coupon-expiration-date').replaceWith(`<p class="coupon-expiration-date">hiJessica</p>`);
        // $('.coupon-description').replaceWith(`<p class="coupon-description">hiJessica</p>`);


        $('#js-msg-output').html(`<div class="alert alert-success alert-dismissible fade show text-center" role="alert">You have successfully edited a coupon!
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          </div`);
      },
      error: function(err) {
        console.log(`Something happened when trying to edit ${err}`);
      }
    });
}

function initalizeCouponApp() {
    watchSubmitAddNewCouponHandler();
    watchDeleteBtnHandler();
    getCouponid();
    //watchEditCouponHandler();
}
$(initalizeCouponApp);
