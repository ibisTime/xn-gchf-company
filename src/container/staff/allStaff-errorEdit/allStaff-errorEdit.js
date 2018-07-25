import React from 'react';
import fetch from 'common/js/fetch';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/staff/allStaff-errorEdit';
import { getQueryString, showSucMsg } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getBankNameByCode } from 'api/project';
import { getUserId } from 'api/user';

@DetailWrapper(
  state => state.staffAllStaffErrorEdit,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class AllStaffErrorEdit extends React.Component {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
  }
  render() {
    const fields = [{
      field: 'handleNote',
      title: '处理说明',
      required: true,
      search: true
    }, {
      field: 'handler',
      value: getUserId(),
      required: true,
      hidden: true
    }];
    return this.props.buildDetail({
      fields,
      code: this.code,
      key: 'salaryCode',
      editCode: 631451
    });
  }
}

export default AllStaffErrorEdit;
