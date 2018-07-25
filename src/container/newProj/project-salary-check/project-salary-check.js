import React from 'react';
import fetch from 'common/js/fetch';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/newProj/project-salary-check';
import { getQueryString, showSucMsg } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getBankNameByCode } from 'api/project';
import { getUserId } from 'api/user';
// 不用
@DetailWrapper(
  state => state.newProjProjectSalaryCheck,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class ProjectSalaryCheck extends React.Component {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  render() {
    const fields = [{
      field: 'name',
      title: '姓名',
      required: true
    }, {
      field: 'place',
      title: '籍贯',
      required: true
    }, {
      field: 'mobile',
      title: '手机号',
      mobile: true,
      required: true
    }, {
      field: 'idType',
      title: '证件类型',
      type: 'select',
      key: 'id_type',
      required: true
    }, {
      field: 'idNo',
      title: '证件号',
      required: true
    }, {
      field: 'bankName',
      title: '银行名称',
      type: this.view ? '' : 'select',
      listCode: '631116',
      keyName: 'bankCode',
      valueName: 'bankName',
      _keys: ['bankCard', 'bankName'],
      required: true
    }, {
      field: 'subbranch',
      title: '开户行',
      _keys: ['bankCard', 'subbranch'],
      required: true
    }, {
      field: 'bankcardNumber',
      title: '银行卡号',
      _keys: ['bankCard', 'bankcardNumber'],
      required: true
    }, {
      field: 'pict1',
      title: '免冠照片',
      single: true,
      type: 'img',
      required: true
    }, {
      field: 'pict2',
      title: '手持身份证照片',
      single: true,
      type: 'img',
      required: true
    }, {
      field: 'pict3',
      title: '身份证正反面照片',
      single: true,
      type: 'img',
      required: true
    }, {
      field: 'remark',
      title: '备注'
    }];
    return this.props.buildDetail({
      fields,
      code: this.code,
      view: this.view,
      addCode: 631410,
      detailCode: 631417,
      editCode: 631412,
      buttons: this.view ? [] : [{
        title: '保存',
        check: true,
        handler: (param) => {
          getBankNameByCode(param.bankName).then(data => {
            param.bankCode = data[0].bankCode;
            param.bankName = data[0].bankName;
            param.updater = getUserId();
            this.props.doFetching();
            var code = this.code ? '631412' : '631410';
            console.log(code);
            fetch(code, param).then(() => {
              showSucMsg('操作成功');
              this.props.cancelFetching();
              setTimeout(() => {
                this.props.history.go(-1);
              }, 1000);
            }).catch(this.props.cancelFetching);
          });
        }
      }]
    });
  }
}

export default ProjectSalaryCheck;
