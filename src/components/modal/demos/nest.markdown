---
order: 9
title: 嵌套弹窗
desc: 弹出一个提示框，在其内部再弹出一个提示框
---

```javascript
import React from 'react';
import { Button, Modal } from 'cloud-react';

const blank = '\u00A0';

export default class ModalDemo extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false
		};
	}

	// 弹出框
	openNestModal = () => {
		this.setState({
			visible: true
		});
	};

	// 确认按钮回调函数
	handleOk = () => {
		this.setState({
			visible: false
		});
	};

	// 关闭回调函数
	handleClose = () => {
		this.setState({
			visible: false
		});
	};

	handleCancel = () => {
		this.setState({
			visible: false
		});
	};

	openErrorModal = () => {};

	render() {
		return (
			<div>
				<Button type="normal" onClick={this.openNestModal}>
					打开嵌套弹出框
				</Button>
				<Modal
					ignoreFrame
					title="basic title"
					visible={this.state.visible}
					onOk={this.handleOk}
					onCancel={this.handleCancel}
					onClose={this.handleClose}>
					<SecondModal />
				</Modal>
			</div>
		);
	}
}

class SecondModal extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false
		};
	}
	openInfoModal = () => {
		this.setState({
			visible: true
		});
	};

	// 关闭回调函数
	handleClose = () => {
		this.setState({
			visible: false
		});
	};

	render() {
		return (
			<div>
				<Button type="normal" onClick={this.openInfoModal}>
					信息提示弹出框
				</Button>
				<Modal hasFooter={false} title="basic title111" visible={this.state.visible} onClose={this.handleClose}>
					<ConfirmModal />
				</Modal>
			</div>
		);
	}
}

class ConfirmModal extends React.Component {
	openInfoModal = () => {
		Modal.info({
			body: 'something you can write here',
			onCancel: () => {}
		});
	};

	render() {
		return (
			<Button type="normal" onClick={this.openInfoModal}>
				信息提示弹出框
			</Button>
		);
	}
}
```
