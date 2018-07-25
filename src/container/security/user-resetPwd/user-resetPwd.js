import React from 'react';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/security/user-addedit';
import { getQueryString } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';

@DetailWrapper(
  state => state.securityUserAddEdit,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class UserAddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.code = getQueryString('userId', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  render() {
    const fields = [{
      title: 'Id',
      field: 'userId',
      value: this.code,
      hidden: true
    }, {
      title: '新密码',
      field: 'newLoginPwd',
      type: 'password',
      required: true
    }, {
      title: '备注',
      field: 'remark'
    }];
    return this.props.buildDetail({
      fields,
      key: 'userId',
      code: this.code,
      view: this.view,
      detailCode: 631087,
      addCode: 631074,
      editCode: 631074
    });
  }
}

export default UserAddEdit;
