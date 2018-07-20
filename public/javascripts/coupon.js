'use strict';

let currentCouponId = null;

function renderCoupons(res, companyLogoImage, companyUrl) {
  return`<section role="role" class="all-coupon-container" data-id="${res._id}">
            <section role="region" class="coupon-container js-coupon-container coupon-active">
              <div class="js-coupon-merchant-logo">
                <a href="${companyUrl}" target="_blank">
                  <img src="${companyLogoImage}" alt="This is an image of the ${res.merchantName} logo" class="coupon-merchant-logo js-logo-img" data-default-src="images/default-image.png">
                </a>
              </div>
              <h2 class="coupon-merchant-name">${res.merchantName}</h2>
              <p class="coupon-description">${res.description}</p>
              <div class="dashed">
                <img src="images/dashed-line.png" alt="dashed line active" class="dashed-line-active">
                <img src="images/dashed-line-disable.png" alt="dashed line disable" class="dashed-line-disabled hide">
              </div>
              <p class="coupon-title">COUPON CODE</p>
              <p class="coupon-code js-coupon-code">${res.code}</p>
              <p class="coupon-expiration-date">Valid till ${res.expirationDate}</p>
            </section>
            <section role="region" class="coupon-actions-nav">
              <img src="images/tick-sign.svg" alt="mark coupon used" class="icon complete-icon js-complete-icon" tabindex="4" data-toggle="tooltip" data-placement="top" title="Mark coupon used">
              <a href="" data-toggle="tooltip" data-placement="top" title="Edit coupon" class="icon edit-icon js-edit-icon">
                <img src="images/ui-compose.svg" alt="edit-icon" data-toggle="modal" data-target="#editCouponModal" tabindex="4">
              </a>
              <a href="" data-toggle="tooltip" data-placement="bottom" title="Upload image" class="icon upload-icon js-upload-icon">
                  <img src="images/uploading-ui.svg" alt="Upload an image" data-toggle="modal" data-target="#uploadImageModal" tabindex="4">
              </a>
              <img src="images/trash.svg" alt="This is a trash icon to delete this coupon" class="icon trash-icon js-delete-icon" tabindex="4" data-toggle="tooltip" data-placement="top" title="Delete coupon">
            </section>
          </section>`;
}

function getUserCoupons() {
  $.ajax({
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('Token')}`);
    },
    url: '/coupon/',
    type: 'GET',
    success: function(res) {

      $('.js-logout').removeClass('hide');
      $('.js-coupon').removeClass('hide');

      $('.js-signup').addClass('hide');
      $('.js-login').addClass('hide');

      $(document).ready(function(){
        $('[data-toggle="tooltip"]').tooltip();
      });

      console.log(`The user made it to the Dashboard`);
      console.log(`The user id is: ${res._userId}`);

      var html = "";
      res.coupons.map(function(coupon){
        var str = coupon.merchantName;
        var newStr = str.replace(/\s+/g, '');
        const companyLogoImage = `https://logo.clearbit.com/${newStr}.com?size=500`;
        const companyUrl = `https://www.${newStr}.com`;
        html += renderCoupons(coupon, companyLogoImage, companyUrl);
      });

      $('#coupons').css('opacity', '0');
      $('#coupons').html(html);

      //check to see if get request is Valid
      //if not then replace with another image


      $('#coupons').animate({
        opacity: 1,
      }, 150);

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

function renderAddModal() {
  return`<div class="modal fade" id="addNewCouponModal" tabindex="-1" role="dialog" aria-labelledby="addNewCouponModalLabel" aria-hidden="true">
              <div class="modal-dialog" role="document">
                  <div class="modal-content">
                      <div class="modal-header">
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                          </button>
                      </div>
                      <div class="modal-body">
                          <h5 class="modal-title" id="addNewCouponModalLabel">Add new coupon</h5>
                          <form id="js-add-coupon-form">
                              <div class="form-group">
                                  <label for="merchantName">Merchant Name</label>
                                  <input type="text" name="merchantName" class="form-control input-add-merchantName" required>
                              </div>

                              <div class="form-group">
                                  <label for="code">Code</label>
                                  <input type="text" name="code" class="form-control input-add-code" required>
                              </div>

                              <div class="form-group">
                                  <label for="expirationDate">Expiration Date</label>
                                  <input type="date" name="expirationDate" class="form-control input-add-expirationDate js-date-field" min="2018-07-01" max="2020-12-31" required>
                              </div>

                              <div class="form-group">
                                  <label for="description">Description</label>
                                  <input type="text" name="description" class="form-control input-add-description" required>
                              </div>

                              <div class="custom-file">
                                <input type="file" class="custom-file-input" name="couponImage" id="couponImage">
                                <label class="custom-file-label" for="couponImage">Choose Image</label>
                              </div>

                              <div class="">
                                  <button type="submit" class="button solid submit-add-coupon-btn" id="js-submit-add-coupon-btn">Add new coupon</button>
                              </div>
                          </form>
                      </div>
                  </div>
              </div>
          </div>`;
}

