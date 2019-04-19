import React from 'react';
import { Form } from 'antd';
import { getQueryString, getUserId, getOrganizationCode } from 'common/js/util';
import DetailUtil from 'common/js/build-detail-dev';

@Form.create()
class ProjectAttenceAddEdit extends DetailUtil {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      projectCode: getOrganizationCode()
    };
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  render() {
    const _this = this;
    const fields = [{
      field: 'projectCode',
      value: getOrganizationCode(),
      hidden: true,
      required: true
    }, {
      title: '员工编号',
      field: 'workerCode',
      type: 'select',
      pageCode: 631605,
      keyName: 'code',
      searchName: 'workerName',
      valueName: '{{projectName.DATA}}-{{teamName.DATA}}-{{workerName.DATA}}-{{idcardNumber.DATA}}',
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
              teamSysNo: info.teamSysNo
            }
          });
        }
      },
      required: true,
      formatter(v, d) {
        if(d.projectName) {
          return `${d.projectName ? d.projectName : ''}-${d.teamName ? d.teamName : ''}-${d.workerName ? d.workerName : ''}-${d.idCardNumber ? d.idCardNumber : ''}`;
        }else {
          return '';
        }
      }
    }, {
      title: '刷卡时间',
      field: 'date',
      type: 'datetime'
    }, {
      title: '刷卡进出方向',
      field: 'direction',
      type: 'select',
      key: 'direction',
      required: true
    }, {
      field: 'teamSysNo',
      hidden: true
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
      addCode: 631710,
      editCode: 631712,
      detailCode: 631726,
      beforeDetail: (params) => {
        params.userId = getUserId();
      }
    });
  }
}

export default ProjectAttenceAddEdit;
