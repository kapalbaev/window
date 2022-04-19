jQuery(document).ready(function ($) {
    $('input[type=tel]').mask('+Z (000) 000-00-00', {
        translation: {
            'Z': {
                pattern: /[7-8]/,
                fallback: '7'
            }
        }
    });
    refreshInputs();
});

jQuery(function ($) {
    $('[data-link]').on('click', function (e) {
        let n_id = $(this).attr('data-link');
        if ($(n_id).length > 0) {
            let from_top = $(n_id).offset().top;
            $('html,body').stop().animate({scrollTop: from_top}, 1200);
            if ($('.menu-burger').is(':visible')) $(".menu-wrap").slideUp();
        } else {
            window.location = '/' + n_id;
        }
    });

    $('input, select').on('focus', function () {
        $(this).closest('.st-input1').removeClass('st-input1_error');
    });

    $('.js-form2').submit(function () {
        let form = $(this),
            filled = validateForm(form);
        if (filled) {
            $('.ajax-loader').show();
            let formData = new FormData(this),
            zapurl = 'https://hooks.zapier.com/hooks/catch/6233543/b591umg/',
            newDate = new Date();
            formData.append("submittedDate", newDate);
            $.ajax({
                url: zapurl,
                type: 'POST',
                data: formData,
                async: true,
                success: function (msg) {
                    $('.ajax-loader').hide();
                    form.find('input[type="text"],input[type="email"],input[type="tel"],input[type="file"], textarea').each(function () {
                        $(this).val('');
                    });
                    if(form.hasClass('js-form-thanks')) {
                        if (form.hasClass('top-form')) {
                            $('#b01__form-inner3').hide();
                            $('#b01__form-inner4').fadeIn();
                        } else {
                            $('.footer__before-send').hide();
                            $('.footer__after-send').fadeIn();
                        }
                    } else {
                        window.location = '/thanks.html';
                    }
                },
                error: function () {
                    $('.ajax-loader').hide();
                },
                cache: false,
                contentType: false,
                processData: false
            });
        }
        return false;
    });

    $('body').on('focus', '.st-input1__input', function () {
        let parent = $(this).closest('.st-input1');
        $(this).closest('.has-error ').removeClass('has-error');
        parent.addClass('st-input1_focused').addClass('st-input1_filled');
        parent.removeClass('st-input1_error');
        parent.find('.st-input1__error-msg').html('');
    });
    $('body').on('blur', '.st-input1__input', function () {
        let parent = $(this).closest('.st-input1');
        parent.removeClass('st-input1_focused');
        if (!$(this).val()) {
            parent.removeClass('st-input1_filled');
        }
    });
    $('.checkbox_group input').on('change', function () {
        $(this).closest('.checkbox_group').find('.st-input1__error-msg').remove();
    });

    $('.js-open-window2').on('click', function () {
        $('.b07__window1').removeClass('b07__window1_opened');
        $('.b07__window2').addClass('b07__window2_opened');
        $('.js-open-window2-wrap').fadeOut(function () {
            $('.js-open-window1-wrap').fadeIn()
        });
        $('.b07__header1').fadeOut(function () {
            $('.b07__header2').fadeIn()
        })
    })
    $('.js-open-window1').on('click', function () {
        $('.b07__window1').addClass('b07__window1_opened');
        $('.b07__window2').removeClass('b07__window2_opened');
        $('.js-open-window1-wrap').fadeOut(function () {
            $('.js-open-window2-wrap').fadeIn()
        })
        $('.b07__header2').fadeOut(function () {
            $('.b07__header1').fadeIn()
        })
    });
    $('.js-next-step').on('click', function () {
        let parent = $(this).closest('.b01__form-inner');
        if (validateForm(parent)) {
            parent.hide();
            parent.next('.b01__form-inner').fadeIn()
        }
    })

    $('.st-radio1').on('click', function () {
        let parent = $(this).closest('.b01__form-inner'),
            all_filled = true;
        parent.find('.radio_group').each(function (e) {
            let checked = false;
            $(this).find('input[type=radio]').each(function (e) {
                if ($(this).is(':checked')) {
                    checked = true;
                }
            });
            if(!checked)
                all_filled = false;
        });
        parent.find('.st-input1__input').each(function (e) {
            if(!$(this).val())
                all_filled = false;
        });
        if(all_filled)
            parent.find('.js-next-step').click();
    })
});

/**
 * Валидация E-mail
 * @param email
 * @returns {boolean}
 */
function validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

/**
 * Валидация инпута в зависимости от типа
 * @param $input
 * @returns {boolean}
 */
function validateInput($input) {
    let filled = true,
        error = '',
        parent = $input.closest('.st-input1');
    if ($input.attr('type') == 'text') {
        if ($input.val().length < 3) {
            filled = false;
            error = 'Обязательно для заполнения';
        }
    }
    if ($input.attr('type') == 'tel') {
        if ($input.val().length < 18) {
            filled = false;
            error = 'Заполнено некорректно';
        }
    }
    if ($input.attr('type') == 'password') {
        if ($input.val().length < 6) {
            filled = false;
            error = 'Слишком короткий';
        }
        if ($input.attr('name') == 'password-confirm' && $input.val() != $('.input-password').val()) {
            filled = false;
            error = 'Пароли не совпадают';
        }
    }
    if ($input.attr('type') == 'email') {
        if (!validateEmail($input.val())) {
            filled = false;
            error = 'Заполнено некорректно';
        }
    }
    if ($input[0].tagName == 'TEXTAREA') {
        if ($input.val().length < 1) {
            filled = false;
            error = 'Обязательно для заполнения';
        }
    }
    if (!filled) {
        parent.removeClass('st-input1_success');
        parent.addClass('st-input1_error');
    } else {
        parent.addClass('st-input1_success');
        parent.removeClass('st-input1_error')
    }
    parent.find('.st-input1__error-msg').html(error);
    return filled;
}

/**
 * Валидация чекбоксов
 * @param parent
 * @returns {number}
 */
function validateCheckbox(parent) {
    let checked = 0;
    parent.find('input[type=checkbox]').each(function (e) {
        if ($(this).is(':checked')) {
            checked = 1;
        }
    });
    if (!checked) {
        parent.find('.st-input1__error-msg').html('Выберите хотя бы один вариант');
    }
    return checked;
}

/**
 * Валидация радио
 * @param parent
 * @returns {number}
 */
function validateRadio(parent) {
    let checked = 0;
    parent.find('input[type=radio]').each(function (e) {
        if ($(this).is(':checked')) {
            checked = 1;
        }
    });
    if (!checked) {
        parent.find('.st-input1__error-msg').html('Choose one');
    }
    return checked;
}

/**
 * Валидация формы
 * @param form
 * @returns {boolean}
 */
function validateForm(form) {
    let filled = true;
    form.find('.required').each(function () {
        let result = validateInput($(this));
        if (filled) filled = result
    });
    form.find('.checkbox_group').each(function () {
        let result = validateCheckbox($(this));
        if (filled) filled = result
    });
    form.find('.radio_group').each(function () {
        let result = validateRadio($(this));
        if (filled) filled = result
    });
    console.log(filled)
    return filled;
}

/**
 * изменяет класс лейбла у формы, если инпут заполнен
 */
function refreshInputs() {
    $('.st-input1__input').each(function () {
        if ($(this).val()) {
            $(this).closest('.st-input1').addClass('st-input1_filled');
        }
    });
}