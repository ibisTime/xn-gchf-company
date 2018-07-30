import React from 'react';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/hetong/jindu-addedit';
import { getQueryString, showSucMsg, getUserId, getUserKind } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getBankNameByCode } from 'api/project';
import { getUserDetail } from 'api/user';

@DetailWrapper(
  state => state.hetongJinduAddEdit,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class JinduAddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectCode: '',
      projectName: ''
    };
    this.code = getQueryString('code', this.props.location.search);
  }
  componentDidMount() {
    getUserDetail(getUserId()).then((data) => {
      this.setState({
        projectCode: data.projectCode,
        projectName: data.projectName
      });
    });
  };
  render() {
    const fields = [{
      field: 'projectCode',
      title: '所属工程',
      value: this.state.projectName,
      readonly: true
    }, {
      field: 'description',
      title: '工程进度描述',
      required: true
    }, {
      field: 'picture',
      title: '工程进度图片',
      single: true,
      required: true,
      type: 'img'
    }, {
      field: 'datetime',
      title: '进度时间',
      type: 'datetime',
      required: true
    }, {
      field: 'remark',
      title: '备注'
    }];
    return this.state.projectCode ? this.props.buildDetail({
      fields,
      // code: this.code,
      addCode: 631380,
      editCode: 631380,
      beforeSubmit: (params) => {
        params.projectCode = this.state.projectCode;
        return params;
      }
    }) : null;
  }
}

export default JinduAddEdit;
