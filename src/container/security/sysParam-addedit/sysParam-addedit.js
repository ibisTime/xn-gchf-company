import React from 'react';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/security/menu-addedit';
import { getQueryString } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';

@DetailWrapper(
  state => state.securityMenuAddEdit,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class SysparamAddedit extends React.Component {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  render() {
    const fields = [{
      field: 'remark',
      title: '参数名',
      readonly: true
    }, {
      field: 'cvalue',
      title: '参数值'
    }];
    return this.props.buildDetail({
      fields,
      key: 'id',
      code: this.code,
      view: this.view,
      detailCode: 631018,
      editCode: 631012
    });
  }
}

export default SysparamAddedit;
