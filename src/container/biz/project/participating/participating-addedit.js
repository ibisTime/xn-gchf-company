import React from 'react';
import { Form } from 'antd';
import { getQueryString, getUserId, getOrganizationCode } from 'common/js/util';
import DetailUtil from 'common/js/build-detail-dev';

@Form.create()
class ParticipatingAddEdit extends DetailUtil {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  render() {
    const fields = [{
      title: '企业名称',
      field: 'corpCode',
      pageCode: 631255,
      params: {
        uploadStatus: '2'
      },
      keyName: 'corpCode',
      valueName: 'corpName',
      type: 'select',
      required: true
    }, {
      title: '企业类型',
      field: 'corpType',
      type: 'select',
      key: 'project_corp_type',
      required: true
    }, {
      field: 'projectCode',
      value: getOrganizationCode(),
      hidden: true,
      required: true
    }, {
      title: '进场时间',
      field: 'entryTime',
      type: 'datetime'
    }, {
      title: '退场时间',
      field: 'exitTime',
      type: 'datetime'
    }, {
      title: '项目经理',
      field: 'pmName'
    }, {
      title: '项目经理电话',
      field: 'pmPhone',
      mobile: true
    }, {
      title: '项目经理证件类型',
      field: 'pmIDCardType',
      type: 'select',
      key: 'legal_manid_card_type'
    }, {
      title: '项目经理证件号码',
      field: 'pmIDCardNumber'
    }, {
      field: 'userId',
      value: getUserId(),
      hidden: true
    }];
    if (this.view) {
      fields.push({
        field: 'banklist',
        title: '银行卡',
        type: 'o2m',
        listCode: 631767,
        params: {
          userId: getUserId(),
          businessSysNo: this.code
        },
        options: {
          noSelect: true,
          fields: [{
            title: '银行支行名称',
            field: 'bankName'
          }, {
            title: '银行卡号',
            field: 'bankNumber'
          }, {
            title: '银行联号',
            field: 'bankLinkNumber'
          }, {
            title: '状态',
            field: 'status',
            type: 'select',
            key: 'bankcard_status'
          }]
        }
      });
      fields.push({
        title: '操作日志',
        field: 'operationLogs',
        type: 'o2m',
        listCode: 631137,
        params: {
          userId: getUserId(),
          refCode: this.code
        },
        options: {
          noSelect: true,
          fields: [{
            title: '操作人',
            field: 'operatorName'
          }, {
            title: '操作类型',
            field: 'operate'
          }, {
            title: '操作时间',
            field: 'operateDatetime',
            type: 'datetime'
          }, {
            title: '备注',
            field: 'remark'
          }]
        }
      });
    }
    return this.buildDetail({
      fields,
      code: this.code,
      view: this.view,
      detailCode: 631646,
      beforeDetail: (params) => {
        params.userId = getUserId();
      },
      editCode: 631632,
      addCode: 631630
    });
  }
}

export default ParticipatingAddEdit;