function renderEditModal() {
  return `<div class="modal fade" id="editCouponModal" tabindex="-1" role="dialog" aria-labelledby="editCouponModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <h5 class="modal-title" id="editCouponModalLabel">Edit existing coupon</h5>
                            <form id="js-edit-coupon-form">
                                <div class="form-group">
                                    <label for="merchantName">Merchant Name</label>
                                    <input type="text" name="merchantName" class="form-control input-edit-merchantName" required>
                                </div>

                                <div class="form-group">
                                    <label for="code">Code</label>
                                    <input type="text" name="code" class="form-control input-edit-code" required>
                                </div>

                                <div class="form-group">
                                    <label for="expirationDate">Expiration Date</label>
                                    <input type="date" name="expirationDate" class="form-control input-edit-expirationDate js-date-field" required>
                                </div>

                                <div class="form-group">
                                    <label for="description">Description</label>
                                    <input type="text" name="description" class="form-control input-edit-description" required>
                                </div>

                                <div class="">
                                    <button type="submit" class="button solid submit-edit-coupon-btn" id="js-submit-edit-coupon-btn">save edited coupon</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>`;
}

function renderUploadImageModal() {
  return `<div class="modal fade" id="uploadImageModal" tabindex="-1" role="dialog" aria-labelledby="uploadImageModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                  <div class="modal-header">
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                  </div>
                  <div class="modal-body">
                    <form id="js-upload-image-coupon-form">
                      <h5 class="modal-title" id="uploadImageModalLabel">Upload Image</h5>
                        <div class="custom-file">
                          <input type="file" class="custom-file-input" name="couponImage" id="couponImage" required>
                          <label class="custom-file-label" for="couponImage">Choose Image</label>
                        </div>
                      <div class="">
                        <button type="submit" class="button solid submit-upload-image-coupon-btn" id="js-submit-upload-image-coupon-btn">Upload Image</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>`;
}

function watchUploadImageHandler() {
  $('#coupons').on('click','.js-upload-icon', (e) => {
    e.preventDefault();

    $('#uploadImageModelSection').html(renderUploadImageModal());
    $('#uploadImageModal').modal('show');

    currentCouponId = $(e.currentTarget).parent().parent().attr('data-id');
    console.log(`The coupon id: ${currentCouponId}`);
  });
}

function getFileName(id) {
  // $('#couponImage').on('change', function() {
  //   const fileName = $('#couponImage').val();
  //   console.log(fileName);
  //   // $('#select_file').html(filename);
  //   watchSubmitCouponImage(fileName,id);
  // });

  // $('#couponImage').change(function(e) {
  //   //alert('hi');
  //   var file = e.target.files[0];
  //   console.log(file);
  //   var formData = new FormData();
  //   console.log(formData);
  //   formData.append('couponImage',file);
  //   watchSubmitCouponImage(formData, id);
  // })
}

function watchSubmitCouponImage() {
  $('#uploadImageModelSection').on('submit', '#js-upload-image-coupon-form', (e) => {
      e.preventDefault();
      console.log(e);
      console.log(`The id inside watch SubmitCouponImage ${currentCouponId}`);
      // console.log(formData);
      // console.log('you uploaded an image');
      // $('#uploadImageModal').modal('hide');
      // const couponId = $(e.currentTarget).parent().parent().attr('data-id');
      //console.log(`The coupon id: ${id}: ${fileName}`);
      const formData = new FormData(e.target);
      sendUploadedImageToAPI(currentCouponId, formData);
  });
}

