/**
 * 组件类: 地区选择器
 * 作者: yuronghui
 * 创建日期: 2017/5/28
 */
import './asset/index.scss';

class ComView extends Lego.UI.Baseview {
    constructor(opts = {}) {
        const options = {
            rootId: 0,
            fieldName: 'value',
            width: 120,
            maxHeight: 300,
            name: '',
            nameArr: ['province', 'city', 'area'], //表单域名称 国家country, 省province, 市city, 区area
            placeholder: ['请选择省份', '请选择城市', '请选择区域'],
            value: [],
            selectOpts: {},
            onChange(){}
        };
        Object.assign(options, opts);
        super(options);
    }
    components(){
        let opts = this.options,
            that = this;
        this.dataKeyMap = {};
        this.dataValueMap = {};
        if(opts.value) opts.value = typeof opts.value == 'function' ? val(opts.value) : opts.value;
        if(!Array.isArray(opts.nameArr)) opts.nameArr = [opts.nameArr];
        if(opts.data){
            for(let key in opts.data){
                for(let subKey in opts.data[key]){
                    this.dataKeyMap[subKey] = this.dataValueMap[opts.data[key][subKey]] = {
                        key: subKey,
                        value: opts.data[key][subKey],
                        parentId: key
                    };
                }
            }
            function filterData(pId){
                let newData = [],
                    data = opts.data[pId];
                for(let key in data){
                    newData.push({
                        key: key,
                        value: data[key]
                    });
                }
                return newData;
            }
            function updateSelect(name, parentId){
                let index = opts.nameArr.indexOf(name),
                    theData = filterData(parentId);
                if(index > -1){
                    let selectsView = Lego.getView('#selects_' + name);
                    if(selectsView){
                        selectsView.options.value = [];
                        selectsView.options.data = theData;
                        selectsView.refresh();
                        updateSelect(opts.nameArr[index + 1], 0);
                    }
                }
            }
            opts.nameArr.forEach((value, index) => {
                let model = opts.fieldName == 'value' ? this.dataValueMap[opts.value[index]] : this.dataKeyMap[opts.value[index]];
                let selectViewOpt = {
                    el: '#selects_' + value,
                    listener: {},
                    name: value,
                    fieldName: opts.fieldName,
                    placeholder: opts.placeholder[index],
                    dropdownHeight: opts.maxHeight,
                    data: !index ? filterData(opts.rootId) : (model ? filterData(model.parentId) : []),
                    value: model ? [model] : [],
                    onChange(self, result) {
                        if(!index) opts.value = [];
                        opts.value[index] = result[opts.fieldName];
                        if(opts.nameArr[index + 1]){
                            updateSelect(opts.nameArr[index + 1], result.key);
                        }else{
                            that.getValue();
                            if(typeof opts.onChange == 'function') opts.onChange(that, opts.value);
                        }
                    }
                };
                selectViewOpt.listener[`updateAreaSelect_${opts.vid}_${index}`] = function(data){
                    if(data){
                        let _model = opts.fieldName == 'value' ? that.dataValueMap[data] : that.dataKeyMap[data];
                        this.options.value = _model ? [_model] : [];
                        this.refresh();
                    }
                };
                that.addCom(Object.assign(selectViewOpt, opts.selectOpts));
            });
        }
    }
    render() {
        let opts = this.options,
            vDom = hx`<div></div>`;
        if(opts.value) opts.value = typeof opts.value == 'function' ? val(opts.value) : opts.value;
        if(opts.data){
            vDom = hx`
            <div class="lego-area-picker">
                <input type="hidden" name="${opts.name}" value="${opts.value.length ? opts.value.join(',') : ''}" >
                ${opts.nameArr.map(value => hx`<selects id="selects_${value}"></selects>`)}
            </div>
            `;
        }
        return vDom;
    }
    renderAfter(){
        let opts = this.options;
        this.$('.select').width(this.options.width);
        if(opts.value.length){
            opts.value.forEach((item, index) => {
                Lego.Eventer.trigger(`updateAreaSelect_${opts.vid}_${index}`, item);
            });
        }
    }
    getValue(){
        let opts = this.options,
            theValue = '',
            inputEl = this.$('input[name=' + opts.name + ']');
        theValue = opts.value.join(',');
        inputEl.val(theValue).valid();
        return opts.value;
    }
}
Lego.components('areapicker', ComView);
export default ComView;
