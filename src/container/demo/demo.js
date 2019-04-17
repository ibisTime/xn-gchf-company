import React, { Component } from 'react';
import fetch from 'common/js/fetch';
import { Upload, Icon, message, Button, Input } from 'antd';
import html2canvas from 'html2canvas';
import timg from './timg.png';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg' || 'image/png';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}

export default class DemoImg extends Component {
  state = {
    uploadToken: '',
    loading: false,
    imageUrl: '',
    cardPassword: '',
    imageP: '',
    imageDiv: ''
  };
  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false
      }, () => {
        const base64Img = info.file.response.hash;
        fetch('600102', {base64Img}).then(data => {
          this.setState({
            cardPassword: data.cardPassword
          });
        });
      }));
    }
  };
  componentDidMount() {
    fetch('600100').then(data => {
      this.setState({
        uploadToken: data.uploadToken
      });
    });
  }
  render() {
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;
    return (
      <div>
        <Upload
          name="file"
          listType="picture-card"
          className="avatar-uploader"
          showUploadList={false}
          action="http://up-z0.qiniu.com"
          beforeUpload={beforeUpload}
          onChange={this.handleChange}
          data={{
            token: this.state.uploadToken
          }}
        >
          {imageUrl ? <img src={imageUrl} alt="avatar" width={400}/> : uploadButton}
        </Upload>
        <div style={{ 'margin': '50px', 'display': 'flex' }}>
          <p style={{
            'position': 'relative',
            'width': '400px',
            'height': '300px',
            'marginLeft': '50px',
            'backgroundImage': `url(${timg})`,
            'backgroundSize': '100% 100%'}}
             ref={(target) => {
               this.state.imageP = target;
             }}
          >
            <span style={{'position': 'absolute', 'left': '36%', 'top': '18%'}}>{this.state.cardPassword}</span>
          </p>
          <div style={{
            'width': '400px',
            'height': '300px',
            'marginLeft': '50px'
          }}
               ref={(target) => {
                 this.state.imageDiv = target;
               }}
          >
          </div>
          <div style={{'marginLeft': '50px'}}>
            <Input value={this.state.cardPassword} onChange={(ev) => {
              this.setState({
                cardPassword: ev.target.value
              });
            }} style={{'marginBottom': '30px'}}/>
            <Button onClick={() => {
              html2canvas(this.state.imageP).then((canvas) => {
                const baseUrl = canvas.toDataURL();
                var event = new MouseEvent('click');
                this.state.imageDiv.appendChild(canvas);
                let imgA = document.createElement('a');
                imgA.download = '下载图片名称';
                imgA.href = baseUrl;
                imgA.dispatchEvent(event);
              });
            }}>下载图片</Button>
          </div>
        </div>
      </div>
    );
  }
}