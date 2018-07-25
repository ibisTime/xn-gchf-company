import React from 'react';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/staff/leaveRecords-detail';
import { getQueryString, showSucMsg } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getBankNameByCode } from 'api/project';
import { getUserId } from 'api/user';

@DetailWrapper(
  state => state.staffLeaveRecordsDetail,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class LeaveRecordsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
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
    }];
    return this.props.buildDetail({
      fields,
      code: this.code,
      view: true,
      addCode: 631410,
      detailCode: 631469
    });
  }
}

export default LeaveRecordsDetail;
