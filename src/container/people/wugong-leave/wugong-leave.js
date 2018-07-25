import React from 'react';
import cookies from 'browser-cookies';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/people/wugong-leave';
import { getQueryString, getUserId, getUserKind } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getUserDetail } from 'api/user';

@DetailWrapper(
  state => state.peopleWugongLeave,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class PWugongLeave extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      departmentCode: ''
    };
    this.code = getQueryString('code', this.props.location.search);
    this.code1 = getQueryString('code1', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
    this.projectCode = getQueryString('projectCode', this.props.location.search);
  }
  componentDidMount() {
    getUserDetail(getUserId()).then(data => {
      this.getUserDetail(data.departmentCode);
    });
  }
  getUserDetail(departmentCode) {
    this.setState({ departmentCode: departmentCode });
  }
  render() {
    const fields = [{
      field: 'code',
      title: '编号',
      value: this.code1,
      hidden: true,
      required: true
    }, {
      field: 'leavingDatetime',
      title: '离职时间',
      type: 'date',
      required: true
    }, {
      field: 'remark',
      title: '备注'
    }];
    return this.props.buildDetail({
      fields,
      code: this.code,
      view: this.view,
      detailCode: 631417,
      addCode: 631462
    });
  }
}

export default PWugongLeave;
