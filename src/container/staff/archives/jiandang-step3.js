import React from 'react';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/staff/jiandang-step3';
import fetch from 'common/js/fetch';
import { getQueryString, showSucMsg, showWarnMsg } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getBankCodeByName } from 'api/project';
import { getUserId } from '../../../common/js/util';

@DetailWrapper(
  state => state.jiandangStep3,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class JiandangStep3 extends React.Component {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
  }
  render() {
    const fields = [{
      field: 'cellPhone',
      title: '手机号码',
      mobile: true,
      required: true
    }, {
      field: 'urgentLinkMan',
      title: '紧急联系人姓名',
      required: true
    }, {
      title: '紧急联系电话',
      field: 'urgentLinkManPhone',
      mobile: true,
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
      editCode: 631792,
      beforeDetail: (params) => {
        params.userId = getUserId();
      },
      onOk: () => {
        this.props.history.push('/staff/jiandang');
      }
    });
  }
}

export default JiandangStep3;
