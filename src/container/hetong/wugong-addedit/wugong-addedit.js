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
} from '@redux/hetong/wugong-addedit';
import { getQueryString, showSucMsg, getUserKind } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getBankNameByCode } from 'api/project';
import { getUserId, getUserDetail } from 'api/user';

@DetailWrapper(
  state => state.hetongWugongAddEdit,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class WugongAddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectCode: '',
      projectName: ''
    };
    this.code = getQueryString('code', this.props.location.search);
    // this.projectCode = getQueryString('projectCode', this.props.location.search);
  }
  componentDidMount() {
    getUserDetail(getUserId()).then((data) => {
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
      field: 'staffCode',
      title: '工人名字',
      type: 'select',
      listCode: '631416',
      keyName: 'code',
      valueName: 'name',
      required: true
    }, {
      field: 'contentPic',
      title: '合同照片',
      type: 'img',
      single: true,
      required: true
    }, {
      field: 'contractDatetime',
      title: '签约时间',
      type: 'date',
      required: true
    }, {
      field: 'remark',
      title: '备注'
    }];
    return this.state.projectCode ? this.props.buildDetail({
      fields,
      code: this.code,
      view: this.view,
      addCode: 631400,
      editCode: 631402,
      detailCode: 631407,
      beforeSubmit: (params) => {
        params.projectCode = this.state.projectCode;
        return params;
      },
      onOk: () => {
        this.props.cancelFetching();
        setTimeout(() => {
          this.props.history.go(-1);
        }, 1000);
      }
    }) : null;
  }
}

export default WugongAddEdit;
