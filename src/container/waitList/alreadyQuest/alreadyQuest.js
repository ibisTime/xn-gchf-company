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
    });
  }
  render() {
    const { projectCode } = this.state;
    const fields = [{
      field: 'month',
      title: '月份'
    }, {
      field: 'number',
      title: '工资条人数（人）'
    }, {
      field: 'totalAmounts',
      title: '共计金额（元)',
      formatter: (v, d) => {
        return moneyFormat(d.totalAmount);
      }
    }, {
      field: 'status',
      title: '状态',
      type: 'select',
      key: 'message_status'
    }, {
      title: '发送时间',
      field: 'sendDatetime',
      type: 'datetime'
    }, {
      title: '完成时间',
      field: 'handleDatetime',
      type: 'datetime'
    }];
    return this.props.buildList({
          fields,
          searchParams: {
            statusList: ['1', '2', '3'],
            projectCode: projectCode,
            kind: 'O'
          },
          pageCode: 631435
        });
  }
}

export default AlreadyQuest;