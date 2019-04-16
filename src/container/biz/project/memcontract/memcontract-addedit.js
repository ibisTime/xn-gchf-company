import React from 'react';
import { Form } from 'antd';
import { getQueryString, getUserId, getOrganizationCode } from 'common/js/util';
import DetailUtil from 'common/js/build-detail-dev';

@Form.create()
class ProjectMemContractAddEdit extends DetailUtil {
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
      title: '项目人员',
      field: 'workerCode',
      type: 'select',
      keyName: 'code',
      valueName: '{{projectName.DATA}}-{{teamName.DATA}}-{{workerName.DATA}}-{{idcardNumber.DATA}}',
      searchName: 'workerName',
      pageCode: 631605,
      params: {
        projectCode: this.state.projectCode,
        userId: getUserId()
      },
      onChange: (code, data) => {
        let info = data.find(v => (v.code + '') === code);
        if (info) {
          let pageData = _this.state.pageData || {};
          _this.setState({
            pageData: {
              ...pageData,
              corpCode: info.corpCode
            }
          });
        }
      },
      required: true,
      formatter(v, d) {
        return `${d.projectName ? d.projectName : ''}-${d.teamName ? d.teamName : ''}-${d.workerName ? d.workerName : ''}-${d.idcardNumber ? d.idcardNumber : ''}`;
      }
    }, {
      field: 'corpCode',
      hidden: true,
      required: true
    }, {
      title: '合同编号',
      field: 'contractCode',
      required: true
    }, {
      title: '合同期限类型',
      field: 'contractPeriodType',
      type: 'select',
      key: 'contract_period_type',
      required: true
    }, {
      title: '开始日期',
      field: 'startDate',
      type: 'date',
      required: true
    }, {
      title: '结束日期',
      field: 'endDate',
      type: 'date',
      required: true
    }, {
      title: '计量单位',
      field: 'unit',
      type: 'select',
      key: 'unit'
    }, {
      title: '计量单价',
      field: 'unitPrice'
    }, {
      title: '合同照片',
      field: 'contentPic',
      type: 'img'
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
      detailCode: 631686,
      addCode: 631670,
      editCode: 631672,
      beforeDetail: (params) => {
        params.userId = getUserId();
      }
    });
  }
}

export default ProjectMemContractAddEdit;
