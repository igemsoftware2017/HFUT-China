    $(function () {
        $('.tip-container ').click(function () {
            var tipcon = '<div class="tip-input">' +
                '<div  style="height:auto;width:auto;padding:2px;border:#eee solid 1px;" >Medicine&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
                '<span class="del"></span>' +
                '</div>';
            $('.tip').prepend(tipcon);
            // 删除表单
            $('.del').click(function () {
                $(this).parent().remove();
            });
        });

    });
