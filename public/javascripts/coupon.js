/*
Coupons
    1. add functionality to add
        then needs to re-render page results
    2. add functionality to delete
        then needs to re-render page results
    3. add functionality to edit
        then needs to re-render page results
*/

function watchSubmitAddNewCoupon(){
    $('#js-submit-add-coupon-btn').on('click', (e) => {
        event.preventDefault();
        console.log('you added a coupon');
        $('.modal').modal('toggle');
        //do a call to post coupon to db with endpoint /coupon
        sendDataToAPI();
        $('#merchantName').val("");
        $('#code').val("");
        $('#expirationDate').val("");
        $('#description').val("");
    });
}

function sendDataToAPI() {

    const settings = {
        url: '/coupon',
        data: {
            merchantName: $('#merchantName').val(),
            code: $('#code').val(),
            expirationDate: $('#expirationDate').val(),
            description: $('#description').val()
        },
        type: 'POST',
        //dataType: 'application/x-www-form-urlencoded',
        dataType: 'json',
        success: function(res) {
            console.log(res);
        }
    }
    $.ajax(settings);
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
