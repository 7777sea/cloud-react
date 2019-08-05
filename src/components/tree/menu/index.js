/**
 * 右键菜单
 * index.js
 * wangbo
 * 2019-07-02
 */

import React, { Component } from 'react';
import ToolTip from '../../tooltip';
import '../index.less';
import TreeContext from '../context';

class TreeMenu extends Component {
	static contextType = TreeContext;

	// 新增节点
	addNode = e => {
		const { disableAdd, options } = this.props;
		if (disableAdd) {
			e.preventDefault();
			return;
		}
		options.showInput();
	};

	// 删除节点
	deleteNode = e => {
		const { disableRemove } = this.props;
		if (disableRemove) {
			e.preventDefault();
			return;
		}
		this.props.deleteNode();
	};

	// 重命名节点
	renameNode = e => {
		const { disableRename, options, name } = this.props;
		if (disableRename) {
			e.preventDefault();
			return;
		}
		options.showInput(name);
	};

	render() {
		const { visible, name, disableRemove, disableAdd, disableRename, menuStyle } = this.props;
		if (!this.context.supportMenu) {
			return null;
		}
		return visible && (
			<ul className="tree-menu" style={menuStyle}>
				<ToolTip content={name} placement="top">
					<span className="tree-menu-node-name">当前节点</span>
				</ToolTip>
				<li role="presentation" className={disableAdd ? 'disabled' : ''} onClick={this.addNode}>新增</li>
				<li role="presentation" className={disableRemove ? 'disabled' : ''} onClick={this.deleteNode}>删除</li>
				<li role="presentation" className={disableRename ? 'disabled' : ''} onClick={this.renameNode}>重命名</li>
			</ul>
		);
	};
}
export default TreeMenu;