function sendUploadedImageToAPI(id, formData){
  console.log('File name is:' + formData);
  console.log(` ${Object.values(formData)}`);
  console.log('The id is: ' + id);

  $.ajax({
    url: `/coupon/${id}`,
    type: 'PATCH',
    beforeSend: function(xhr) {
      xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('Token')}`);
    },
    //data: {
      // couponImage: $('input[name="myFile"]').val(),
      //couponImage: fileName,
    //},
    data: formData,
    contentType: false,
    processData: false,
    success: function(res){
      //console.log(res);
      console.log('Coupon Image should be uploaded');
    },
    error: function(err){
      console.log('something went wrong');
    }
  });
}

function watchAddBtnHandler() {
  $('.js-add-new-coupon-btn').on('click', (e) => {
    $('#addNewCouponModelSection').html(renderAddModal());
    $('#addNewCouponModal').modal('show');
    setMinDateToTodaysDate();
    watchSubmitAddNewCouponHandler();
  })
}

function watchSubmitAddNewCouponHandler() {
  $('#js-add-coupon-form').on('submit', (e) => {
    e.preventDefault();
    console.log('you added a coupon');
    
    sendAddCouponDataToAPI(e);
  });
}

function sendAddCouponDataToAPI(e) {
  const formData = new FormData(e.target);
  const companyname = $('.input-add-merchantName').val();
  var str = companyname;
  var newStr = str.replace(/\s+/g, '');
  const companyLogoImage = `https://logo.clearbit.com/${newStr}.com?size=500`;
  const companyUrl = `https://www.${newStr}.com`;
    console.log(formData.get('couponImage'));
    $.ajax({
  		url: '/coupon',
      type: 'POST',
      processData: false,
      contentType: false,
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('Token')}`);
      },
      data: formData,
      // dataType:'multipart/form-data',
  		success: function(res){
        $('#addNewCouponModal').modal('hide');
        $('.input-add-merchantName').val('');
        $('.input-add-code').val('');
        $('.input-add-expirationDate').val('');
        $('.input-add-description').val('');

        const couponHTML = $(renderCoupons(res,companyLogoImage,companyUrl));
        couponHTML.css('opacity', '0');
        $('#coupons').append(couponHTML);

        couponHTML.animate({
          opacity: 1,
        }, 500);

        //$('#js-msg-output').show();

        // $('#js-msg-output').html(`<div class="alert alert-success alert-dismissible fade show text-center" role="alert">You have successfully added a coupon!
        //   <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        //     <span aria-hidden="true">&times;</span>
        //   </button>
        //   </div`);

          // setTimeout(() => {
          //    $('#js-msg-output').hide();
          // }, 2000);
  		},
  		error: function(err){
        console.log('something went wrong');
  		}
  	});
}

function watchDeleteBtnHandler() {
  $('#js-list-coupons-section').on('click','.js-delete-icon', (e) => {
      e.preventDefault();
      //const couponId = $(this).parent().parent().attr('data-id');
      currentCouponId = $(e.currentTarget).parent().parent().attr('data-id');
      console.log(`The coupon id: ${currentCouponId}`);
      const container = $(e.currentTarget).parent().parent();
      sendCouponToDeleteFromApi(currentCouponId, container);
    });
}

