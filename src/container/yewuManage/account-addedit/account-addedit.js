import React from 'react';
import fetch from 'common/js/fetch';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/yewuManage/account-addedit';
import { getQueryString, showSucMsg } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getBankNameByCode } from 'api/project';
import { getUserId } from 'api/user';

@DetailWrapper(
  state => state.yewuManageAccountAddEdit,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class AccountAddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  render() {
    const fields = [{
      field: 'code',
      value: this.code,
      hidden: true
    }, {
      field: 'projectName',
      title: '工程名称',
      readonly: true
    }, {
      field: 'bankSubbranch',
      title: '开户行'
    }, {
      field: 'accountName',
      title: '户名',
      required: true
    }, {
      field: 'bankcardNumber',
      title: '银行卡号',
      required: true
    }, {
      field: 'status',
      title: '状态',
      key: 'account_status',
      type: 'select',
      search: true,
      readonly: true
    }];
    // 修改
    const fieldso = [{
      field: 'code',
      value: this.code,
      hidden: true
    }, {
      field: 'projectName',
      title: '工程名称',
      readonly: true
    }, {
      field: 'bankSubbranch',
      title: '开户行',
      type: 'select',
      listCode: '631106',
      keyName: 'code',
      valueName: 'bankSubbranchName',
      required: true
    }, {
      field: 'accountName',
      title: '户名',
      required: true
    }, {
      field: 'bankcardNumber',
      title: '银行卡号',
      required: true
    }, {
      field: 'status',
      title: '状态',
      key: 'account_status',
      type: 'select',
      search: true,
      readonly: true
    }];
    return this.props.buildDetail({
      fields: this.view ? fields : fieldso,
      code: this.code,
      view: this.view,
      detailCode: 631367,
      editCode: 631362,
      beforeSubmit: (params) => {
        for (let i = 0; i < this.props.selectData.bankSubbranch.length; i++) {
          console.log(params.bankName);
          console.log(this.props.selectData.bankSubbranch[i]);
          if (params.bankSubbranch === this.props.selectData.bankSubbranch[i].bankSubbranchName || params.bankSubbranch === this.props.selectData.bankSubbranch[i].code) {
            params.bankName = this.props.selectData.bankSubbranch[i].bankName;
            params.bankCode = this.props.selectData.bankSubbranch[i].bankCode;
            params.subbranch = this.props.selectData.bankSubbranch[i].subbranchName;
          }
        }
        return params;
      }
    });
  }
}

export default AccountAddEdit;
