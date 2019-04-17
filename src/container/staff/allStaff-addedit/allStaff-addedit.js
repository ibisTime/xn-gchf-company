import React from 'react';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/staff/allStaff-addedit';
import { getQueryString, getUserId } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';

@DetailWrapper(
  state => state.staffAllStaffAddEdit,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class AllStaffAddEdit extends React.Component {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  render() {
    const fields = [{
      field: 'name',
      title: '姓名',
      required: true
    }, {
      field: 'headImageUrl',
      title: '身份证头像',
      single: true,
      required: true,
      formatter(v) {
        return (<img src = {v} width = {100} />);
      }
    }, {
      title: '性别',
      field: 'gender',
      type: 'select',
      key: 'gender',
      required: true
    }, {
      field: 'nation',
      title: '民族',
      required: true
    }, {
      title: '出生日期',
      field: 'birthday',
      type: 'date',
      required: true
    }, {
      field: 'idCardNumber',
      title: '身份证号码',
      bankCard: true,
      required: true
    }, {
      title: '地址',
      field: 'address',
      required: true
    }, {
      field: 'startDate',
      title: '有效开始日期',
      type: 'date',
      required: true
    }, {
      field: 'expiryDate',
      title: '有效截止日期',
      type: 'date',
      required: true
    }, {
      field: 'grantOrg',
      title: '签发机关',
      required: true
    }, {
      field: 'politicsType',
      title: '政治面貌',
      type: 'select',
      key: 'politics_type',
      required: true
    }, {
      field: 'cultureLevelType',
      title: '文化程度',
      type: 'select',
      key: 'culture_level_type',
      required: true
    }, {
      field: 'isJoined',
      title: '是否加入公会',
      type: 'select',
      key: 'is_not'
    }, {
      field: 'joinedTime',
      title: '加入公会时间',
      type: 'date'
    }, {
      field: 'specialty',
      title: '特长'
    }, {
      field: 'hasBadMedicalHistory',
      title: '是否有重大病史',
      type: 'select',
      key: 'is_not'
    }, {
      field: 'maritalStatus',
      title: '婚姻状况',
      type: 'select',
      key: 'marital_status'
    }, {
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
    }];

    return this.props.buildDetail({
      fields,
      code: this.code,
      view: this.view,
      detailCode: 631806,
      beforeDetail: (params) => {
        params.userId = getUserId();
      }
    });
  }
}

export default AllStaffAddEdit;
