import React from 'react';
import {
  initStates,
  doFetching,
  cancelFetching,
  setSelectData,
  setPageData,
  restore
} from '@redux/waitList/alreadyQuest-addedit';
import { getQueryString, showSucMsg, formatDate, showWarnMsg, moneyFormat } from 'common/js/util';
import { DetailWrapper } from 'common/js/build-detail';
import { Button, Card } from 'antd';
import { downLoad, detailDate, downNum } from 'api/downLoad';
import XLSX from 'xlsx';

@DetailWrapper(
  state => state.waitListAlreadyQuestAddedit,
  { initStates, doFetching, cancelFetching, setSelectData, setPageData, restore }
)

class AlreadyQuestAddedit extends React.Component {
  constructor(props) {
    super(props);
    this.code = getQueryString('code', this.props.location.search);
    this.view = !!getQueryString('v', this.props.location.search);
    this.handleExport = this.handleExport.bind(this);
    this.handleExport1 = this.handleExport1.bind(this);
    this.state = {
      data: [],
      cols: [],
      bankcardNumber: '',
      handleDatetime: '',
      bankName: '',
      download: '',
      projectName: '',
      sendDatetime: '',
      status: '',
      backDownload: '',
      title: '',
      companyName: ''
    };
  };
  componentDidMount() {
    detailDate(this.code).then((data) => {
      console.log(data);
      this.setState({
        bankcardNumber: data.bankcardNumber,
        handleDatetime: data.handleDatetime,
        bankName: data.bankName,
        projectName: data.projectName,
        sendDatetime: data.sendDatetime,
        status: data.status,
        download: data.download,
        backDownload: data.backDownload,
        title: data.title,
        accountName: data.companyCard.accountName,
        companyName: data.companyCard.companyName
      });
    });
  }
  downNum(flag) {
    let { backDownload, download } = this.state;
    if (flag) {
      backDownload += 1;
    } else {
      download += 1;
    }
    downNum(this.code, backDownload, download).then((data) => {
      this.setState({
        download: data.download,
        backDownload: data.backDownload
      });
    });
  }

  goBack() {
    this.props.history.go(-1);
  }
  handleExport1() {
    this.downNum(true);
    downLoad(this.code).then((data) => {
      let payroll1 = [
        ['项目信息'],
        ['项目编号', data[0].projectCode],
        ['扣款帐户户名', data[0].companyCard.accountName],
        ['扣款账户', data[0].companyCard.bankName],
        ['代付工资信息'],
        ['序号', '工资条编号', '真实姓名', '身份证号', '开户行', '支行', '卡号', '应发金额', '已发金额', '发放时间']
      ];
      let payroll2 = data.map((d, i) => {
        return [i + 1, d.code, d.bankCard.staffName, d.staffIdNo, d.bankCard.bankName, d.bankCard.subbranch, d.bankCard.bankcardNumber, moneyFormat(d.factAmount), moneyFormat(d.payAmount), formatDate(d.latePayDatetime)];
      });
      payroll1 = payroll1.concat(payroll2);
      const ws = XLSX.utils.aoa_to_sheet(payroll1);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
      XLSX.writeFile(wb, this.state.projectName + '-' + this.state.title + '反馈.xlsx');
    }, () => { });
  }
  handleExport() {
    this.downNum();
    downLoad(this.code).then((data) => {
      let payroll1 = [
        ['项目信息'],
        ['项目编号', data[0].projectCode],
        ['扣款帐户户名', data[0].companyCard.accountName],
        ['扣款账户', data[0].companyCard.bankName],
        ['代付工资信息'],
        ['序号', '工资条编号', '真实姓名', '身份证号', '开户行', '支行', '卡号', '应发金额', '已发金额', '发放时间']
      ];
      let payroll2 = data.map((d, i) => {
        return [i + 1, d.code, d.bankCard.staffName, d.staffIdNo, d.bankCard.bankName, d.bankCard.subbranch, d.bankCard.bankcardNumber, moneyFormat(d.factAmount), '', ''];
      });
      // let payroll2 = data.map((d, i) => {
      //   d.map((item, j) => {
      //     return [j + 1, d.code, d.bankCard.staffName, d.companyCard.bankName, d.companyCard.bankcardNumber, moneyFormat(d.factAmount), '', ''];
      //   });
      // });
      payroll1 = payroll1.concat(payroll2);
      const ws = XLSX.utils.aoa_to_sheet(payroll1);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'SheetJS');
      XLSX.writeFile(wb, this.state.projectName + '-' + this.state.title + '.xlsx');
    }, () => { });
  }
  render() {
    return (
      <div>
        <Card style={{ width: '100%', borderColor: 'rgba(153,212,255,0.6)', boxShadow: '0px 0px 30px rgba(153,212,255,0.6) inset' }}>
          <p style={{ fontSize: '16px' }}>{this.state.title + '工资'}</p>
          <p>公司名称：{this.state.companyName}</p>
          <p style={{ marginRight: '20px' }}>项目名称：{this.state.projectName}</p>
          <p>请求时间：{formatDate(this.state.sendDatetime)}</p>
          <p>代发账户户名：{this.state.accountName}</p>
          <p>代发账户账号：{this.state.bankcardNumber}</p>
          <div style={{ width: '92px', height: '92px', border: '1px solid #99d4ff', borderRadius: '4px', display: 'inline-block', padding: '22px 25px', margin: '0 26px 26px 0' }}>
           <img src={require('./gongzidan.png')} ></img>
          </div>
          <Button onClick={this.handleExport} type="primary" style={{ marginBottom: '12px', position: 'relative', top: '-20px', left: '0px' }}>点击下载</Button>
          <span style={{ position: 'relative', left: '-70px', top: '20px', fontSize: '12px', color: '#999' }}>下载次数{this.state.download}</span>
          <div style={{ border: '0.5px solid #e6e6e6', height: '0px', marginBottom: '26px' }}></div>
          <p style={{ fontSize: '16px' }}>{this.state.title + '工资反馈'}</p>
          <p>反馈时间：{formatDate(this.state.handleDatetime)}</p>
          <div style={{ width: '92px', height: '92px', border: '1px solid #99d4ff', borderRadius: '4px', display: 'inline-block', padding: '22px 25px', marginRight: '26px' }}>
           <img src={require('./ziliao.png')} ></img>
          </div>
          <div style={{ position: 'relative' }}>
            { this.state.status === '3'
              ? <Button onClick={this.handleExport1} type="primary" style={{ position: 'absolute', top: '-77px', left: '116px' }}>点击下载</Button>
                : ''
            }
            <span style={{ position: 'absolute', left: '132px', top: '-32px', fontSize: '12px', color: '#999' }}>下载次数{this.state.backDownload}</span>
          </div>
        </Card>
        <Button onClick={this.goBack.bind(this)} style={{ marginTop: 20 }}>返回</Button>
      </div>
    );
  }
}

export default AlreadyQuestAddedit;
