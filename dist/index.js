/**
 * area-picker.js v0.0.41
 * (c) 2017 yuronghui
 * @license MIT
 */
"use strict";

var _createClass = function() {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }
    return function(Constructor, protoProps, staticProps) {
        if (protoProps) defineProperties(Constructor.prototype, protoProps);
        if (staticProps) defineProperties(Constructor, staticProps);
        return Constructor;
    };
}();

var _templateObject = _taggedTemplateLiteral([ "<div></div>" ], [ "<div></div>" ]);

var _templateObject2 = _taggedTemplateLiteral([ '\n            <div class="lego-area-picker">\n                <input type="hidden" name="', '" value="', '" >\n                ', "\n            </div>\n            " ], [ '\n            <div class="lego-area-picker">\n                <input type="hidden" name="', '" value="', '" >\n                ', "\n            </div>\n            " ]);

var _templateObject3 = _taggedTemplateLiteral([ '<selects id="selects_', '"></selects>' ], [ '<selects id="selects_', '"></selects>' ]);

function _taggedTemplateLiteral(strings, raw) {
    return Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    }));
}

function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}

function _possibleConstructorReturn(self, call) {
    if (!self) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
        throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
        constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
}

var ComView = function(_Lego$UI$Baseview) {
    _inherits(ComView, _Lego$UI$Baseview);
    function ComView() {
        var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        _classCallCheck(this, ComView);
        var options = {
            rootId: 0,
            fieldName: "value",
            width: 120,
            maxHeight: 300,
            name: "",
            nameArr: [ "province", "city", "area" ],
            placeholder: [ "请选择省份", "请选择城市", "请选择区域" ],
            value: [],
            selectOpts: {},
            onChange: function onChange() {}
        };
        Object.assign(options, opts);
        return _possibleConstructorReturn(this, (ComView.__proto__ || Object.getPrototypeOf(ComView)).call(this, options));
    }
    _createClass(ComView, [ {
        key: "components",
        value: function components() {
            var _this2 = this;
            var opts = this.options, that = this;
            this.dataKeyMap = {};
            this.dataValueMap = {};
            if (opts.value) opts.value = typeof opts.value == "function" ? val(opts.value) : opts.value;
            if (!Array.isArray(opts.nameArr)) opts.nameArr = [ opts.nameArr ];
            if (opts.data) {
                var filterData = function filterData(pId) {
                    var newData = [], data = opts.data[pId];
                    for (var _key in data) {
                        newData.push({
                            key: _key,
                            value: data[_key]
                        });
                    }
                    return newData;
                };
                var _updateSelect = function _updateSelect(name, parentId) {
                    var index = opts.nameArr.indexOf(name), theData = filterData(parentId);
                    if (index > -1) {
                        var selectsView = Lego.getView("#selects_" + name);
                        if (selectsView) {
                            selectsView.options.value = [];
                            selectsView.options.data = theData;
                            selectsView.refresh();
                            _updateSelect(opts.nameArr[index + 1], 0);
                        }
                    }
                };
                for (var key in opts.data) {
                    for (var subKey in opts.data[key]) {
                        this.dataKeyMap[subKey] = this.dataValueMap[opts.data[key][subKey]] = {
                            key: subKey,
                            value: opts.data[key][subKey],
                            parentId: key
                        };
                    }
                }
                opts.nameArr.forEach(function(value, index) {
                    var model = opts.fieldName == "value" ? _this2.dataValueMap[opts.value[index]] : _this2.dataKeyMap[opts.value[index]];
                    var selectViewOpt = {
                        el: "#selects_" + value,
                        listener: {},
                        name: value,
                        fieldName: opts.fieldName,
                        placeholder: opts.placeholder[index],
                        dropdownHeight: opts.maxHeight,
                        data: !index ? filterData(opts.rootId) : model ? filterData(model.parentId) : [],
                        value: model ? [ model ] : [],
                        onChange: function onChange(self, result) {
                            if (!index) opts.value = [];
                            opts.value[index] = result[opts.fieldName];
                            if (opts.nameArr[index + 1]) {
                                _updateSelect(opts.nameArr[index + 1], result.key);
                            } else {
                                that.getValue();
                                if (typeof opts.onChange == "function") opts.onChange(that, opts.value);
                            }
                        }
                    };
                    selectViewOpt.listener["updateAreaSelect_" + opts.vid + "_" + index] = function(data) {
                        if (data) {
                            var _model = opts.fieldName == "value" ? that.dataValueMap[data] : that.dataKeyMap[data];
                            this.options.value = _model ? [ _model ] : [];
                            this.refresh();
                        }
                    };
                    that.addCom(Object.assign(selectViewOpt, opts.selectOpts));
                });
            }
        }
    }, {
        key: "render",
        value: function render() {
            var opts = this.options, vDom = hx(_templateObject);
            if (opts.value) opts.value = typeof opts.value == "function" ? val(opts.value) : opts.value;
            if (opts.data) {
                vDom = hx(_templateObject2, opts.name, opts.value.length ? opts.value.join(",") : "", opts.nameArr.map(function(value) {
                    return hx(_templateObject3, value);
                }));
            }
            return vDom;
        }
    }, {
        key: "renderAfter",
        value: function renderAfter() {
            var opts = this.options;
            this.$(".select").width(this.options.width);
            if (opts.value.length) {
                opts.value.forEach(function(item, index) {
                    Lego.Eventer.trigger("updateAreaSelect_" + opts.vid + "_" + index, item);
                });
            }
        }
    }, {
        key: "getValue",
        value: function getValue() {
            var opts = this.options, theValue = "", inputEl = this.$("input[name=" + opts.name + "]");
            theValue = opts.value.join(",");
            inputEl.val(theValue).valid();
            return opts.value;
        }
    } ]);
    return ComView;
}(Lego.UI.Baseview);

Lego.components("areapicker", ComView);

module.exports = ComView;
