import React from 'react';
import fetch from 'common/js/fetch';
import cookies from 'browser-cookies';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/staff/allStaff-addBankCard';
import { getQueryString, showSucMsg, formatDate, getUserKind } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getBankNameByCode } from 'api/project';
import { getUserId, getUserDetail } from 'api/user';

@DetailWrapper(
  state => state.staffAllStaffAddBankCard,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class AllStaffAddBankCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyCode: ''
    };
    this.code = getQueryString('code', this.props.location.search);
    this.name = getQueryString('name', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  componentDidMount() {
    if (getUserKind() === 'O') {
      getUserDetail(getUserId()).then((data) => {
        console.log(data.companyCode);
        this.setState({ companyCode: data.companyCode });
      });
    };
  }
  render() {
    const fields = [{
      field: 'code1',
      title: '开户行',
      type: this.view ? null : 'select',
      listCode: '631106',
      keyName: 'code',
      valueName: 'bankSubbranchName',
      _keys: ['companyCard', 'bankSubbranch'],
      required: true
    }, {
      field: 'bankcardNumber',
      title: '银行卡号',
      required: true
    }];
    return this.props.buildDetail({
      fields,
      addCode: 631420,
      beforeSubmit: (params) => {
        params.staffName = this.name;
        params.staffCode = this.code;
        params.companyCode = this.state.companyCode;
        for (let i = 0; i < this.props.selectData.code1.length; i++) {
          if (params.code1 === this.props.selectData.code1[i].code) {
            params.bankName = this.props.selectData.code1[i].bankName;
            params.bankCode = this.props.selectData.code1[i].bankCode;
            params.subbranch = this.props.selectData.code1[i].subbranchName;
          }
        }
        return params;
      }
    });
  }
}

export default AllStaffAddBankCard;
