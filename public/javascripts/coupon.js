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
        <button type="button" class="btn-transparent js-edit-coupon-btn" data-toggle="modal" data-target="#editCouponModal">
          <span class="icons icon-budicon-classic edit-icon js-edit-icon" alt="edit-icon"></span>
        </button>
            <span class="icons icon-budicon-classic-2 delete-icon js-delete-icon" alt="delete-icon"></span>
        </div>
        <h2 class="coupon-merchant-name">${res.merchantName}</h2>
        <p class="coupon-code">${res.code}</p>
        <p class="coupon-expiration-date">${res.expirationDate}</p>
        <p class="coupon-description">${res.description}</p>
    </section>`;
}

function watchSubmitAddNewCouponHandler(){
    $('#js-submit-add-coupon-btn').on('click', (e) => {
        e.preventDefault();
        console.log('you added a coupon');
        $('#addNewCouponModal').modal('toggle');
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
      dataType:'json',
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
        const couponId = $(this).parent().parent().attr('data-id');
        console.log(`The coupon id: ${couponId}`);
        $(this).parent().parent().remove();
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
        console.log(`Something happened when trying to delete ${err}`);
      }
    });
}

function getCouponid(){
  $('#js-list-coupons-section').on('click','.js-edit-icon', function(e) {
      e.preventDefault();
      const couponId = $(this).parent().parent().parent().attr('data-id');
      console.log(`The coupon id of the edit coupon ${couponId}`);

      //get the values currently in the input fields for that getCouponid
      const couponObject = $(this).parent().parent().parent();
      console.log(couponObject);

      const merchantNameText = $(couponObject).find('h2.coupon-merchant-name').text();
      console.log(merchantNameText);

      const codeText = $(couponObject).find('p.coupon-code').text();
      console.log(codeText);

      const expirationDateText = $(couponObject).find('p.coupon-expiration-date').text();
      console.log(expirationDateText);

      const descriptionText = $(couponObject).find('p.coupon-description').text();
      console.log(descriptionText);

      $('.input-merchantName').val(merchantNameText);
      $('.input-code').val(codeText);
      $('.input-expirationDate').val(expirationDateText);
      $('.input-description').val(descriptionText);

      //pull the values that the user types in the inputs
      watchEditCouponHandler(couponId)
  });
}

function watchEditCouponHandler(id){
  $('#js-submit-edit-coupon-btn').on('click', function(e) {
      e.preventDefault();
      console.log('you want to update a coupon');
      $('#editCouponModal').modal('toggle');
      sendCouponToEditFromApi(id);
  });
}

function sendCouponToEditFromApi(id){
  let _couponId = id;
  console.log(`If I got here then I should edit this id: ${id} on the DB`);
    $.ajax({
      url: `/coupon/${id}`,
      type: 'PUT',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('Token')}`);
      },
      data: {
        merchantName: $('.input-merchantName').val(),
        code: $('.input-code').val(),
        expirationDate: $('.input-expirationDate').val(),
        description: $('.input-description').val()
      },
      dataType: 'json',
      success: function(res) {
        console.log(`you successfully updated a coupon: ${_couponId}`);

        var merchantName = $('.input-merchantName').val();
        var inputCode = $('.input-code').val();
        var expirationDate = $('.input-expirationDate').val();
        var inputDescription = $('.input-description').val();

        $(`[data-id = ${_couponId}] .coupon-merchant-name`).html(merchantName);
        $(`[data-id = ${_couponId}] .coupon-code`).html(inputCode);
        $(`[data-id = ${_couponId}] .coupon-expiration-date`).html(expirationDate);
        $(`[data-id = ${_couponId}] .coupon-description`).html(inputDescription);


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
}
$(initalizeCouponApp);
