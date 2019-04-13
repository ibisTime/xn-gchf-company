import React from 'react';
import { Form } from 'antd';
import { getQueryString, getUserId, getOrganizationCode } from 'common/js/util';
import DetailUtil from 'common/js/build-detail-dev';

@Form.create()
class ProjectWagesAddEdit extends DetailUtil {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  render() {
    const fields = [{
      title: '出勤天数',
      field: 'days'
    }, {
      title: '总工时',
      field: 'workHours'
    }, {
      title: '应发金额',
      field: 'totalPayAmount',
      amount: true
    }, {
      title: '实发金额',
      field: 'actualAmount',
      amount: true
    }, {
      title: '是否为补发',
      field: 'isBackPay',
      type: 'select',
      key: 'is_not'
    }, {
      title: '发放日期',
      field: 'balanceDate',
      type: 'date'
    }, {
      title: '第三方工资单编号',
      field: 'thirdPayRollCode'
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
      detailCode: 631817,
      editCode: 631810,
      beforeDetail: (params) => {
        params.userId = getUserId();
      }
    });
  }
}

export default ProjectWagesAddEdit;
