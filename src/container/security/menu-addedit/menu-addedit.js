import React from 'react';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/security/menu-addedit';
import { getQueryString, getUserKind } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';

@DetailWrapper(
  state => state.securityMenuAddEdit,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class MenuAddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userKind: ''
    };
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  componentDidMount() {
    let userKind = getUserKind();
    this.setState({ userKind });
  }
  render() {
    const fields = [{
      title: '父菜单编号',
      field: 'parentCode',
      required: true,
      type: 'select',
      listCode: '631066',
      params: {
        type: 1,
        roleType: this.state.userKind
      },
      keyName: 'code',
      valueName: '{{code.DATA}} {{name.DATA}}'
    }, {
      title: '菜单名称',
      field: 'name',
      required: true,
      maxlength: 32
    }, {
      title: '菜单地址',
      field: 'url',
      required: true,
      maxlength: 64
    }, {
      title: '类型',
      field: 'type',
      required: true,
      type: 'select',
      data: [{
        dkey: '1',
        dvalue: '菜单'
      }, {
        dkey: '2',
        dvalue: '按钮'
      }],
      keyName: 'dkey',
      valueName: 'dvalue'
    }, {
      title: '菜单顺序号',
      field: 'orderNo',
      help: '数字越小，排序越靠前',
      required: true,
      'Z+': true
    }, {
      title: '备注',
      field: 'remark',
      maxlength: 250
    }];
    return this.state.userKind ? this.props.buildDetail({
      fields,
      code: this.code,
      view: this.view,
      detailCode: 631067,
      addCode: 631060,
      editCode: 631062,
      beforeSubmit: (params) => {
        params.roleType = this.state.userKind;
        return params;
      }
    }) : null;
  }
}

export default MenuAddEdit;
