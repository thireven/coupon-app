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
    <section role="region" class="coupon-container js-coupon-container" data-id="<%= coupon._id %>">
        <div class="coupon-actions-nav">
            <span class="icons icon-budicon-classic edit-icon js-edit-icon" alt="edit-icon"></span>
            <span class="icons icon-budicon-classic-2 delete-icon js-delete-icon" alt="delete-icon"></span>
        </div>
        <h2 class="coupon-merchant-name">
            ${res.merchantName}
        </h2>
        <p class="coupon-code">
            ${res.code}
        </p>
        <p class="coupon-expiration-date">
            Valid til
            ${res.expirationDate}
        </p>
        <p class="coupon-description">
            ${res.description}
        </p>
    </section>`;
}

function watchSubmitAddNewCoupon(){
    $('#js-submit-add-coupon-btn').on('click', (e) => {
        event.preventDefault();
        console.log('you added a coupon');
        $('.modal').modal('toggle');
        //do a call to post coupon to db with endpoint /coupon
        sendDataToAPI();
    });
}

function sendDataToAPI() {
    $.ajax({
  		url: '/coupon',
      data: {
        merchantName: $('#merchantName').val(),
        code: $('#code').val(),
        expirationDate: $('#expirationDate').val(),
        description: $('#description').val()
      },
  		type: 'POST',
  		success: function(res){
        console.log(res);
        $('#merchantName').val('');
        $('#code').val('');
        $('#expirationDate').val('');
        $('#description').val('');
        $('.js-coupon-section').append(renderCoupons(res));
  		},
  		error: function(err){
        console.log("something went wrong");
  		}
  	});
}

function watchDeleteBtn() {
    $('.js-delete-icon').on('click', function(e) {
        e.preventDefault();
        console.log("delete coupon");
        let couponId = $(".js-coupon-container").attr("data-id");
        console.log(couponId);
        deleteCouponFromApi()
    });
}

function deleteCouponFromApi() {
    const settings = {
        url: `/coupon`,
        type: 'DELETE',
        dataType: 'json',
        success: function(res) {
          console.log("you deleted a coupon");
        }
    };
}



function initalizeCouponApp() {
    watchSubmitAddNewCoupon();
    watchDeleteBtn();
}
$(initalizeCouponApp);
//when add btn is clicked then I want to render form
//then when user clicks the add coupon btn then
//it will submit the form and hit hit endpoint and enter in DB
//it will then re-render the db results
