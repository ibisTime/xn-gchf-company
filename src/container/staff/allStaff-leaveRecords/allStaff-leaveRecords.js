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
      searchParams: null
    };
    this.staffCode = getQueryString('staffCode', this.props.location.search);
  }
  componentDidMount() {
    // console.log(1);
    // if (getUserKind() === 'S') {
    //   getUserDetail(getUserId()).then((data) => {
    //     this.setState({ 'projectCodeList': data.projectCodeList });
    //   });
    // };
    // if (getUserKind() === 'O') {
    //   getUserDetail(getUserId()).then((data) => {
    //     this.setState({ 'companyCode': data.companyCode });
    //   });
    // };
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
    }, {
      field: 'updateDatetime',
      title: '更新时间',
      type: 'datetime'
    }
    // , {
    //   field: 'updater',
    //   title: '更新人'
    // }
    ];
    const btnEvent = [{
      detail: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/staff/allStaff/detailadd?staffCode=${selectedRowKeys[0]}`);
        }
      }
    }];
    return this.props.buildList({
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
        staffCode: this.staffCode
      },
      pageCode: 631468
    });
  }
}

export default AllStaffLeaveRecords;