function sendCouponToDeleteFromApi(id, container) {
  console.log(`if I got here then i should delete this id: ${id} from the DB`);

    $.ajax({
      url: `/coupon/${id}`,
      type: 'DELETE',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('Token')}`);
      },
      dataType: 'json',
      success: function(res) {

        $('.js-delete-icon').tooltip('hide');
        $('.js-complete-icon').tooltip('hide');
        $('.js-upload-icon').tooltip('hide');
        $('.js-edit-icon').tooltip('hide');

        console.log(`you successfully deleted a coupon`);

        container.animate({
          opacity: 0,
        }, 500, function(){
          container.remove();
        });

      },
      error: function(err) {
        console.log(`Something happened when trying to delete ${err}`);
      }
    });
}

function watchEditBtnHandler() {
  $('#coupons').on('click','.js-edit-icon', (e) => {

      e.preventDefault();

      $('#editCouponModelSection').html(renderEditModal());
      //$('#editCouponModal').modal('show');
      setMinDateToTodaysDate();

      currentCouponId = $(e.currentTarget).parent().parent().attr('data-id');
      console.log(`The coupon id: ${currentCouponId}`);

      //get the values currently in the input fields for that getCouponid
      const couponObject = $(e.currentTarget).parent().parent();
      const merchantNameText = $(couponObject).find('h2.coupon-merchant-name').text();
      const codeText = $(couponObject).find('p.coupon-code').text();
      const expirationDateText = $(couponObject).find('p.coupon-expiration-date').text();
      const descriptionText = $(couponObject).find('p.coupon-description').text();

      $('.input-edit-merchantName').val(merchantNameText);
      $('.input-edit-code').val(codeText);
      //$('.input-edit-expirationDate').val(expirationDateText);
      document.querySelector('.input-edit-expirationDate').valueAsDate = new Date(expirationDateText);
      $('.input-edit-description').val(descriptionText);

      //pull the values that the user types in the inputs
      watchSubmitEditCouponHandler(currentCouponId);
  });
}

function watchSubmitEditCouponHandler(id) {
  $('#js-edit-coupon-form').on('submit', (e) => {
      e.preventDefault();
      console.log('you want to update a coupon');
      $('#editCouponModal').modal('hide');
      sendCouponToEditFromApi(id);
  });
}

function sendCouponToEditFromApi(id) {
  const companyname = $('.input-edit-merchantName').val();
  var str = companyname;
  var newStr = str.replace(/\s+/g, '');
  console.log(`merchant name inside edit function ${newStr}`);
  const companyLogoImage = `https://logo.clearbit.com/${newStr}.com?size=500`;
  const companyUrl = `https://www.${newStr}.com`;

  let _couponId = id;

  console.log(`If I got here then I should edit this id: ${id} on the DB`);
    $.ajax({
      url: `/coupon/${id}`,
      type: 'PUT',
      beforeSend: function(xhr) {
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('Token')}`);
      },
      data: {
        merchantName: $('.input-edit-merchantName').val(),
        code: $('.input-edit-code').val(),
        expirationDate: $('.input-edit-expirationDate').val(),
        description: $('.input-edit-description').val()
      },
      dataType: 'json',
      success: function(res) {
        console.log(`you successfully updated a coupon: ${_couponId}`);

        var merchantName = $('.input-edit-merchantName').val();
        var inputCode = $('.input-edit-code').val();
        var expirationDate = $('.input-edit-expirationDate').val();
        var inputDescription = $('.input-edit-description').val();

        console.log('upon success of edit ' + merchantName + ' ' + companyUrl);

        $(`[data-id = ${_couponId}] .js-coupon-merchant-logo a`).attr('href', companyUrl);
        $(`[data-id = ${_couponId}] .js-logo-img`).attr('src', companyLogoImage);
        $(`[data-id = ${_couponId}] .coupon-merchant-name`).html(merchantName);
        $(`[data-id = ${_couponId}] .coupon-code`).html(inputCode);
        $(`[data-id = ${_couponId}] .coupon-expiration-date`).html(`Valid til ${expirationDate}`);
        $(`[data-id = ${_couponId}] .coupon-description`).html(inputDescription);

        // $('#js-msg-output').show();
        //
        // $('#js-msg-output').html(`<div class="alert alert-success alert-dismissible fade show text-center" role="alert">You have successfully edited a coupon!
        //   <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        //     <span aria-hidden="true">&times;</span>
        //   </button>
        //   </div`);

        // setTimeout(() => {
        //   $('#js-msg-output').hide();
        // }, 2000);
      },
      error: function(err) {
        console.log(`Something happened when trying to edit ${err}`);
      }
    });
}

function setMinDateToTodaysDate(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
    if(dd<10){
        dd='0'+dd
    }

    if(mm<10){
        mm='0'+mm
    }

    today = yyyy+'-'+mm+'-'+dd;
    $('.js-date-field').attr("min", today);
}

function companyMaker(merchantName) {
  var str = merchantName;
  var newStr = str.replace(/\s+/g, '');

  const companyInfo = {
    url: `https://www.${newStr}.com`,
    logoImage: `https://logo.clearbit.com/${newStr}.com?size=500`,
    logoImageIsDisabled: `https://logo.clearbit.com/${newStr}.com?size=500&greyscale=true`
  };

  return companyInfo;
}

