import React from 'react';
import { Form, Spin, message } from 'antd';
import DetailUtil from 'common/js/build-detail-dev';
import { getUserId, findAndchangeInfo, isUndefined, getOrganizationCode } from 'common/js/util';
import { getDictList } from 'api/dict';

@Form.create()
class ProjectWagesImport extends DetailUtil {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      bankCodeList: [],
      isNotList: [],
      isLoading: false
    };
  }
  componentDidMount() {
    Promise.all([
      getDictList({ parentKey: 'is_not' })
    ]).then(([isNotList]) => {
      this.setState({
        isNotList,
        isLoading: false
      });
    }).catch(() => {
      this.setState({ isLoading: false });
    });
  }
  render() {
    const { isNotList, isLoading } = this.state;
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
          title: '工人姓名',
          field: 'workerName'
        }, {
          title: '发放工资的月份',
          field: 'payMonth'
        }, {
          title: '是否为补发',
          field: 'isBackPay'
        }, {
          title: '补发月份',
          field: 'backPayMonth',
          type: 'month'
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
          title: '应发金额',
          field: 'totalPayAmount'
        }, {
          title: '实发金额',
          field: 'actualAmount'
        }, {
          title: '发放日期',
          field: 'balanceDate',
          type: 'date'
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
        let dateList = JSON.parse(JSON.stringify(params.dateList));
        for (let i = 0; i < dateList.length; i++) {
          let item = dateList[i];
          let error4 = findAndchangeInfo(isNotList, item, 'isBackPay', i);
          if (!error) {
            error = error4;
          }
        }
        params.dateList = JSON.parse(JSON.stringify(dateList));
        const zzTime = /((?!0000)[0-9]{4}-((0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-8])|(0[13-9]|1[0-2])-(29|30)|(0[13578]|1[02])-31)|([0-9]{2}(0[48]|[2468][048]|[13579][26])|(0[48]|[2468][048]|[13579][26])00)-02-29)/;
        let isok = true;
        params.dateList.forEach(item => {
          if(!zzTime.test(item.balanceDate)) {
            isok = false;
          }
        });
        if(isok) {
          return !error;
        }else {
          message.warning('请统一时间格式为yyyy-mm-dd');
        }
        return !error;
      }
    });
  }
}

export default ProjectWagesImport;
