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
            <span class="icons icon-budicon-classic edit-icon js-edit-icon" alt="edit-icon"></span>
            <span class="icons icon-budicon-classic-2 delete-icon js-delete-icon" alt="delete-icon"></span>
        </div>
        <h2 class="coupon-merchant-name">${res.merchantName}</h2>
        <p class="coupon-code">${res.code}</p>
        <p class="coupon-expiration-date">Valid til ${res.expirationDate}</p>
        <p class="coupon-description">${res.description}</p>
        <p class="coupon-description">${res._id}</p>
    </section>`;
}

function watchSubmitAddNewCouponHandler(){
    $('#js-submit-add-coupon-btn').on('click', (e) => {
        event.preventDefault();
        console.log('you added a coupon');
        $('.modal').modal('toggle');
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
        console.log(couponId);
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

function initalizeCouponApp() {
    watchSubmitAddNewCouponHandler();
    watchDeleteBtnHandler();
}
$(initalizeCouponApp);
