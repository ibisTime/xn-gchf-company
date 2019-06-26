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
    this.state = {
      ...this.state,
      isBackPay: false,
      index: 0
    };
  }
  render() {
    const fields = [{
        title: '工人工资卡银行',
        field: 'payRollBankCode',
        type: 'select',
        key: 'bank_code',
        required: true
    }, {
      title: '工人工资卡号',
      field: 'payRollBankCardNumber',
      required: true
    }, {
        title: '工资代发银行',
        field: 'payBankCode',
        type: 'select',
        key: 'bank_code',
        required: true
    }, {
      title: '工资代发银行卡号',
      field: 'payBankCardNumber',
      required: true
    }, {
      title: '应发金额(元)',
      field: 'totalPayAmount',
      required: true
    }, {
      title: '实发金额(元)',
      field: 'actualAmount',
      required: true
    }, {
      title: '发放日期',
      field: 'balanceDate',
      type: 'date',
      required: true
    }, {
        title: '发放工资年月',
        field: 'payMonth',
        type: 'month',
        hidden: !this.view
      }, {
      title: '是否为补发',
      field: 'isBackPay',
      type: 'select',
      key: 'is_not',
      required: true,
      onChange: (v) => {
        this.setState({ isBackPay: v === '1' });
      },
      formatter: (v) => {
        if(v && this.state.index < 2) {
          this.setState({ isBackPay: +v === 1, index: this.state.index + 1 });
        }
        return v;
      }
    }, {
      title: '补发月份',
      field: 'backPayMonth',
      type: 'month',
      required: this.state.isBackPay,
      hidden: !this.state.isBackPay
    }, {
      title: '出勤天数',
      field: 'days'
    }, {
      title: '总工时',
      field: 'workHours'
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
      },
      beforeSubmit: (params) => {
        if(+params.isBackPay === 0) {
          params.backPayMonth = '';
        }
        return params;
      }
    });
  }
}

export default ProjectWagesAddEdit;
