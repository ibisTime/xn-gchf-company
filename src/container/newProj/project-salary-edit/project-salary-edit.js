import React from 'react';
import fetch from 'common/js/fetch';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/newProj/project-salary-edit';
import { getQueryString, showSucMsg } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { getBankNameByCode } from 'api/project';
import { getUserId } from 'api/user';

@DetailWrapper(
  state => state.newProjProjectSalaryEdit,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class ProjectSalaryEdit extends React.Component {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
  }
  render() {
    const fields = [{
      title: '员工姓名',
      field: 'staffName',
      readonly: true
    }, {
      title: '所属月份',
      field: 'month',
      readonly: true
    }, {
      title: '正常考勤天数',
      field: 'attendanceDays',
      readonly: true
    }, {
      title: '请假天数',
      field: 'leavingDays',
      readonly: true
    }, {
      title: '迟到小时数',
      field: 'delayHours',
      readonly: true
    }, {
      title: '早退小时数',
      field: 'earlyHours',
      readonly: true
    }, {
      title: '应发工资',
      field: 'shouldAmount',
      amount: true,
      readonly: true
    }, {
      title: '实发工资',
      field: 'factAmount',
      amount: true,
      readonly: true
    }, {
      title: '奖励金额',
      field: 'awardAmount',
      amount: true
    }, {
      title: '扣减金额',
      field: 'cutAmount',
      amount: true
    }, {
      title: '修改原因',
      field: 'applyNote'
    }];
    return this.props.buildDetail({
      fields,
      code: this.code,
      view: this.view,
      detailCode: 631447,
      editCode: 631442,
      beforeSubmit: (params) => {
        params.applyUser = getUserId();
        params.tax = '0';
        return params;
      }
    });
  }
}

export default ProjectSalaryEdit;
