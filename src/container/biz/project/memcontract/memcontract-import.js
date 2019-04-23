import React from 'react';
import { Form, Spin, message } from 'antd';
import DetailUtil from 'common/js/build-detail-dev';
import { getUserId, findAndchangeInfo, isUndefined, getOrganizationCode } from 'common/js/util';
import { getDictList } from 'api/dict';

@Form.create()
class ProjectMemContractImport extends DetailUtil {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      periodTypeList: [],
      unitList: [],
      isLoading: false
    };
  }
  componentDidMount() {
    Promise.all([
      getDictList({ parentKey: 'contract_period_type' }),
      getDictList({ parentKey: 'unit' })
    ]).then(([periodTypeList, unitList]) => {
      this.setState({
        periodTypeList,
        unitList,
        isLoading: false
      });
    }).catch(() => {
      this.setState({ isLoading: false });
    });
  }
  render() {
    const { periodTypeList, unitList, isLoading } = this.state;
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
        name: '项目人员合同导入模板',
        url: '/download/05.项目人员合同导入模板.xlsx'
      }]
    }, {
      title: '项目人员合同列表',
      field: 'dateList',
      type: 'import',
      required: true,
      options: {
        fields: [{
          title: '企业统一社会信用代码',
          field: 'corpCode'
        }, {
          title: '企业名称',
          field: 'corpName'
        }, {
          title: '工人姓名',
          field: 'workerName'
        }, {
          title: '证件号码',
          field: 'idCardNumber'
        }, {
          title: '合同期限类型',
          field: 'contractPeriodType'
        }, {
          title: '开始日期',
          field: 'startDate'
        }, {
          title: '结束日期',
          field: 'endDate'
        }, {
          title: '计量单位',
          field: 'unit'
        }, {
          title: '计量单价',
          field: 'unitPrice'
        }]
      }
    }];
    return isLoading ? (
      <Spin spinning={true}></Spin>
    ) : this.buildDetail({
      fields,
      addCode: 631673,
      beforeSubmit: (params) => {
        let error = false;
        let dateList = JSON.parse(JSON.stringify(params.dateList));
        for (let i = 0; i < dateList.length; i++) {
          let item = dateList[i];
          let error2 = findAndchangeInfo(periodTypeList, item, 'contractPeriodType', i);
          let error3;
          if (!isUndefined(item.unit)) {
            error3 = findAndchangeInfo(unitList, item, 'unit', i);
          }
          if (!error) {
            error = error2 || error3;
          }
        }
        params.dateList = JSON.parse(JSON.stringify(dateList));
        const zzTime = /((?!0000)[0-9]{4}-((0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-8])|(0[13-9]|1[0-2])-(29|30)|(0[13578]|1[02])-31)|([0-9]{2}(0[48]|[2468][048]|[13579][26])|(0[48]|[2468][048]|[13579][26])00)-02-29)/;
        let isok = true;
        params.dateList.forEach(item => {
          if(!zzTime.test(item.startDate)) {
            isok = false;
          }
          if(!zzTime.test(item.endDate)) {
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

export default ProjectMemContractImport;
