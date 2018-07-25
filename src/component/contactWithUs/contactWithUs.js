import React from 'react';
import { Collapse } from 'antd';
import { getUserId } from 'common/js/util';
import './contactWithUs.css';
import erweima from './erweima.jpeg';
import close from './close.png';
import yzxj1 from './yz_xj_1.png';
import yzxj2 from './yz_xj_2.png';
import yzxj3 from './yz_xj_3.png';
import yzxj4 from './yz_xj_4.png';
import yzxj5 from './yz_xj_5.png';
import yzxj6 from './yz_xj_6.png';
import yzxj7 from './yz_xj_7.png';
import yzxj8 from './yz_xj_8.png';
import yzjd1 from './yz_jd_1.png';
import yzjd2 from './yz_jd_2.png';
import yzjd3 from './yz_jd_3.png';
import yzjd4 from './yz_jd_4.png';
import yzjd5 from './yz_jd_5.png';
import yzjd6 from './yz_jd_6.png';
import yzgz1 from './yz_gz_1.png';
import yzgz2 from './yz_gz_2.png';
import yzgz3 from './yz_gz_3.png';
import yzgz4 from './yz_gz_4.png';
import yzgz5 from './yz_gz_5.png';
import yzgz6 from './yz_gz_6.png';
import yzgz7 from './yz_gz_7.png';
import yhgz1 from './yh_gz_1.png';
import yhgz2 from './yh_gz_2.png';
import yhgz3 from './yh_gz_3.png';
import yhgz4 from './yh_gz_4.png';
import yhgz5 from './yh_gz_5.png';
import jgyc1 from './jg_yc_1.png';
import jgyc2 from './jg_yc_2.png';
const Panel = Collapse.Panel;

class ContactWithUs extends React.Component {
  constructor(props) {
    super(props);
    this.text = 'https://gw.alipayobjects.com/zos/rmsportal/DkKNubTaaVsKURhcVGkh.svg';
    this.state = {
      modal1Visible: false,
      modal2Visible: false,
      contact: false,
      help: false
    };
  }
  tab(index) {
    this.props.setContactWithUsVisible(true, event, index === 1 ? 1 : 2);
    // index === 1 ? this.setState({ contact: true, help: false }) : this.setState({ help: true, contact: false });
  }
  render() {
    const panelStyle = {
      background: 'transparent'
    };
    return (
        <div className="modal-out ant-modal-mask" style={{ display: this.props.contactWithUsVisible ? 'block' : 'none' }}>
          <div className="my-modal">
            <div className="tab">
              <div className={['tab-item', this.props.contact && 'choose'].join(' ')} onClick={() => { this.tab(1); }}><span>联系我们</span></div>
              <div className={['tab-item', !this.props.contact && 'choose'].join(' ')} onClick={() => { this.tab(2); }}><span>操作指引</span></div>
              <div className="close" onClick={(e) => { this.props.setContactWithUsVisible(false, event); }}><img src={close} alt=""/></div>
            </div>
            <div className="content">
              { this.props.contact
                  ? <div className="contact">
                    <div className="contact-top">
                      <p>软件客服微信：15372288898或扫描二维码添加</p>
                      <p>在线时间：9：30--17：30</p>
                      <p>紧急情况可来电咨询</p>
                    </div>
                    <div className="contact-content">
                      <img src={erweima} alt=""/>
                    </div>
                  </div>
                  : this.props.kind === 'O'
                  ? <div className="help">
                        <Collapse accordion onChange={this.collapseChange} className="home-collapse1" defaultActiveKey={['1']}>
                          <Panel header="新建项目流程" key="1" style={panelStyle}>
                            <img src={yzxj1} alt=""/>
                            <img src={yzxj2} alt=""/>
                            <img src={yzxj3} alt=""/>
                            <img src={yzxj4} alt=""/>
                            <img src={yzxj5} alt=""/>
                            <img src={yzxj6} alt=""/>
                            <img src={yzxj7} alt=""/>
                            <img src={yzxj8} alt=""/>
                          </Panel>
                          <Panel header="建档操作流程" key="2" style={panelStyle}>
                            <img src={yzjd1} alt=""/>
                            <img src={yzjd2} alt=""/>
                            <img src={yzjd3} alt=""/>
                            <img src={yzjd4} alt=""/>
                            <img src={yzjd5} alt=""/>
                            <img src={yzjd6} alt=""/>
                          </Panel>
                          <Panel header="工资发放流程" key="3" style={panelStyle}>
                            <p>说明：工资条分为自动生成和手动生成，自动生成时间为新建项目时填写的【工资条形成时间】。员工需要有正常的考勤记录（存在上班打卡和下班打卡时间）才能生成工资条，工资条生成之后将发送给银行端进行工资代发。以下流程为手动生成工资条：</p>
                            <img src={yzgz1} alt=""/>
                            <img src={yzgz2} alt=""/>
                            <img src={yzgz3} alt=""/>
                            <img src={yzgz4} alt=""/>
                            <img src={yzgz5} alt=""/>
                            <img src={yzgz6} alt=""/>
                            <img src={yzgz7} alt=""/>
                          </Panel>
                        </Collapse>
                      </div>
                      : this.props.kind === 'B'
                      ? <div className="help">
                        <Collapse accordion onChange={this.collapseChange} className="home-collapse1" defaultActiveKey={['1']}>
                          <Panel header="工资发放流程" key="1" style={panelStyle}>
                            <img src={yhgz1} alt=""/>
                            <img src={yhgz2} alt=""/>
                            <img src={yhgz3} alt=""/>
                            <img src={yhgz4} alt=""/>
                            <img src={yhgz5} alt=""/>
                          </Panel>
                        </Collapse>
                      </div>
                          : this.props.kind === 'S' && <div className="help">
                        <Collapse accordion onChange={this.collapseChange} className="home-collapse1" defaultActiveKey={['1']}>
                          <Panel header="事件处理流程" key="1" style={panelStyle}>
                            <p>当银行端少发工资，并且业主端补发之后，可以在【异常查看】中看到相关处理信息，并将工资条转化为正常。</p>
                            <img src={jgyc1} alt=""/>
                            <img src={jgyc2} alt=""/>
                          </Panel>
                        </Collapse>
                      </div>
              }
            </div>
          </div>
        </div>
    );
  }
}
//
// ReactDOM.render(<App />, mountNode);

export default ContactWithUs;
