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
      projectCodeList: '',
      companyCode: '',
      companyName: ''
    };
    this.code = getQueryString('code', this.props.location.search);
  }
  componentDidMount() {
    if (getUserKind() === 'S' || getUserKind() === 'O') {
      getUserDetail(getUserId()).then((data) => {
        this.setState({
          projectCodeList: data.projectCodeList,
          companyCode: data.companyCode,
          companyName: data.companyName
        });
      });
    };
  }
  render() {
    const fields = [{
      field: 'projectName',
      title: '工程名称',
      search: true
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
      key: 'attendance_status'
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
    const fieldso = [{
      field: 'projectName',
      title: '工程名称',
      search: true
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
      key: 'attendance_status'
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
        field: 'startDatetime',
        title: '上班时间',
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
        field: 'endDatetime',
        title: '下班时间',
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
    if (getUserKind() === 'O' || getUserKind() === 'S') {
      return this.state.projectCodeList ? (
        <div>
          {this.props.buildList({
            fields,
            searchParams: { projectCodeList: this.state.projectCodeList },
            pageCode: 631395,
            singleSelect: false,
            buttons: getUserKind() === 'O' ? [{
              code: 'export',
              name: '导出',
              handler: (selectedRowKeys, selectedRows) => {
                fetch(631395, { projectCode: this.projectCode, limit: 10000, start: 1 }).then((data) => {
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
                  XLSX.writeFile(wb, this.state.companyName + '考勤记录.xlsx');
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
                    showShangban: true
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
                    showXiaban: true
                  });
                  this.kaoqinCode = selectedRowKeys;
                }
              }
            }] : [{
              code: 'export',
              name: '导出',
              handler: (selectedRowKeys, selectedRows) => {
                fetch(631395, { projectCode: this.projectCode, limit: 10000, start: 1 }).then((data) => {
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
                  XLSX.writeFile(wb, this.state.companyName + '考勤记录.xlsx');
                });
              }
            }]
          })}
          <ModalDetail
              title='上班时间'
              visible={this.state.showShangban}
              hideModal={() => this.setState({ showShangban: false })}
              options={shangbanOptions} />
          <ModalDetail
          title='下班时间'
          visible={this.state.showXiaban}
          hideModal={() => this.setState({ showXiaban: false })}
          options={xiabanOptions} />
        </div>
      ) : null;
    } else {
      return this.props.buildList({
        fields: fieldso,
        pageCode: 631395,
        buttons: [{
          code: 'export',
          name: '导出',
          handler: (selectedRowKeys, selectedRows) => {
            fetch(631395, { projectCode: this.projectCode, limit: 10000, start: 1 }).then((data) => {
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
              XLSX.writeFile(wb, this.state.companyName + '考勤记录.xlsx');
            });
          }
        }]
      });
    }
  }
}

export default Kaoqin;
