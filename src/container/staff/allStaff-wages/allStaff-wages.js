import React from 'react';
import cookies from 'browser-cookies';
import {
  setTableData,
  setPagination,
  setBtnList,
  setSearchParam,
  clearSearchParam,
  doFetching,
  cancelFetching,
  setSearchData
} from '@redux/staff/allStaff-wages';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg, getUserKind, getUserId, getQueryString } from 'common/js/util';
import { getUserDetail } from 'api/user';

@listWrapper(
  state => ({
    ...state.staffAllStaffWages
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class AllStaffWages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageCode: null,
      searchParams: null,
      projectCodeList: '',
      companyCode: ''
    };
    this.code = getQueryString('staffCode', this.props.location.search);
  }
  componentDidMount() {
    if (getUserKind() === 'S') {
      getUserDetail(getUserId()).then((data) => {
        this.setState({ 'projectCodeList': data.projectCodeList });
      });
    };
    if (getUserKind() === 'O') {
      getUserDetail(getUserId()).then((data) => {
        this.setState({ 'companyCode': data.companyCode });
      });
    };
  }
  render() {
    const fields = [{
      title: '项目名称',
      field: 'projectName'
    }, {
      title: '扣款金额',
      field: 'cutAmount',
      amount: true
    }, {
      title: '扣款说明',
      field: 'cutNote'
    }, {
      title: '迟到小时数',
      field: 'delayDays'
    }, {
      title: '早退小时数',
      field: 'earlyDays'
    }, {
      title: '请假天数',
      field: 'leavingDays'
    }, {
      title: '所属月份',
      field: 'month'
    }, {
      title: '累计发放金额',
      field: 'totalFactAmount',
      amount: true
    }, {
      title: '关键字',
      field: 'keyword',
      hidden: true
    }];
    if (getUserKind() === 'S') {
      return this.state.projectCodeList ? this.props.buildList({
        fields,
        searchParams: {
          projectCodeList: this.state.projectCodeList
        },
        pageCode: 631448
      }) : null;
    } else if (getUserKind() === 'O') {
      return this.state.companyCode ? this.props.buildList({
        fields,
        searchParams: {
          kind: 'O',
          companyCode: this.state.companyCode
        },
        pageCode: 631448
      }) : null;
    }
    return this.props.buildList({
      fields,
      pageCode: 631448
    });
  }
}

export default AllStaffWages;
