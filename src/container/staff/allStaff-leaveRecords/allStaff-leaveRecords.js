import React from 'react';
import {
  setTableData,
  setPagination,
  setBtnList,
  setSearchParam,
  clearSearchParam,
  doFetching,
  cancelFetching,
  setSearchData
} from '@redux/staff/allStaff-leaveRecords';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg, getUserKind, getUserId, formatDate, getQueryString } from 'common/js/util';
import { getUserDetail } from 'api/user';

@listWrapper(
  state => ({
    ...state.staffAllStaffLeaveRecords,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class AllStaffLeaveRecords extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageCode: null,
      searchParams: null,
      projectCode: ''
    };
  }
  componentDidMount() {
    getUserDetail(getUserId()).then((data) => {
      this.setState({ 'projectCode': data.projectCode });
    });
  }
  render() {
    const fields = [{
      field: 'projectName',
      title: '项目名称'
    }, {
      field: 'staffName',
      title: '员工姓名'
    }, {
      field: 'startDatetime',
      title: '请假开始时间',
      type: 'date'
    }, {
      field: 'endDatetime',
      title: '请假结束时间',
      type: 'date'
    }, {
      field: 'leaveDays',
      title: '请假天数'
    }];
    return this.state.projectCode ? this.props.buildList({
      fields,
      buttons: [{
        code: 'detail',
        name: '详情',
        handler: (selectedRowKeys, selectedRows) => {
          if (!selectedRowKeys.length) {
            showWarnMsg('请选择记录');
          } else if (selectedRowKeys.length > 1) {
            showWarnMsg('请选择一条记录');
          } else {
            this.props.history.push(`/staff/allStaff/leaveRecords-detail?code=${selectedRowKeys[0]}`);
          }
        }
      }],
      searchParams: {
        projectCode: this.state.projectCode
      },
      pageCode: 631468
    }) : null;
  }
}

export default AllStaffLeaveRecords;
