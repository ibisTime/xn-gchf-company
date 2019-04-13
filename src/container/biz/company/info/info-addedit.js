import React from 'react';
import { Form } from 'antd';
import { getQueryString, getUserId } from 'common/js/util';
import DetailUtil from 'common/js/build-detail-dev';

@Form.create()
class CompanyInfoAddEdit extends DetailUtil {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  render() {
    const fields = [{
      title: '企业名称',
      field: 'corpName',
      required: true
    }, {
      title: '企业登记注册类型',
      field: 'corpType',
      type: 'select',
      key: 'corp_type'
    }, {
      title: '统一社会信用代码',
      field: 'corpCode',
      required: true
    }, {
      title: '工商营业执照注册号',
      field: 'licenseNum'
    }, {
      title: '注册地区编码',
      field: 'areaCode',
      required: true
    }, {
      title: '企业营业地址',
      field: 'address',
      required: true
    }, {
      title: '邮政编码',
      field: 'zipCode'
    }, {
      title: '法定代表人姓名',
      field: 'legalMan'
    }, {
      title: '法定代表人职务',
      field: 'legalManDuty'
    }, {
      title: '法定代表人职称',
      field: 'legalManProTitle'
    }, {
      title: '法定代表人证件类型',
      field: 'legalManIdcardType',
      type: 'select',
      key: 'legal_manid_card_type'
    }, {
      title: '法定代表人证件号码',
      field: 'legalManIdcardNumber'
    }, {
      title: '注册资本(元)',
      field: 'regCapital',
      'Z+': true
    }, {
      title: '实收资本(元)',
      field: 'factRegCapital',
      'Z+': true
    }, {
      title: '资本币种',
      field: 'capitalCurrencyType',
      type: 'select',
      key: 'capital_currency_type'
    }, {
      title: '注册日期',
      field: 'registerDate',
      type: 'date',
      required: true
    }, {
      title: '成立日期',
      field: 'establishDate',
      type: 'date'
    }, {
      title: '办公电话',
      field: 'officePhone'
    }, {
      title: '传真号码',
      field: 'faxNumber'
    }, {
      title: '联系人姓名',
      field: 'linkMan'
    }, {
      title: '联系人电话',
      field: 'linkPhone',
      mobile: true
    }, {
      title: '企业邮箱',
      field: 'email'
    }, {
      title: '企业网址',
      field: 'webSite'
    }, {
      field: 'userId',
      value: getUserId(),
      hidden: true
    }];
    if (this.view) {
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
      detailCode: 631256,
      addCode: 631250,
      editCode: 631251,
      beforeDetail: (params) => {
        params.userId = getUserId();
      }
    });
  }
}

export default CompanyInfoAddEdit;
