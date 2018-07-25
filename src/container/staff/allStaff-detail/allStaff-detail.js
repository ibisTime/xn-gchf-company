import React from 'react';
import fetch from 'common/js/fetch';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/staff/allStaff-detail';
import { getQueryString, showSucMsg } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getBankNameByCode } from 'api/project';
import { getUserId } from 'api/user';

@DetailWrapper(
  state => state.staffAllStaffDetail,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class AllStaffDetail extends React.Component {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  render() {
    const fields = [{
      field: 'code',
      title: '编号'
    }, {
      field: 'projectCode',
      title: '项目编号'
    }, {
      field: 'salaryCode',
      title: '工资条编号'
    }, {
      field: 'handleNote',
      title: '操作描述',
      hidden: true
    }, {
      field: 'type',
      title: '类型',
      key: 'salary_log_type',
      type: 'select'
    }, {
      field: 'handleName',
      title: '处理人'
    }, {
      field: 'handleDatetime',
      title: '处理时间',
      type: 'datetime'
    }, {
      field: 'remark',
      title: '备注'
    }];
    return this.props.buildDetail({
      fields,
      code: this.code,
      view: this.view,
      addCode: 631410,
      detailCode: 631457,
      editCode: 631412
    });
  }
}

export default AllStaffDetail;
