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
      field: 'workerName',
      title: '姓名',
      search: true
    }, {
      field: 'idcardNumber',
      title: '身份证号码'
    }, {
      field: 'workerMobile',
      title: '手机号'
    }, {
      field: 'archiveDatetime',
      title: '建档时间',
      type: 'datetime'
    }];
    const btnEvent = {
      // 绑定银行卡
      bank: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/staff/allStaff/bank?bcode=${selectedRows[0].workerCode}&type=002`);
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
