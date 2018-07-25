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
} from '@redux/staff/allStaff-notice';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg, getUserKind, getUserId, formatDate } from 'common/js/util';
import { getUserDetail } from 'api/user';

@listWrapper(
  state => ({
    ...state.staffAllStaffNotice,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class AllStaffNotice extends React.Component {
  render() {
    const fields = [{
      field: 'name',
      title: '姓名'
    }, {
      field: 'mobile',
      title: '手机号'
    }, {
      field: 'updateName',
      title: '更新人'
    }, {
      field: 'type',
      title: '类型',
      key: 'abnormal_type',
      type: 'select'
    }, {
      field: 'remark',
      title: '备注'
    }];
    return this.props.buildList({
      fields,
      pageCode: 631515
    });
  }
}

export default AllStaffNotice;
