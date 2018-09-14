import React from 'react';
import fetch from 'common/js/fetch';
import {
  setTableData,
  setPagination,
  setBtnList,
  setSearchParam,
  clearSearchParam,
  doFetching,
  cancelFetching,
  setSearchData
} from '@redux/projectStaff/projectStaff';
import { listWrapper } from 'common/js/build-list';
import { showWarnMsg, showSucMsg, getUserKind, getUserId, formatDate } from 'common/js/util';
import { getUserDetail } from 'api/user';
import { Modal } from 'antd';

@listWrapper(
  state => ({
    ...state.projectStaff,
    parentCode: state.menu.subMenuCode
  }),
  {
    setTableData, clearSearchParam, doFetching, setBtnList,
    cancelFetching, setPagination, setSearchParam, setSearchData
  }
)
class ProjectStaff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pageCode: null,
      projectCode: ''
    };
  }
  componentDidMount() {
    let userKind = getUserKind();
    this.setState({ userKind });
    getUserDetail(getUserId()).then((data) => {
      this.setState({ 'projectCode': data.projectCode });
    });
  }
  render() {
    const featStatusData = [{
      dkey: '0',
      dvalue: '无效'
    }, {
      dkey: '1',
      dvalue: '有效'
    }];
    const featStatusObj = {
      0: '无效',
      1: '有效'
    };
    const pict1StatusData = [{
      dkey: '0',
      dvalue: '未拍摄'
    }, {
      dkey: '1',
      dvalue: '已拍摄'
    }];
    const pict1StatusObj = {
      0: '未拍摄',
      1: '已拍摄'
    };
    const fields = [{
      field: 'staffName',
      title: '姓名'
    }, {
      field: 'idNo',
      title: '身份证号码',
      formatter: (v, d) => {
        return d.staff.idNo;
      }
    }, {
      field: 'mobile',
      title: '手机号',
      formatter: (v, d) => {
        return d.staff.mobile;
      }
    }, {
      field: 'departmentName',
      title: '部门'
    }, {
      field: 'position',
      title: '职位',
      type: 'select',
      key: 'position_type'
    }, {
      field: 'status',
      title: '雇佣状态',
      type: 'select',
      key: 'staff_status'
    }, {
      field: 'pict1Status',
      title: '图片信息',
      formatter: (v, d) => {
        return pict1StatusObj[d.staff.pict1Status];
      }
    }, {
      field: 'featStatus',
      title: '特征值状态',
      formatter: (v, d) => {
        return featStatusObj[d.staff.featStatus];
      }
    }, {
      field: 'keyword',
      title: '关键字查询',
      placeholder: '姓名/手机号',
      hidden: true,
      search: true
    }, {
      field: 'departmentCode',
      placeholder: '部门',
      listCode: '631036',
      params: {
        projectCode: this.state.projectCode
      },
      keyName: 'code',
      valueName: 'name',
      type: 'select',
      search: true,
      hidden: true
    }, {
      field: 'pict1Status',
      placeholder: '图片信息',
      data: pict1StatusData,
      type: 'select',
      keyName: 'dkey',
      valueName: 'dvalue',
      hidden: true,
      search: true
    }, {
      field: 'featStatus',
      placeholder: '特征值状态',
      data: featStatusData,
      type: 'select',
      keyName: 'dkey',
      valueName: 'dvalue',
      hidden: true,
      search: true
    }];
    const btnEvent = {
      // 请假
      weekday: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectStaff/projectStaff/weekday?code=${selectedRows[0].code}&projectCode=${selectedRows[0].projectCode}`);
        }
      },
      // 离职
      quit: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectStaff/projectStaff/quit?code=${selectedRows[0].staffCode}&projectCode=${selectedRows[0].projectCode}`);
        }
      },
      // 详情
      detail: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectStaff/projectStaff/addedit?v=1&code=${selectedRowKeys[0]}&staffCode=${selectedRows[0].staffCode}`);
        }
      },
      // 重新入职
      reruzhi: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectStaff/projectStaff/ruzhiInfo?code=${selectedRows[0].code}&reruzhi=1&staffCode=${selectedRows[0].staffCode}`);
        }
      },
      // 补录合同
      addContract: (selectedRowKeys) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectStaff/projectStaff/addContract?code=${selectedRowKeys[0]}&projectCode=${this.state.projectCode}`);
        }
      },
      // 拍摄免冠照
      takePhoto: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          this.props.history.push(`/projectStaff/projectStaff/takePhoto?staffCode=${selectedRows[0].staffCode}&idNo=${selectedRows[0].staff.idNo}`);
        }
      },
      // 提取特征值
      getFeat: () => {
        Modal.confirm({
          okText: '确认',
          cancelText: '取消',
          content: '确定提取特征值？',
          onOk: () => {
            this.props.doFetching();
            fetch(631094, { projectCode: this.state.projectCode }).then((res) => {
              if(res.staffNames) {
                showSucMsg(res.staffNames + '的特征值提取成功');
              } else {
                showSucMsg('特征值提取成功人数：0');
              }
              this.props.cancelFetching();
              this.props.getPageData();
            }).catch(this.props.cancelFetching);
          }
        });
      },
      // 验证特征值
      checkFeat: (selectedRowKeys, selectedRows) => {
        if (!selectedRowKeys.length) {
          showWarnMsg('请选择记录');
        } else if (selectedRowKeys.length > 1) {
          showWarnMsg('请选择一条记录');
        } else {
          if(selectedRows[0].staff.featStatus === '1') {
            this.props.history.push(`/projectStaff/projectStaff/checkFeat?staffCode=${selectedRows[0].staffCode}&idNo=${selectedRows[0].staff.idNo}`);
          } else {
            showWarnMsg('特征值无效，无法进行验证');
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
    return this.state.projectCode ? this.props.buildList({
      fields,
      btnEvent,
      searchParams: {
        updater: '',
        projectCode: this.state.projectCode
      },
      pageCode: 631465
    }) : null;
  }
}

export default ProjectStaff;
