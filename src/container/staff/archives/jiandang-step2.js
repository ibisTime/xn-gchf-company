import React from 'react';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/staff/jiandang-step2';
import { getQueryString, getUserId } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';

@DetailWrapper(
  state => state.jiandangStep2,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class JiandangStep2 extends React.Component {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
  }
  render() {
    const fields = [{
      field: 'positiveIdCardImageUrl',
      title: '正面照URL',
      type: 'img',
      single: true,
      required: true
    }, {
      field: 'negativeIdCardImageUrl',
      title: '反面照URL',
      type: 'img',
      single: true,
      required: true
    }, {
      title: '手持身份证照片URL',
      field: 'handIdCardImageUrl',
      type: 'img',
      single: true,
      required: true
    }, {
      field: 'userId',
      value: getUserId(),
      hidden: true
    }, {
      field: 'code',
      value: this.code,
      hidden: true
    }];
    return this.props.buildDetail({
      fields,
      code: this.code,
      detailCode: 631806,
      editCode: 631791,
      beforeDetail: (params) => {
        params.userId = getUserId();
      },
      onOk: () => {
        setTimeout(() => {
          this.props.history.push(`/staff/jiandang/step3?code=${this.code}`);
        }, 300);
      }
    });
  }
}

export default JiandangStep2;