function markingCouponUsed() {
  $('#coupons').on('click','.js-complete-icon', (e) => {

    $('.js-complete-icon').tooltip('hide');

    const couponContainerObject = $(e.currentTarget).parent().prev();
    const merchantLogoLink = $(couponContainerObject).find('div.js-coupon-merchant-logo').children();

    //dashed png
    const dashDisabled = $(couponContainerObject).find('img.dashed-line-disabled');
    const dashed = $(couponContainerObject).find('img.dashed-line-active');


    merchantLogoLink.children().attr('src');
    const merchantName = $(couponContainerObject).find('h2.coupon-merchant-name').text();

    var str = merchantName;
    var newStr = str.replace(/\s+/g, '');
    const companyLogoImageIsDisabled = `https://logo.clearbit.com/${newStr}.com?size=500&greyscale=true`;

    if(merchantLogoLink.attr('href')){
      const link = merchantLogoLink.attr('href');
    }
    else {
      const companyUrl = `https://www.${newStr}.com`;
      const companyLogoImage = `https://logo.clearbit.com/${newStr}.com?size=500`;
      merchantLogoLink.children().attr('src', companyLogoImage);
      merchantLogoLink.attr('href', companyUrl);
    }

    if(couponContainerObject.hasClass('coupon-disabled')){
      couponContainerObject.removeClass('coupon-disabled');
      couponContainerObject.addClass('coupon-active');
      dashed.removeClass('hide');
      dashDisabled.addClass('hide');
      //console.log('toggle and turn to coupon active');
    }
    else if(couponContainerObject.hasClass('coupon-active')){
      couponContainerObject.removeClass('coupon-active');
      couponContainerObject.addClass('coupon-disabled');
      merchantLogoLink.children().attr('src', companyLogoImageIsDisabled);
      merchantLogoLink.removeAttr('href');
      dashed.addClass('hide');
      dashDisabled.removeClass('hide');
      //console.log('toggle and turn to coupon disabled');
    }
    else{
      console.log(`${couponContainerObject}`);
      console.log("something went wrong with marking coupon!");
    }
  });
}

/*
function markingCouponUsed() {
  $('#coupons').on('click','.coupon-container', (e) => {
    console.log('Do you want to mark this coupon as used');
    //const couponId = $(e.currentTarget).data('id');
    const couponContainerObject = $(e.currentTarget).children().children();
    //console.log(couponContainerObject);
    const merchantLogo = $(couponContainerObject).find('img.coupon-merchant-logo.js-logo-img').addClass('test');
    //console.log(merchantLogo);

    if($(e.currentTarget).hasClass('coupon-disabled')){
      $(e.currentTarget).removeClass('coupon-disabled');
      $(e.currentTarget).addClass('coupon-active');
      console.log('toggle and turn to coupon active');
    }
    else if($(e.currentTarget).hasClass('coupon-active')){
      $(e.currentTarget).removeClass('coupon-active');
      $(e.currentTarget).addClass('coupon-disabled');
      console.log('toggle and turn to coupon disabled');
    }
    else{
      console.log("something went wrong with marking coupon!");
    }
  });
}
*/

/* NOT USING BC OF COMPLEXITY THIS ASK MENTOR....
function getCompanyLogoImageDataFromApi(searchTerm) {
  var str = searchTerm;
  var newStr = str.replace(/\s+/g, '');
  //console.log(`This string should not have spaces ${newStr}`);
  $.ajax({
    url: `https://logo.clearbit.com/${newStr}.com?size=134`,
    type: 'GET',
    mimeType: 'text/plain; charset=x-user-defined',
    success: function(res){
      const baseEncoded = base64Encode(res);
    },
    error: function(res) {
      console.log('There is an err at getCompanyLogoImageDataFromApi. Load a default image that is 134px wide.');
    }
  });
}
function base64Encode(str) {
  var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var out = "", i = 0, len = str.length, c1, c2, c3;
  while (i < len) {
      c1 = str.charCodeAt(i++) & 0xff;
      if (i == len) {
          out += CHARS.charAt(c1 >> 2);
          out += CHARS.charAt((c1 & 0x3) << 4);
          out += "==";
          break;
      }
      c2 = str.charCodeAt(i++);
      if (i == len) {
          out += CHARS.charAt(c1 >> 2);
          out += CHARS.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
          out += CHARS.charAt((c2 & 0xF) << 2);
          out += "=";
          break;
      }
      c3 = str.charCodeAt(i++);
      out += CHARS.charAt(c1 >> 2);
      out += CHARS.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      out += CHARS.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
      out += CHARS.charAt(c3 & 0x3F);
  }
  return out;
}
*/

function initalizeCouponApp() {
    watchSubmitCouponImage();
    getUserCoupons();
    watchAddBtnHandler();
    watchDeleteBtnHandler();
    watchEditBtnHandler();
    markingCouponUsed();
    watchUploadImageHandler();
}

$(initalizeCouponApp);
