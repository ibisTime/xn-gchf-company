import React from 'react';
import originJsonp from 'jsonp';
import fetch from 'common/js/fetch';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/staff/bankCard-addedit';
import { getQueryString, showSucMsg, showWarnMsg } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getBankNameByCode } from 'api/project';
import { getUserId } from 'api/user';

@DetailWrapper(
  state => state.staffBankCardAddEdit,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)

class BankCardAddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  jsonp = (url, data, option) => {
    return new Promise((resolve, reject) => {
        originJsonp(url, {
            name: 'getinfo'
        }, (err, data) => {
        if(!err) {
            resolve(data);
        } else {
            reject(err);
        }
        });
    });
  }
  getbankcard = () => {
    this.jsonp('http://127.0.0.1:8080/readbankcard')
          .then((res) => {
              console.log(res);
              this.setState({
                bankcardNumber: res.CardNo
              });
            this.props.form.setFieldsValue({
              bankcardNumber: this.state.bankcardNumber
            });
          }).catch(() => {
              this.setState({ spanText: '读取银行卡号' });
              showWarnMsg('银行卡号读取失败，请把银行卡放置准确后再次读取');
          });
  }
  render() {
    const fields = [{
      field: 'staffCode',
      title: '员工编号',
      readonly: true,
      hidden: true
    }, {
      field: 'staffName',
      title: '真实姓名',
      readonly: true
    }, {
      field: 'bankSubbranchName',
      title: '开户行',
      type: 'select',
      listCode: '631106',
      keyName: 'code',
      valueName: 'bankSubbranchName',
      required: true
    }, {
      field: 'bankcardNumber',
      title: '银行卡号',
      type: 'buttonEvent',
      event: this.getbankcard,
      buttonTitle: '读取银行卡号',
      required: true
    }, {
      field: 'remark',
      title: '备注'
    }];
    const fieldos = [{
      field: 'staffCode',
      title: '员工编号',
      readonly: true,
      hidden: true
    }, {
      field: 'staffName',
      title: '真实姓名',
      readonly: true
    }, {
      field: 'projectName',
      title: '项目名称'
    }, {
      field: 'bankSubbranchName',
      title: '开户行'
    }, {
      field: 'bankcardNumber',
      title: '银行卡号',
      required: true
    }, {
      field: 'remark',
      title: '备注'
    }];
    return this.props.buildDetail({
      fields: this.view ? fieldos : fields,
      code: this.code,
      view: this.view,
      detailCode: 631427,
      editCode: 631422,
      beforeSubmit: (params) => {
        for (let i = 0; i < this.props.selectData.bankSubbranchName.length; i++) {
          if (params.bankSubbranchName === this.props.selectData.bankSubbranchName[i].bankSubbranchName || params.bankSubbranchName === this.props.selectData.bankSubbranchName[i].code) {
            params.bankName = this.props.selectData.bankSubbranchName[i].bankName;
            params.bankCode = this.props.selectData.bankSubbranchName[i].bankCode;
            params.subbranch = this.props.selectData.bankSubbranchName[i].subbranchName;
          }
        }
        return params;
      }
    });
  }
}

export default BankCardAddEdit;
