import React from 'react';
import { Form, Spin } from 'antd';
import DetailUtil from 'common/js/build-detail-dev';
import { getUserId, findAndchangeInfo, isUndefined, getOrganizationCode } from 'common/js/util';
import { getDictList } from 'api/dict';

@Form.create()
class ProjectWagesImport extends DetailUtil {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      cardTypeList: [],
      bankCodeList: [],
      isNotList: [],
      isLoading: false
    };
  }
  componentDidMount() {
    // Promise.all([
    //   getDictList({ parentKey: 'legal_manid_card_type' }),
    //   getDictList({ parentKey: 'bank_code' }),
    //   getDictList({ parentKey: 'is_not' })
    // ]).then(([cardTypeList, bankCodeList, isNotList]) => {
    //   this.setState({
    //     cardTypeList,
    //     bankCodeList,
    //     isNotList,
    //     isLoading: false
    //   });
    // }).catch(() => {
    //   this.setState({ isLoading: false });
    // });
  }
  render() {
    const { cardTypeList, bankCodeList, isNotList, isLoading } = this.state;
    const fields = [{
      field: 'projectCode',
      value: getOrganizationCode(),
      hidden: true,
      required: true
    }, {
      title: '导入模版',
      field: 'downloadTmp',
      type: 'download',
      links: [{
        name: '字段填写说明',
        url: '/download/00.字段填写说明.xlsx'
      }, {
        name: '项目人员工资导入模板',
        url: '/download/07.项目人员工资导入模板.xlsx'
      }]
    }, {
      title: '项目人员工资列表',
      field: 'dateList',
      type: 'import',
      required: true,
      options: {
        fields: [{
          title: '统一社会信用代码',
          field: 'corpCode'
        }, {
          title: '企业名称',
          field: 'corpName'
        }, {
          title: '班组名称',
          field: 'teamName'
        }, {
          title: '发放工资的月份',
          field: 'payMonth'
        }, {
          title: '证件类型',
          field: 'idCardType'
        }, {
          title: '证件号码',
          field: 'idCardNumber'
        }, {
          title: '出勤天数',
          field: 'days'
        }, {
          title: '总工时',
          field: 'workHours'
        }, {
          title: '工人工资卡号',
          field: 'payRollBankCardNumber'
        }, {
          title: '工人工资卡银行代码',
          field: 'payRollBankCode'
        }, {
          title: '工人工资卡开户行名称',
          field: 'payRollBankName'
        }, {
          title: '工资代发银行卡号',
          field: 'payBankCardNumber'
        }, {
          title: '工资代发银行代码',
          field: 'payBankCode'
        }, {
          title: '工资代发开户行名称',
          field: 'payBankName',
          required: true
        }, {
          title: '应发金额',
          field: 'totalPayAmount',
          amount: true,
          required: true
        }, {
          title: '实发金额',
          field: 'actualAmount',
          amount: true,
          required: true
        }, {
          title: '是否为补发',
          field: 'isBackPay'
        }, {
          title: '发放日期',
          field: 'balanceDate',
          type: 'date'
        }, {
          title: '补发月份',
          field: 'backPayMonth',
          type: 'month'
        }, {
          title: '第三方工资单编号',
          field: 'thirdPayRollCode'
        }]
      }
    }];
    return isLoading ? (
      <Spin spinning={true}></Spin>
    ) : this.buildDetail({
      fields,
      addCode: 631812,
      beforeSubmit: (params) => {
        let error = false;
        // for (let i = 0; i < params.dateList.length; i++) {
        //   let item = params.dateList[i];
        //   let error1 = findAndchangeInfo(cardTypeList, item, 'idCardType', i);
        //   let error2 = findAndchangeInfo(bankCodeList, item, 'payRollBankCode', i);
        //   let error3 = findAndchangeInfo(bankCodeList, item, 'payBankCode', i);
        //   let error4 = findAndchangeInfo(isNotList, item, 'isBackPay', i);
        //   if (!error) {
        //     error = error1 || error2 || error3 || error4;
        //   }
        // }
        return !error;
      }
    });
  }
}

export default ProjectWagesImport;
