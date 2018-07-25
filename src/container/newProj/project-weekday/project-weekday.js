import React from 'react';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/newProj/project-weekday';
import { getQueryString, getUserKind, getUserId } from 'common/js/util';
import { getUserDetail } from 'api/user';
import { DetailWrapper } from 'common/js/build-detail';

@DetailWrapper(
  state => state.newProjProjectWeekday,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)
class ProjectWeekday extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      companyCode: ''
    };
    this.code = getQueryString('code', this.props.location.search);
    this.projectCode = getQueryString('projectCode', this.props.location.search);
  }
  componentDidMount() {
    getUserDetail(getUserId()).then((data) => {
      console.log(data);
      this.setState({ companyCode: data.companyCode });
    });
  };
  render() {
    const fields = [{
      title: '项目名称',
      field: 'projectCode',
      value: this.projectCode,
      hidden: true
    }, {
      field: 'staffCode',
      value: this.code,
      hidden: true
    }, {
      title: '开始时间',
      field: 'startDatetime',
      required: true,
      type: 'date'
    }, {
      title: '请假天数',
      field: 'leaveDays',
      required: true,
      number: true
    }, {
      title: '备注',
      field: 'remark'
    }];
    return this.props.buildDetail({
      fields,
      addCode: 631461
    });
  }
}

export default ProjectWeekday;
