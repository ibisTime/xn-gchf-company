import React from 'react';
import { Form } from 'antd';
import { getQueryString, formatImg, getUserId, getOrganizationCode } from 'common/js/util';
import DetailUtil from 'common/js/build-detail-dev';
import fetch from 'common/js/fetch';

@Form.create()
class ProjectMemberAddEdit extends DetailUtil {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.parCode = getQueryString('parCode', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
    this.state = {
      ...this.state,
      projectCode: getOrganizationCode(),
      workerName: ''
    };
    this.teamSysNo = '';
  }
  componentDidMount() {
    if(this.code) {
      fetch(631606, {
        code: this.code,
        userId: getUserId()
      }).then(data => {
        this.setState({
          workerName: data && `${data.corpName ? data.corpName + '-' : ''}${data.teamName ? data.teamName + '-' : ''}${data.workerName ? data.workerName : '-'}`
        });
      });
    }
  }
  render() {
    const _this = this;
    const fields = [{
      field: 'projectCode',
      value: getOrganizationCode(),
      hidden: true,
      required: true
    }, {
      title: '工人编号',
      field: 'workerCode1',
      value: this.state.workerName,
      readonly: true,
      hidden: this.parCode
    }, {
      title: '工人编号',
      field: 'workerCode',
      hidden: true
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
      formatter: (v) => {
        if(!this.teamSysNo) {
          this.teamSysNo = v;
        }
        return v;
      },
      required: true,
      readonly: !!this.code
    }, {
      field: 'corpCode',
      hidden: true,
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
      title: '制卡采集照片(小于50kB)',
      field: 'issueCardPicUrl',
      type: 'img',
      single: true,
      imgSize: 51200
    }, {
      title: '考勤卡号',
      field: 'cardNumber',
      maxlength: 20
    }, {
      field: 'positiveIdCardImageUrl',
      title: '身份证正面照(小于500KB)',
      type: 'img',
      single: true,
      formatter: (v, d) => {
        if(d.workerInfo) {
          return d.workerInfo.positiveIdCardImageUrl;
        }else {
          return '-';
        }
      },
      hidden: !this.view
    }, {
      field: 'negativeIdCardImageUrl',
      title: '身份证反面照(小于500KB)',
      type: 'img',
      single: true,
      formatter: (v, d) => {
        if(d.workerInfo) {
          return d.workerInfo.negativeIdCardImageUrl;
        }else {
          return '-';
        }
      },
      hidden: !this.view
    }, {
      title: '手持身份证照片(小于500KB)',
      field: 'handIdCardImageUrl',
      type: 'img',
      single: true,
      formatter: (v, d) => {
        if(d.workerInfo) {
          return d.workerInfo.handIdCardImageUrl;
        }else {
          return '-';
        }
      },
      hidden: !this.view
    }, {
      title: '考勤人脸照(小于500KB)',
      field: 'attendancePicture',
      type: 'img',
      single: true,
      formatter: (v, d) => {
        if(d.workerInfo) {
          return d.workerInfo.attendancePicture;
        }else {
          return '-';
        }
      },
      hidden: !this.view
    }, {
      title: '发放工资银行卡号',
      field: 'payRollBankCardNumber',
      bankCard: true
    }, {
      title: '发放银行卡支行名称',
      field: 'bankName'
    }, {
      title: '工资卡银行联号',
      field: 'bankLinkNumber'
    }, {
      title: '工资卡银行',
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
        if(!params.teamSysNo) {
          params.teamSysNo = this.teamSysNo;
        }
        if(!params.workerCode) {
          params.workerCode = this.parCode;
        }
        params.issueCardPicUrl = formatImg(params.issueCardPicUrl);
        return true;
      },
      onOk: () => {
        this.props.history.push('/project/member');
      }
    });
  }
}

export default ProjectMemberAddEdit;
