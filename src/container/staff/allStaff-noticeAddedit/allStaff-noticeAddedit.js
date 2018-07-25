import React from 'react';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/staff/allStaff-noticeAddedit';
import { getQueryString } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';

@DetailWrapper(
  state => state.StaffAllStaffNoticeAddEdit,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class AllStaffNoticeAddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  render() {
    const fields = [{
      field: 'name',
      title: '姓名',
      required: true
    }, {
      field: 'mobile',
      title: '手机号',
      required: true
    }, {
      field: 'type',
      title: '类型',
      type: 'select',
      data: [{
        dkey: '0',
        dvalue: '工资条异常'
      }],
      keyName: 'dkey',
      valueName: 'dvalue',
      search: true
    }, {
      field: 'remark',
      title: '备注'
    }];
    return this.props.buildDetail({
      fields,
      code: this.code,
      view: this.view,
      detailCode: 631517,
      addCode: 631510,
      editCode: 631512
    });
  }
}

export default AllStaffNoticeAddEdit;
