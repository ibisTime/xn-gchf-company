import React from 'react';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/security/role-addedit';
import { getQueryString, getUserKind } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';

@DetailWrapper(
  state => state.securityRoleAddEdit,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class MenuAddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
    this.type = getUserKind();
  }
  render() {
    const fields = [{
      title: '角色名称',
      field: 'name',
      required: true,
      maxlength: 30
    }, {
      title: '类型',
      field: 'type',
      hidden: true,
      value: this.type
    }];
    return this.props.buildDetail({
      fields,
      code: this.code,
      view: this.view,
      detailCode: 631047,
      addCode: 631040,
      editCode: 631042
    });
  }
}

export default MenuAddEdit;
