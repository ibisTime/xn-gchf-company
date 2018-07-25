import React from 'react';
import {
  setTableData,
  setPagination,
  setBtnList,
  setSearchParam,
  clearSearchParam,
  doFetching,
  cancelFetching,
  setSearchData
} from '@redux/newProj/project-leijifaxin';
import { listWrapper } from 'common/js/build-list';
import { getQueryString, showWarnMsg, showSucMsg, getUserKind, getUserId } from 'common/js/util';
import { getUserDetail } from 'api/user';

@listWrapper(
  state => ({
    ...state.newProjProjectLeijifaxin,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class Leijifaxin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectCodeList: ''
    };
    this.projectCode = getQueryString('projectCode', this.props.location.search);
  };
  componentDidMount() {
    if (getUserKind() === 'O') {
      getUserDetail(getUserId()).then((data) => {
        console.log(data);
        this.setState({ 'projectCodeList': data.projectCodeList });
      });
    }
  }
  render() {
    const fields = [{
      title: '项目名称',
      field: 'projectName'
    }, {
      title: '所属月份',
      field: 'month',
      search: true
    }, {
      title: '累计发薪',
      field: 'totalFactAmount'
    }, {
      title: '领薪人数',
      field: 'number'
    }, {
      title: '共计扣款',
      field: 'totalCutAmount',
      amount: true
    }];
    if (getUserKind() === 'O') {
      return this.state.projectCodeList ? this.props.buildList({
        fields,
        searchParams: {
          projectCode: this.projectCode,
          projectCodeList: this.state.projectCodeList,
          kind: 'O'
        },
        pageCode: 631448,
        rowKey: 'staffCode',
        buttons: []
      }) : null;
    } else {
      return this.props.buildList({
        fields,
        searchParams: { projectCode: this.projectCode, updater: '' },
        pageCode: 631448,
        rowKey: 'staffCode',
        buttons: []
      });
    }
  }
}

export default Leijifaxin;
