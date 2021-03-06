﻿//格式化
z.DC["dataurl_colformat"] = {
    data: [
        { value: "0", text: "无格式化" },
        { value: "col_custom_", text: "col_custom_+小写字段名（自定义）" },
        { value: "11", text: "yyyy-MM" },
        { value: "12", text: "HH:mm:ss" },
        { value: "13", text: "yyyy-MM-dd HH:mm:ss" },
        { value: "14", text: "yyyy-MM-dd" },
        { value: "15", text: "精确两位" },
        { value: "16", text: "确两位 带￥" },
        { value: "17", text: "1√ 0×" },
        { value: "18", text: "1× 0√" },
        { value: "19", text: "1正常 0停用" }
    ]
};
//“格式化”格式化
function col_custom_colformat(value) {
    $(z.DC["dataurl_colformat"].data).each(function () {
        if (this.value == value) {
            value = this.text;
            return false;
        }
    });
    return value;
}
//输入类型
z.DC["dataurl_formtype"] = {
    //绑定数据
    data: [
        { value: "text", text: "text 文本" },
        { value: "textarea", text: "textarea 文本域" },
        { value: "combobox", text: "combobox 下拉列表框" },
        { value: "combotree", text: "combotree 下拉列表树" },
        { value: "modal", text: "modal 模态弹出（浏览）" },
        { value: "checkbox", text: "checkbox 复选框" },
        { value: "password", text: "password 密码框" },
        { value: "datetime", text: "yyyy-MM-dd HH:mm:ss 日期时间" },
        { value: "date", text: "yyyy-MM-dd 日期" },
        { value: "time", text: "HH:mm:ss 时间" },
        { value: "calc", text: "calc 计算器" }
    ],
    //绑定数据前回调
    init: function (obj) {
        //this和obj 都是 z.Combo构造的对象（obj参数可以不要，直接用this）
        //允许编辑
        this.editable = true; //obj.editable = true;
    }
};
//跨列
z.DC["dataurl_formspan"] = {
    data: [
        { value: 1, text: "半排", selected: true },
        { value: 2, text: "整排" }
    ],
    init: function () {
        this.panelHeight = 100;
    }
};
//跨列格式化
function col_custom_formspan(value) {
    $(z.DC["dataurl_formspan"].data).each(function () {
        if (this.value == value) {
            value = this.text;
            return false;
        }
    });
    return value;
}
//对齐方式
z.DC["dataurl_colalign"] = {
    data: [
        { value: 1, text: "居左" },
        { value: 2, text: "居中" },
        { value: 3, text: "居右" }
    ],
    init: function () {
        this.panelHeight = 100;
    }
}
//对齐方式格式化
function col_custom_colalign(value) {
    $(z.DC["dataurl_colalign"].data).each(function () {
        if (this.value == value) {
            value = this.text;
            return false;
        }
    });
    return value;
}
//区域
z.DC["dataurl_formarea"] = {
    data: [
        { value: 1, text: "表格配置" },
        { value: 2, text: "表单配置" }
    ],
    init: function () {
        this.panelHeight = 100;
    }
};
//区域格式化
function col_custom_formarea(value) {
    $(z.DC["dataurl_formarea"].data).each(function () {
        if (this.value == value) {
            value = this.text;
            return false;
        }
    });
    return value;
}

//显示/隐藏
var hideobj = function () {
    return {
        data: [
            { value: 0, text: "显示" },
            { value: 1, text: "隐藏" }
        ],
        init: function () {
            this.panelHeight = 100;
        }
    }
};
z.DC["dataurl_formhide"] = hideobj();
z.DC["dataurl_colhide"] = hideobj();


//载入
var gd1 = z.Grid();
gd1.url = "/Setting/QuerySysTableConfig?tableName=" + z.TableName;
gd1.multiSort = true;
gd1.sortName = "TableName,ColOrder";
gd1.sortOrder = "asc,asc";
gd1.onDblClickRow = function (index, row) {
    //双击行模拟点编辑
    z.buttonClick('edit');
}
gd1.onBeforeLoad = function (row, param) {
    var sq = QueryWhereGet();
    param.wheres = sq.stringify();
}

//方式一：默认载入
//gd1.load();

//方式二：先输入查询条件
//屏蔽 gd1.load();
//模拟点击查询按钮
z.buttonClick('query');

//查询回调
function QueryWhereCallBack() {
    gd1.pageNumber = 1;
    gd1.load();
}

//刷新
z.button('reload', function () {
    gd1.load();
});

//新增
z.button('add', function () {
    //表单标题
    z.FormTitle({
        icon: 0,
        title: '新增表配置'
    });
    $('#fv_modal_1').modal();
});

//查看
z.button('see', function () {
    //获取选中行
    var rowData = gd1.func("getSelected");
    if (rowData) {
        //选中行回填表单
        z.FormEdit(rowData);
        //表单标题
        z.FormTitle({
            icon: 2,
            title: '查看表配置',
            required: false
        });
        //禁用
        z.FormDisabled(true);
        //显示模态框
        $('#fv_modal_1').modal();
    } else {
        art("select");
    }
});
//关闭模态框后
$('#fv_modal_1').on('hidden.bs.modal', function () {
    //是查看时，解除禁用
    if (z.btnTrigger == "see") {
        z.FormDisabled(false);
    }
});

//修改
z.button('edit', function () {
    //获取选中行
    var rowData = gd1.func("getSelected");
    if (rowData) {
        //选中行回填表单
        z.FormEdit(rowData);
        //表单标题
        z.FormTitle({
            icon: 1,
            title: '修改表配置'
        });
        //显示模态框
        $('#fv_modal_1').modal();
    } else {
        art("select");
    }
});

//保存
$('#fv_save_1').click(function () {
    //检测必填项
    if (z.FormRequired('red')) {
        $('#fv_save_1')[0].disabled = true;
        $.ajax({
            url: "/Setting/SaveSysTableConfig?savetype=" + z.btnTrigger,
            type: "post",
            data: $("#fv_form_1").serialize(),
            success: function (data) {
                if (data == "success") {
                    //新增成功，重新载入
                    if (z.btnTrigger == "add") {
                        gd1.load();
                    } else {
                        //编辑成功，修改行
                        gd1.func("updateRow", {
                            index: gd1.func('getRowIndex', gd1.func('getSelected')),
                            row: z.FormToJson()
                        });
                    }
                    $('#fv_modal_1').modal('hide');
                } else {
                    art('fail');
                }
            },
            error: function () {
                art('error');
            }
        });

        $('#fv_save_1')[0].disabled = false;
    }
});

//删除
z.button('del', function () {
    var rowData = gd1.func("getSelected");
    if (!rowData) {
        art('select');
        return false;
    }
    art('确定删除选中的行', function () {
        $.ajax({
            url: "/Setting/DelSysTableConfig?id=" + rowData.Id,
            type: "post",
            success: function (data) {
                if (data == "success") {
                    gd1.load();
                } else {
                    art('fail');
                }
            }
        })
    });
});