import React from 'react';
import { Form } from 'antd';
import { getQueryString, formatImg, getUserId, getOrganizationCode } from 'common/js/util';
import DetailUtil from 'common/js/build-detail-dev';

@Form.create()
class ProjectMemberAddEdit extends DetailUtil {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
    this.state = {
      ...this.state,
      projectCode: getOrganizationCode()
    };
  }
  render() {
    const _this = this;
    const fields = [{
      field: 'projectCode',
      value: getOrganizationCode(),
      hidden: true,
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
        userId: getUserId()
      },
      onChange: (code, data) => {
        let classInfo = data.find(v => (v.code + '') === code);
        if (classInfo) {
          let pageData = _this.state.pageData || {};
          _this.setState({
            pageData: {
              ...pageData,
              corpCode: classInfo.corpCode
            }
          });
        }
      },
      required: true
    }, {
      field: 'corpCode',
      hidden: true,
      required: true
    }, {
      title: '工人编号',
      field: 'workerCode',
      type: 'select',
      pageCode: 631805,
      keyName: 'code',
      searchName: 'name',
      valueName: '{{name.DATA}}-{{idCardNumber.DATA}}',
      params: {
        userId: getUserId()
      },
      required: true
    }, {
      title: '是否班长',
      field: 'isTeamLeader',
      type: 'select',
      key: 'is_not',
      required: true
    }, {
      title: '工种',
      field: 'workType',
      type: 'select',
      key: 'work_type',
      required: true
    }, {
      title: '工人类型',
      field: 'workRole',
      type: 'select',
      key: 'work_role',
      required: true
    }, {
      title: '制卡时间',
      field: 'issueCardDate',
      type: 'datetime'
    }, {
      title: '制卡采集照片',
      field: 'issueCardPicUrl',
      type: 'img'
    }, {
      title: '考勤卡号',
      field: 'cardNumber'
    }, {
      title: '发放工资银行卡号',
      field: 'payRollBankCardNumber',
      bankCard: true
    }, {
      title: '发放工资银行名称',
      field: 'payRollBankName'
    }, {
      title: '工资卡银行联号',
      field: 'bankLinkNumber'
    }, {
      title: '工资卡银行代码',
      field: 'payRollTopBankCode',
      key: 'bank_code',
      type: 'select'
    }, {
      title: '是否购买保险',
      field: 'hasBuyInsurance',
      type: 'select',
      key: 'is_not'
    }, {
      title: '开始工作日期',
      field: 'workDate',
      type: 'date'
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
      detailCode: 631606,
      editCode: 631692,
      addCode: 631690,
      beforeDetail: (params) => {
        params.userId = getUserId();
      },
      beforeSubmit: (params) => {
        params.issueCardPicUrl = formatImg(params.issueCardPicUrl);
        return true;
      }
    });
  }
}

export default ProjectMemberAddEdit;
