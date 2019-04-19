import React from 'react';
import { Form, Spin } from 'antd';
import DetailUtil from 'common/js/build-detail-dev';
import { getUserId, findAndchangeInfo, isUndefined, getOrganizationCode } from 'common/js/util';
import { getDictList } from 'api/dict';

@Form.create()
class ExportImport extends DetailUtil {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      isNotList: [],
      workTypeList: [],
      workRoleList: [],
      cultureLevelType: [],
      politicsTypeList: [],
      bankCodeList: [],
      maritalStatusList: [],
      isLoading: false
    };
  }
  componentDidMount() {
    Promise.all([
      getDictList({ parentKey: 'is_not' }),
      getDictList({ parentKey: 'work_type' }),
      getDictList({ parentKey: 'work_role' }),
      getDictList({ parentKey: 'culture_level_type' }),
      getDictList({ parentKey: 'bank_code' }),
      getDictList({ parentKey: 'politics_type' }),
      getDictList({ parentKey: 'marital_status' })
    ]).then(([isNotList, workTypeList, workRoleList, cultureLevelType, bankCodeList, politicsTypeList, maritalStatusList]) => {
      this.setState({
        isNotList,
        workTypeList,
        workRoleList,
        cultureLevelType,
        politicsTypeList,
        bankCodeList,
        maritalStatusList,
        isLoading: false
      });
    }).catch(() => {
      this.setState({ isLoading: false });
    });
  }
  render() {
    const { isNotList, workTypeList, workRoleList, cultureLevelType, politicsTypeList, bankCodeList, maritalStatusList, isLoading } = this.state;
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
        name: '项目人员导入模板',
        url: '/download/03.项目人员导入模板.xlsx'
      }]
    }, {
      title: '项目人员列表',
      field: 'workerList',
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
          title: '班组名称',
          field: 'teamName'
        }, {
          title: '工人姓名',
          field: 'workerName'
        }, {
          title: '是否为班组长',
          field: 'isTeamLeader'
        }, {
          title: '证件号码',
          field: 'idCardNumber'
        }, {
          title: '当前工种',
          field: 'workType'
        }, {
          title: '工人类型',
          field: 'workRole'
        }, {
          title: '发放工资银行卡号',
          field: 'payRollBankCardNumber'
        }, {
          title: '发放工资银行名称',
          field: 'payRollBankName'
        }, {
          title: '发放工资卡银行联号',
          field: 'bankLinkNumber'
        }, {
          title: '发放工资卡银行代码',
          field: 'payRollTopBankCode'
        }, {
          title: '是否购买保险',
          field: 'hasBuyInsurance'
        }, {
          title: '民族',
          field: 'nation'
        }, {
          title: '地址',
          field: 'address'
        }, {
          title: '政治面貌',
          field: 'politicsType'
        }, {
          title: '加入公会时间',
          field: 'joinedTime',
          type: 'datetime'
        }, {
          title: '手机号码',
          field: 'cellPhone'
        }, {
          title: '文化程度',
          field: 'cultureLevelType'
        }, {
          title: '特长',
          field: 'specialty'
        }, {
          title: '是否有重大病史',
          field: 'hasBadMedicalHistory'
        }, {
          title: '紧急联系人姓名',
          field: 'urgentLinkMan'
        }, {
          title: '紧急联系方式',
          field: 'urgentLinkManPhone'
        }, {
          title: '开始工作日期',
          field: 'workDate',
          type: 'date'
        }, {
          title: '婚姻状况',
          field: 'maritalStatus'
        }, {
          title: '发证机关',
          field: 'grantOrg'
        }, {
          title: '证件有效期开始日期',
          field: 'startDate',
          type: 'date'
        }, {
          title: '证件有效期结束日期',
          field: 'expiryDate',
          type: 'date'
        }]
      }
    }];
    return isLoading ? (
      <Spin spinning={true}></Spin>
    ) : this.buildDetail({
      fields,
      addCode: 631693,
      beforeSubmit: (params) => {
        let error = false;
        let workerList = JSON.parse(JSON.stringify(params.workerList));
        for (let i = 0; i < workerList.length; i++) {
          let item = workerList[i];
          let error1 = findAndchangeInfo(isNotList, item, 'isTeamLeader', i);
          let error3 = findAndchangeInfo(workTypeList, item, 'workType', i);
          let error4 = findAndchangeInfo(workRoleList, item, 'workRole', i);
          let error6 = findAndchangeInfo(cultureLevelType, item, 'cultureLevelType', i);
          let error5 = findAndchangeInfo(politicsTypeList, item, 'politicsType', i);
          let error7, error8, error9, error10;
          if(!isUndefined(item.maritalStatus)) {
            error10 = findAndchangeInfo(maritalStatusList, item, 'maritalStatus', i);
          }
          if(!isUndefined(item.payRollTopBankCode)) {
            error7 = findAndchangeInfo(bankCodeList, item, 'payRollTopBankCode', i);
          }
          if (!isUndefined(item.hasBuyInsurance)) {
            error8 = findAndchangeInfo(isNotList, item, 'hasBuyInsurance', i);
          }
          if (!isUndefined(item.hasBadMedicalHistory)) {
            error9 = findAndchangeInfo(isNotList, item, 'hasBadMedicalHistory', i);
          }
          if (!error) {
            error = error1 || error3 || error4 || error8 || error9 || error5 || error6 || error7 || error10;
          }
        }
        params.workerList = JSON.parse(JSON.stringify(workerList));
        return !error;
      }
    });
  }
}

export default ExportImport;
