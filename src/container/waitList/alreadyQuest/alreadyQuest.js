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
} from '@redux/waitList/alreadyQuest';
import { listWrapper } from 'common/js/build-list';
import { getUserDetail } from 'api/user';
import cookies from 'browser-cookies';
import { getUserKind, getUserId, moneyFormat } from 'common/js/util';
require('./alreadyQuest.css');

@listWrapper(
  state => ({
    ...state.waitListAlreadyQuest,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class AlreadyQuest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      subbranch: '',
      bankName: '',
      projectCodeList: '',
      projectCode: ''
    };
    this.userKind = getUserKind();
  };
  componentDidMount() {
    getUserDetail(getUserId()).then((data) => {
      this.setState({
        subbranch: data.subbranch,
        bankName: data.bankName,
        projectCodeList: data.projectCodeList,
        projectCode: data.projectCode
      });
      console.log(data);
    });
  }
  render() {
    const fields = [{
      title: '项目名称',
      field: 'projectName'
    }, {
      title: '标题',
      field: 'title'
    }, {
      field: 'bankName',
      title: '开户行',
      render: (v, d) => {
        return d.bankName + d.subbranch;
      }
    }, {
      field: 'bankcardNumber',
      title: '账户'
    }, {
      field: 'totalAmounts',
      title: '本月累计发薪',
      render: (v, d) => {
        return moneyFormat(d.totalAmount);
      }
    }, {
      title: '状态',
      field: 'status',
      key: 'message_status',
      type: 'select'
    }, {
      title: '请求时间',
      field: 'sendDatetime',
      type: 'datetime'
    }, {
      title: '完成时间',
      field: 'handleDatetime',
      type: 'datetime'
    }];
    return this.state.projectCode
        ? this.props.buildList({
          fields,
          searchParams: {
            statusList: ['1', '2', '3'],
            projectCode: this.state.projectCode,
            kind: 'O'
          },
          pageCode: 631435
        })
        : null;
  }
}

export default AlreadyQuest;