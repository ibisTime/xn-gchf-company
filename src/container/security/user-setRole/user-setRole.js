import React from 'react';
import cookies from 'browser-cookies';
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
      title: '用户名',
      field: 'loginName',
      required: true
    }, {
      title: '角色',
      field: 'roleCode',
      type: 'select',
      listCode: '631046',
      params: {
        updater: '',
        type: cookies.get('loginKind') === 'P' ? '' : cookies.get('loginKind')
      },
      keyName: 'code',
      valueName: 'name',
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
      editCode: 631076
    });
  }
}

export default UserAddEdit;
