import React from 'react';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/people/wugong-break';
import { getQueryString, getUserId } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getUserDetail } from 'api/user';

@DetailWrapper(
  state => state.peopleWugongBreak,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class PWugongBreak extends React.Component {
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
      field: 'startDatetime',
      title: '开始时间',
      type: 'datetime',
      required: true
    }, {
      field: 'endDatetime',
      title: '结束时间',
      type: 'datetime',
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
      addCode: 631461
    });
  }
}

export default PWugongBreak;
