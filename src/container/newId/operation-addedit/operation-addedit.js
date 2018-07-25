import React from 'react';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/newId/operation-addedit';
import { getQueryString } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
@DetailWrapper(
  state => state.newIdOperationAddEdit,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class OperationAddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  render() {
    const fields = [{
      title: '银行别称',
      field: 'bankCode',
      required: true
    }, {
      title: '银行名',
      field: 'bankName',
      required: true
    }];
    return this.props.buildDetail({
      fields,
      code: this.code,
      view: this.view,
      key: 'id',
      detailCode: 631117,
      editCode: 631112,
      addCode: 631110
    });
  }
}

export default OperationAddEdit;
