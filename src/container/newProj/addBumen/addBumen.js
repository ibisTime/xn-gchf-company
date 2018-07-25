import React from 'react';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/security/menu-addedit';
import { getQueryString } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getBumen } from 'api/company';
import { getUserDetail, getUserId } from 'api/user';

@DetailWrapper(
  state => state.securityMenuAddEdit,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class AddBumen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bumenStructure: [],
      companyCode: ''
    };
    this.projectCode = getQueryString('projectCode', this.props.location.search);
    this.bumenCode = getQueryString('bumenCode', this.props.location.search);
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
    this.upperBumen = getQueryString('upperBumen', this.props.location.search);
  }
  componentDidMount() {
    getUserDetail(getUserId()).then((res) => {
      this.setState({
        companyCode: res.companyCode
      });
    });
    // getBumen(this.companyCode).then(data => {
    //   console.log(data);
    //   this.setState({ bumenStructure: data });
    // });
  }
  render() {
    const fields = [{
      field: 'name',
      title: '部门名',
      required: true
    }, {
      field: 'leader',
      title: '负责人',
      required: true
    }, {
      field: 'leadeMobile',
      title: '负责人手机号',
      mobile: true,
      required: true
    }, {
      field: 'parentCode',
      title: '上级部门',
      type: 'select',
      listCode: '631036',
      params: {
        projectCode: this.projectCode
      },
      keyName: 'code',
      valueName: 'name',
      value: this.upperBumen
    }];

    return this.state.companyCode ? this.props.buildDetail({
      fields,
      key: 'code',
      code: this.code,
      view: this.view,
      addCode: 631030,
      editCode: 631032,
      detailCode: 631037,
      beforeSubmit: (param) => {
        param.projectCode = this.projectCode;
        return param;
      }
    }) : null;
  }
}

export default AddBumen;
