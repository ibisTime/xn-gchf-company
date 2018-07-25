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
class DictAddedit extends React.Component {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  render() {
    const fields = [{
      field: 'parentKey',
      title: '种类',
      search: true,
      type: 'select',
      listCode: '631006',
      params: {
          type: 0
      },
      keyName: 'dkey',
      valueName: 'dvalue',
      readonly: true
    }, {
      field: 'dkey',
      title: '字典键',
      hidden: true
    }, {
      field: 'dkey',
      title: '字典键',
      readonly: true
    }, {
      field: 'dvalue',
      title: '字典值'
    }, {
      field: 'remark',
      title: '备注'
    }];
    return this.props.buildDetail({
      fields,
      key: 'id',
      code: this.code,
      view: this.view,
      detailCode: 631007,
      editCode: 631002
    });
  }
}

export default DictAddedit;
