import React from 'react';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/projectStaff/projectStaff-addBankCard';
import { getQueryString, showSucMsg, formatDate, getUserKind } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getBankNameByCode } from 'api/project';
import { getUserId, getUserDetail } from 'api/user';
import {moneyFormat} from '../../../common/js/util';
@DetailWrapper(
  state => state.projectStaffAddBankCard,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class ProjectStaffAddBankCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyCode: ''
    };
    this.staffCode = getQueryString('staffCode', this.props.location.search);
    this.code = getQueryString('code', this.props.location.search);
    this.name = getQueryString('name', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
    this.projectCode = getQueryString('projectCode', this.props.location.search);
  }
  componentDidMount() {
    if (getUserKind() === 'S') {
      getUserDetail(getUserId()).then((data) => {
        this.setState({ 'projectCodeList': data.projectCodeList });
      });
    };
    if (getUserKind() === 'O') {
      getUserDetail(getUserId()).then((data) => {
        console.log(data.companyCode);
        this.setState({ companyCode: data.companyCode });
      });
    };
  }
  render() {
    const fields = [{
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
      required: true
    }];
    return this.props.buildDetail({
      fields: fields,
      code: this.code,
      view: this.view,
      addCode: 631420,
      editCode: 631422,
      detailCode: 631427,
      beforeSubmit: (params) => {
        params.staffName = this.name;
        params.staffCode = this.staffCode;
        params.companyCode = this.state.companyCode;
        params.projectCode = this.projectCode;
        for (let i = 0; i < this.props.selectData.bankSubbranchName.length; i++) {
          console.log(params.bankName);
          console.log(this.props.selectData.bankSubbranchName[i]);
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

export default ProjectStaffAddBankCard;
