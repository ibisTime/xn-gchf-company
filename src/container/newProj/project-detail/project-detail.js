import React from 'react';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/newProj/project-detail';
import { getQueryString, getUserKind } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';

@DetailWrapper(
  state => state.newProjProjectDetail,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class ProjectDetail extends React.Component {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
    this.type = getUserKind();
  }
  render() {
    const fields = [{
      title: '项目名称',
      field: 'projectName',
      _keys: ['report', 'projectName']
    }, {
      title: '今日上工人数',
      field: 'todayDays',
      _keys: ['report', 'todayDays']
    }, {
      title: '累计出工人次',
      field: 'workingDays',
      _keys: ['report', 'workingDays']
    }, {
      title: '目前在职人数',
      field: 'staffOn',
      _keys: ['report', 'staffOn']
    }, {
      title: '累计入职人数',
      field: 'staffIn',
      _keys: ['report', 'staffIn']
    }, {
      title: '累计离职人数',
      field: 'staffOut',
      _keys: ['report', 'staffOut']
    }, {
      title: '累计请假人次',
      field: 'leavingDays',
      _keys: ['report', 'leavingDays']
    }, {
      title: '上月实际发薪金额',
      field: 'lastMonthSalary',
      _keys: ['report', 'lastMonthSalary'],
      amount: true
    }, {
      title: '下月预计发薪金额',
      field: 'nextMonthSalary',
      _keys: ['report', 'nextMonthSalary'],
      amount: true
    }, {
      title: '累计发薪金额',
      field: 'totalSalary',
      _keys: ['report', 'totalSalary'],
      amount: true
    }, {
      field: 'salaryDelayDays',
      title: '薪资发放可延迟天数',
      readonly: true,
      required: true
    }, {
      title: '备注',
      field: 'remark',
      _keys: ['report', 'remark']
    }];
    return this.props.buildDetail({
      fields,
      code: this.code,
      view: this.view,
      detailCode: 631358,
      addCode: 631040,
      editCode: 631042
    });
  }
}

export default ProjectDetail;
