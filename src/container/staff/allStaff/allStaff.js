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
} from '@redux/staff/allStaff';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, getUserId } from 'common/js/util';

@listWrapper(
  state => ({
    ...state.staffAllStaff,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class AllStaff extends React.Component {
  render() {
    const fields = [{
      title: '工人姓名',
      field: 'workerName',
      search: true
    }, {
      title: '证件号',
      field: 'idcardNumber'
    }, {
      title: '工种',
      field: 'workType',
      type: 'select',
      key: 'work_type'
    }, {
      title: '是否购买保险',
      field: 'hasBuyInsurance',
      type: 'select',
      key: 'is_not'
    }, {
      title: '对应项目',
      field: 'projectName'
    }, {
      title: '所在企业',
      field: 'corpName'
    }, {
      title: '所在企业',
      field: 'corpCode',
      pageCode: '631255',
      params: {
        uploadStatus: '2'
      },
      keyName: 'corpCode',
      valueName: 'corpName',
      type: 'select',
      hidden: true,
      search: true
    }, {
      title: '所在班组',
      field: 'teamName'
    }, {
      title: '是否班长',
      field: 'isTeamLeader',
      type: 'select',
      key: 'is_not'
    }, {
      title: '状态',
      field: 'uploadStatus',
      type: 'select',
      key: 'upload_status',
      search: true
    }];
    const btnEvent = {
      // 绑定银行卡
      bank: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/staff/allStaff/bank?bcode=${selectedRowKeys[0]}&type=002`);
        }
      },
      // 重新建档
      rejiandang: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/staff/jiandang?code=${selectedRows[0].workerCode}`);
        }
      },
      // 详情
      detail: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/staff/allStaff/addedit?code=${selectedRows[0].workerCode}&v=1`);
        }
      }
    };
    return this.props.buildList({
      fields,
      btnEvent,
      searchParams: {
        userId: getUserId()
      },
      pageCode: 631605
    });
  }
}

export default AllStaff;
