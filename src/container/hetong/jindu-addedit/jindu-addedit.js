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
      companyCode: ''
    };
    this.code = getQueryString('code', this.props.location.search);
  }
  componentDidMount() {
    if (getUserKind() === 'O') {
      getUserDetail(getUserId()).then((data) => {
        this.setState({ 'companyCode': data.companyCode });
      });
    }
  };
  render() {
    const fields = [{
      field: 'projectCode',
      title: '所属工程',
      type: 'select',
      listCode: '631357',
      params: {
        updater: '',
        companyCode: this.state.companyCode,
        kind: 'O'
      },
      keyName: 'code',
      valueName: 'name',
      required: true
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
    return this.state.companyCode ? this.props.buildDetail({
      fields,
      // code: this.code,
      addCode: 631380,
      editCode: 631380
    }) : null;
  }
}

export default JinduAddEdit;
