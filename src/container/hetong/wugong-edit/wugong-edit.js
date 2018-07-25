import React from 'react';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/hetong/wugong-edit';
import { getQueryString, showSucMsg } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getBankNameByCode } from 'api/project';
import { getUserId, getUserDetail } from 'api/user';

@DetailWrapper(
  state => state.hetongWugongEdit,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class WugongEdit extends React.Component {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.view = getQueryString('v', this.props.location.search);
    this.projectCode = getQueryString('projectCode', this.props.location.search);
  }
  render() {
    const fields = [{
      field: 'projectCode',
      title: '所属工程',
      type: 'select',
      listCode: '631357',
      params: {
        kind: 'O',
        updater: ''
      },
      keyName: 'code',
      valueName: 'name',
      required: true,
      readonly: true
    }, {
      field: 'staffCode',
      title: '工人名字',
      type: 'select',
      listCode: '631416',
      keyName: 'code',
      valueName: 'name',
      required: true,
      readonly: true
    }, {
      field: 'contentPic',
      title: '合同照片',
      type: 'img',
      single: true,
      required: true
    }, {
      field: 'contractDatetime',
      title: '签约时间',
      type: 'date',
      required: true
    }, {
      field: 'remark',
      title: '备注'
    }];
    return this.props.buildDetail({
      fields,
      code: this.code,
      view: this.view,
      editCode: 631402,
      detailCode: 631407
    });
  }
}

export default WugongEdit;
