import React from 'react';
import { Modal } from 'antd';
import {
  setTableData,
  setPagination,
  setBtnList,
  setSearchParam,
  clearSearchParam,
  doFetching,
  cancelFetching,
  setSearchData
} from '@redux/daifa/daifa';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg, getUserKind, getUserId, moneyFormat } from 'common/js/util';
import ModalDetail from 'common/js/build-modal-detail';
import { getUserDetail } from 'api/user';

@listWrapper(
  state => ({
    ...state.daifaDaifa,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class Daifa extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      code: '',
      projectCode: ''
    };
    getUserDetail(getUserId()).then((data) => {
      this.setState({ 'projectCode': data.projectCode });
    });
  }
  render() {
    const fieldso = [{
      field: 'code',
      title: '编号',
      hidden: true
    }, {
      field: 'projectCode',
      title: '项目编号',
      hidden: true
    }, {
      field: 'companyName',
      title: '公司名称',
      hidden: getUserKind() === 'O'
    }, {
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
      field: 'createDatetime',
      title: '生成时间',
      type: 'datetime'
    }];
    const btnEvent = {
      send: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          if (selectedRows[0].status === '0') {
            this.code = selectedRowKeys[0];
            this.setState({ visible: true });
            this.setState({ code: selectedRowKeys[0] });
          } else {
            showWarnMsg('该状态消息不可发送');
          }
        }
      }
    };
    // 发送消息
    const options = {
      fields: [{
        field: 'code',
        hidden: true,
        value: this.code
      }, {
        field: 'sender',
        hidden: true,
        value: getUserId()
      }, {
        field: 'title',
        title: '标题',
        required: true,
        maxlength: 30
      }],
      addCode: 631430,
      onOk: () => {
        this.props.getPageData();
      }
    };
    return this.state.projectCode ? (
        <div>
          {this.props.buildList({
            fields: fieldso,
            btnEvent,
            searchParams: {
              updater: '',
              projectCode: this.state.projectCode,
              kind: 'O',
              status: 0
            },
            pageCode: 631435,
            rowKey: 'code'
          })}
          <ModalDetail
              title='发送消息'
              visible={this.state.visible}
              hideModal={() => this.setState({ visible: false })}
              options={options} />
        </div>
    ) : null;
  }
}

export default Daifa;
