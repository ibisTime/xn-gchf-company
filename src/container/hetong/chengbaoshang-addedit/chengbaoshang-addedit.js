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
} from '@redux/hetong/chengbaoshang-addedit';
import { getQueryString, showSucMsg, getUserId, getUserKind } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getBankNameByCode } from 'api/project';
import { getUserDetail } from 'api/user';

@DetailWrapper(
  state => state.hetongChengbaoshangAddEdit,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class ChengbaoshangAddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectCode: '',
      projectName: ''
    };
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
    getUserDetail(cookies.get('userId')).then((data) => {
      this.setState({
        projectCode: data.projectCode,
        projectName: data.projectName
      });
    });
  }

  render() {
    const fields = [{
      field: 'projectCode',
      title: '所属工程',
      value: this.state.projectName,
      readonly: true
    }, {
      field: 'bname',
      title: '承包商名称',
      required: true
    }, {
      field: 'bmobile',
      title: '承包商手机号',
      mobile: true,
      required: true
    }, {
      field: 'contractDatetime',
      title: '签约时间',
      type: 'date',
      required: true
    }, {
      field: 'contentPic',
      title: '合同照片',
      type: 'img',
      single: true,
      required: true
    }, {
      field: 'remark',
      title: '备注'
    }];
    return this.state.projectCode ? this.props.buildDetail({
      fields,
      code: this.code,
      view: this.view,
      addCode: 631370,
      detailCode: 631377,
      editCode: 631372,
      beforeSubmit: (params) => {
        params.projectCode = this.state.projectCode;
        return params;
      }
    }) : null;
  }
}

export default ChengbaoshangAddEdit;
