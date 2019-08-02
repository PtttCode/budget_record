/**
 * Created by  Doyle on 2018年3月6日17点09分
 * layui表单增加插件
 * 
 * 
 * 
 */
layui.define(['jquery', 'form'],
    function(exports) {
        var $ = layui.jquery,
            form = layui.form,
            formObj,
            hint = layui.hint();
        var EnhanceForm = function(options) {
            this.options = options;
            formObj = $(options.elem);
        };
        /**
         * 设置select选中值
         * @param {String} name 对象名称，指“name”
         * @param {String} val 值
         * @param {Boolean} isOnSelect 是否触发选中事件
         * @returns {} 
         */
        EnhanceForm.prototype.setSelectVal = function(name, val, isOnSelect) {
            if (name === undefined) {
                throw "name no undefined";
            }
            formObj.find('select[name="' + name + '"]').val(val);
            form.render('select');
            if (typeof (isOnSelect) === "boolean") {
                if (isOnSelect) {
                    formObj.find("dd[lay-value='" + val + "']").trigger("click");
                }
            }
            return this;
        };
        /**
         * 设置radio选中
         * @param {String} name 对象名称，指“name”
         * @param {String} val 对象值
         * @returns {} 
         */
        EnhanceForm.prototype.setRadioVal = function(name, val) {
            if (name === undefined) {
                throw "name no undefined";
            }
            formObj.find('input[type="radio"][name="' + name + '"][value="' + val + '"]').prop("checked", true);
            form.render('radio');
            return this;
        };
        /**
         * 设置checkbox选中
         * @param {String} name 对象名称，指“name”
         * @returns {} 
         */
        EnhanceForm.prototype.setCheckboxVal = function(name) {
            if (name === undefined) {
                throw "name no undefined";
            }
            formObj.find('input[type="checkbox"][name="' + name + '"]').prop("checked", true);
            form.render('checkbox');
            return this;
        }
        /**
         * 设置表单元素禁用
         * @param {String} type 类型，select、checkbox、radio
         * @param {String} name  对象名称，指“name”
         * @param {String} val 值，radio元素需要用到
         * @returns {} 
         */
        EnhanceForm.prototype.setElemDisabled = function(type, name, val) {
            switch (type) {
            case "select":
                formObj.find('select[name="' + name + '"]').prop("disabled", true);
                form.render('select');
                break;
            case "checkbox":
                formObj.find('input[type="checkbox"][name="' + name + '"]').prop("disabled", true);
                form.render('checkbox');
                break;
            case "radio":
                if (val === undefined) {
                    throw "val不能为undefined";
                }
                formObj.find('input[type="radio"][name="' + name + '"][value="' + val + '"]').prop("disabled", true);
                form.render('radio');
                break;
            default:
                hint.error('layui.enhanceform 不支持该类型，type：' + type);
            }
            return this;
        }
        /**
         * 表单填充
         * @param {Object} data 
         * @returns {} 
         */
        EnhanceForm.prototype.filling = function(data) {
            if (typeof data !== "object") {
                throw "data no object";
            }
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var inputs = formObj.find('input[name = "' + key + '"]');
                    if (inputs.length > 0) {
                        var input = inputs[0];
                        switch (input.type) {
                        case "text":
                            input.value = data[key];
                            break;
                        case "hidden":
                            input.value = data[key];
                            break;
                        case "radio":
                            this.setRadioVal(key, data[key]);
                            break;
                        case "checkbox":
                            if (data[key] === true) {
                                this.setCheckboxVal(key, data[key]);
                            }
                            break;
                        }
                    } else {
                        var select = formObj.find('select[name="' + key + '"]');
                        if (select.length > 0) {
                            this.setSelectVal(key, data[key], true);
                        }
                    }
                }
            }
            return this;
        };
        /**
         * 接口输出
         */
        exports('enhanceform',
            function(options) {
                var enhance = new EnhanceForm(options = options || {});
                var elem = $(options.elem);
                if (!elem[0]) {
                    return hint.error('layui.enhanceform 没有找到' + options.elem + '元素');
                }
                return enhance;
            });
    });