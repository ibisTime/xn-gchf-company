import React from 'react';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/public/time-addedit';
import { getQueryString, showSucMsg } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import fetch from 'common/js/fetch';

@DetailWrapper(
  state => state.publicTimeAddEdit,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class TimeAddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  render() {
    const fields = [{
      field: 'id',
      hidden: true
      }, {
      title: '内容',
      field: 'cvalue',
      type: 'textarea',
      required: true
    }];
    return this.props.buildDetail({
      fields,
      key: 'ckey',
      code: 'service_time',
      view: false,
      detailCode: 627087,
      editCode: 627081,
      beforeDetail: (param) => {
      },
      buttons: [{
        title: '保存',
        check: true,
        handler: (params) => {
        this.props.doFetching();
        fetch(627081, params).then(() => {
        showSucMsg('操作成功');
        this.props.cancelFetching();
        }).catch(this.props.cancelFetching);
        }
      }]
    });
  }
}

export default TimeAddEdit;
