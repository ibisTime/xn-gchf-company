import React from 'react';
import fetch from 'common/js/fetch';
import { Modal } from 'antd';
import XLSX from 'xlsx';
import {
  setTableData,
  setPagination,
  setBtnList,
  setSearchParam,
  clearSearchParam,
  doFetching,
  cancelFetching,
  setSearchData
} from '@redux/newProj/kaoqin';
import ModalDetail from 'common/js/build-modal-detail';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg, getQueryString, dateTimeFormat, getUserId, getUserKind } from 'common/js/util';
import { getUserDetail } from 'api/user';
import PopUp from '../../../component/pop-up/pop-up';

@listWrapper(
  state => ({
    ...state.newProjKaoqin,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class Kaoqin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectCode: '',
      projectName: '',
      popUp: false,
      title: '',
      content: '打卡后，将以正常出工的出工状态计工资，且不可更改，是否进行手动打卡？',
      mode: '',
      okText: ''
    };
    this.code = getQueryString('code', this.props.location.search);
  }
  componentDidMount() {
    getUserDetail(getUserId()).then((data) => {
      this.setState({ projectCode: data.projectCode, projectName: data.projectName });
    });
  };
  // 弹窗事件
  changeState = (who, value) => {
    switch (who) {
      case 'popUp':
        this.setState({ popUp: value });
        break;
      case 'projectCurStatus':
        this.setState({ projectCurStatus: value });
    }
  };
  getPageData = () => {
    this.props.getPageData();
  };
  render() {
    const fields = [{
      field: 'projectName',
      title: '工程名称'
    }, {
      field: 'staffName',
      title: '员工姓名'
    }, {
      field: 'startDatetime',
      title: '上班时间',
      type: 'datetime'
    }, {
      field: 'endDatetime',
      title: '下班时间',
      type: 'datetime'
    }, {
      field: 'status',
      title: '出工状态',
      type: 'select',
      key: 'attendance_status',
      search: true
    }, {
      field: 'settleDatetime',
      title: '结算时间',
      type: 'date'
    }, {
      field: 'createDatetime1',
      title: '考勤生成时间',
      type: 'datetime',
      formatter: (v, d) => {
        return dateTimeFormat(d.createDatetime);
      }
    }, {
      field: 'createDatetime',
      title: '考勤生成日期',
      search: true,
      type: 'date',
      hidden: true
    }, {
      field: 'keyword',
      title: '关键字',
      placeholder: '姓名',
      search: true,
      hidden: true
    }];
    const shangbanOptions = {
      fields: [{
        field: 'attendanceStartDatetime',
        title: '开始时间',
        type: 'datetime',
        required: true
      }, {
          field: 'attendanceEndDatetime',
          title: '结束时间',
          type: 'datetime',
          required: true
        }],
      addCode: 631390,
      beforeSubmit: (param) => {
        param.codeList = this.kaoqinCode;
        return param;
      },
      onOk: () => {
        this.props.getPageData();
      }
    };
    const xiabanOptions = {
      fields: [{
        field: 'attendanceStartDatetime',
        title: '开始时间',
        type: 'datetime',
        required: true
      }, {
        field: 'attendanceEndDatetime',
        title: '结束时间',
        type: 'datetime',
        required: true
      }],
      addCode: 631391,
      beforeSubmit: (param) => {
        param.codeList = this.kaoqinCode;
        return param;
      },
      onOk: () => {
        this.props.getPageData();
      }
    };
    return this.state.projectCode ? (
        <div>
          {this.props.buildList({
            fields,
            searchParams: {projectCode: this.state.projectCode},
            pageCode: 631395,
            singleSelect: false,
            buttons: [
              {
                code: 'export',
                name: '导出',
                handler: (selectedRowKeys, selectedRows) => {
                  fetch(631395, {projectCode: this.state.projectCode, limit: 10000, start: 1}).then((data) => {
                    let tableData = [];
                    let title = [];
                    fields.map((item) => {
                      if (item.title !== '关键字' && item.title !== '开始时间' && item.title !== '结束时间' && item.title !== '考勤生成日期') {
                        title.push(item.title);
                      }
                    });
                    tableData.push(title);
                    data.list.map((item) => {
                      let temp = [];
                      this.props.searchData.status.map((v) => {
                        if (v.dkey === item.status) {
                          item.status = v.dvalue;
                        }
                      });
                      temp.push(item.projectName,
                          item.staffName,
                          item.startDatetime ? dateTimeFormat(item.startDatetime) : '',
                          item.endDatetime ? dateTimeFormat(item.endDatetime) : '',
                          item.status,
                          item.settleDatetime ? dateTimeFormat(item.settleDatetime) : '',
                          item.createDatetime ? dateTimeFormat(item.createDatetime) : '',
                          item.remark
                      );
                      tableData.push(temp);
                    });
                    const ws = XLSX.utils.aoa_to_sheet(tableData);
                    const wb = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
                    XLSX.writeFile(wb, this.state.projectName + '考勤记录.xlsx');
                  });
                }
              },
              {
                code: 'shangbandaka',
                name: '上班打卡',
                handler: (selectedRowKeys, selectedRows) => {
                  if (!selectedRowKeys.length) {
                    showWarnMsg('请选择记录');
                  } else {
                    this.setState({
                      popUp: true,
                      title: '进行上班打卡',
                      mode: 'shangban',
                      okText: '确认打卡'
                    });
                    this.kaoqinCode = selectedRowKeys;
                  }
                }
              },
              {
                code: 'xiabandaka',
                name: '下班打卡',
                handler: (selectedRowKeys, selectedRows) => {
                  if (!selectedRowKeys.length) {
                    showWarnMsg('请选择记录');
                  } else {
                    this.setState({
                      popUp: true,
                      title: '进行下班打卡',
                      mode: 'xiaban',
                      okText: '确认打卡'
                    });
                    this.kaoqinCode = selectedRowKeys;
                  }
                }
              }
              ]
          })}
          < ModalDetail
              title='上班时间'
              visible={this.state.showShangban}
              hideModal={() => this.setState({showShangban: false})}
              options={shangbanOptions} />
          <ModalDetail
              title='下班时间'
              visible={this.state.showXiaban}
              hideModal={() => this.setState({showXiaban: false})}
              options={xiabanOptions} />
          <PopUp popUpVisible={this.state.popUp}
                 title={this.state.title}
                 content={this.state.content}
                 okText={this.state.okText}
                 changeState={this.changeState}
                 mode={this.state.mode}
                 projectCode={this.state.projectCode}
                 kaoqinCode={this.kaoqinCode}
                 getPageData={this.getPageData}/>
            </div>
          ) : null;
  }
}

export default Kaoqin;
