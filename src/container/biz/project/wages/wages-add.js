import React from 'react';
import { Form } from 'antd';
import { getUserId, getOrganizationCode } from 'common/js/util';
import DetailUtil from 'common/js/build-detail-dev';

@Form.create()
class ProjectWagesAdd extends DetailUtil {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      projectCode: getOrganizationCode(),
      corpCode: '',
      isBackPay: false
    };
  }
  render() {
    let _this = this;
    const fields = [{
      field: 'userId',
      value: getUserId(),
      hidden: true
    }, {
      field: 'projectCode',
      value: getOrganizationCode(),
      hidden: true,
      required: true
    }, {
      title: '所属企业',
      field: 'corpCode',
      type: 'select',
      pageCode: 631645,
      params: {
        projectCode: this.state.projectCode,
        userId: getUserId()
      },
      keyName: 'corpCode',
      valueName: 'corpName',
      onChange: (corpCode, data) => {
        _this.setState({ corpCode });
      },
      required: true
    }, {
      title: '所在班组',
      field: 'teamSysNo',
      type: 'select',
      keyName: 'code',
      valueName: 'teamName',
      searchName: 'teamName',
      pageCode: 631665,
      params: {
        projectCode: this.state.projectCode,
        corpCode: this.state.corpCode,
        userId: getUserId()
      },
      hidden: !this.state.corpCode,
      required: true
    }, {
      title: '发放工资的年月',
      field: 'payMonth',
      type: 'month',
      required: true
    }, {
      title: '明细列表',
      field: 'detailList',
      type: 'o2m',
      required: true,
      options: {
        add: true,
        edit: true,
        detail: true,
        delete: true,
        fields: [{
          title: '证件类型',
          field: 'idCardType',
          type: 'select',
          key: 'legal_manid_card_type',
          required: true
        }, {
          title: '证件号',
          field: 'idCardNumber',
          required: true
        }, {
          title: '出勤天数',
          field: 'days',
          natural: true
        }, {
          title: '总工时',
          field: 'workHours',
          number: true
        }, {
          title: '发放工资银行卡号',
          field: 'payRollBankCardNumber',
          bankCard: true,
          required: true
        }, {
          title: '发放工资银行',
          field: 'payRollBankCode',
          key: 'bank_code',
          type: 'select',
          required: true
        }, {
          title: '工资代发银行卡号',
          field: 'payBankCardNumber',
          bankCard: true,
          required: true
        }, {
          title: '工资代发银行',
          field: 'payBankCode',
          key: 'bank_code',
          type: 'select',
          required: true
        }, {
          title: '应发金额',
          field: 'totalPayAmount',
          required: true
        }, {
          title: '实发金额',
          field: 'actualAmount',
          required: true
        }, {
          title: '发放日期',
          field: 'balanceDate',
          type: 'date',
          required: true
        }, {
          title: '是否为补发',
          field: 'isBackPay',
          type: 'select',
          key: 'is_not',
          required: true,
          onChange: (v) => {
            this.setState({ isBackPay: v === '1' });
          }
        }, {
          title: '补发月份',
          field: 'backPayMonth',
          type: 'month',
          required: this.state.isBackPay,
          hidden: !this.state.isBackPay
        }, {
          title: '第三方工资单编号',
          field: 'thirdPayRollCode'
        }]
      }
    }];
    return this.buildDetail({
      fields,
      view: false,
      addCode: 631770
    });
  }
}

export default ProjectWagesAdd;
