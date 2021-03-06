import React, { Component } from 'react';
import PropTypes from 'prop-types';
import jEasy from 'jeasy';
import { noop, prefixCls } from '@utils';
import TreeContext from './context';
import Search from './search';
import TreeList from './list';
import Message from '../message';
import Modal from '../modal';
import Store from './store';
import Menu from './menu';
import './index.less';

const store = new Store();

class Tree extends Component {
	// 默认值， 默认类型与值不匹配
	static defaultProps = {
		style: {},
		className: '',
		searchPlaceholder: '',
		searchMaxLength: '',
		nodeNameMaxLength: '',
		maxLevel: 0,
		isUnfold: false,
		showIcon: false,
		openIconType: 'folder-solid-open',
		closeIconType: 'folder-solid',
		iconColor: '#999',
		supportCheckbox: false,
		supportMenu: false,
		supportSearch: false,
		supportImmediatelySearch: false,
		isAddFront: true,
		selectedValue: [],
		onAddNode: noop,
		onRenameNode: noop,
		onRemoveNode: noop,
		onSelectedNode: noop,
		onSearchResult: noop
	};

	static propsTypes = {
		style: PropTypes.object,
		className: PropTypes.string,
		treeData: PropTypes.array,
		searchPlaceholder: PropTypes.string,
		searchMaxLength: PropTypes.number,
		nodeNameMaxLength: PropTypes.number,
		maxLevel: PropTypes.number,
		isUnfold: PropTypes.bool,
		showIcon: PropTypes.bool,
		openIconType: PropTypes.string,
		closeIconType: PropTypes.string,
		iconColor: PropTypes.string,
		supportCheckbox: PropTypes.bool,
		supportMenu: PropTypes.bool,
		supportSearch: PropTypes.bool,
		supportImmediatelySearch: PropTypes.bool,
		isAddFront: PropTypes.bool,
		selectedValue: PropTypes.array,
		onAddNode: PropTypes.func,
		onRenameNode: PropTypes.func,
		onRemoveNode: PropTypes.func,
		onSelectedNode: PropTypes.func,
		onSearchResult: PropTypes.func
	};

	constructor(props) {
		// 从外部接收到的数据存放到state中，便于子组件对其树数据进行修改
		super(props);

		const treeData = store.initData(props.treeData, props.maxLevel, props.selectedValue, props.isUnfold);

		this.state = {
			visibleMenu: false,
			nodeData: {},
			menuStyle: null,
			menuOptions: null,
			searchText: '',
			treeData: jEasy.clone(treeData),
			allTreeData: jEasy.clone(treeData),
			prevProps: props,
			preSelectedNode: props.selectedValue && props.selectedValue[0]
		};
	}

	// 监听外部回显数据变化
	static getDerivedStateFromProps(nextProps, prevState) {
		const { prevProps } = prevState;

		if (prevProps.selectedValue !== nextProps.selectedValue) {
			return {
				selectedValue: nextProps.selectedValue,
				preSelectedNode: nextProps.selectedValue && nextProps.selectedValue[0],
				prevProps: nextProps,
				treeData: store.initData(nextProps.treeData, prevProps.maxLevel, nextProps.selectedValue, prevProps.isUnfold)
			};
		}

		return null;
	}

	componentDidMount() {
		document.addEventListener('click', this.hideMenu);
		document.addEventListener('scroll', this.hideMenu, true);
	}

	componentWillUnmount() {
		document.removeEventListener('click', this.hideMenu);
		document.removeEventListener('scroll', this.hideMenu, true);
	}

	/**
	 * 更新激活节点
	 * @param data
	 * @param node
	 */
	updateActiveNode = (data, node) => {
		store.updateNodeById(data, node.id, { isActive: true });
		if (this.state.preSelectedNode) {
			store.updateNodeById(data, this.state.preSelectedNode.id, { isActive: false });
		}
	};

	/**
	 * 搜索
	 * @returns {*}
	 */
	onSearchAction = searchText => {
		// 将搜索文字放到state中，供node节点中高亮使用
		this.setState({
			searchText
		});
		const { supportSearch, onSearchNode } = this.props;

		const tmp = jEasy.clone(this.state.allTreeData);

		// 搜索结果数据
		const backTree = store.searchNode(tmp, searchText);

		// 是多选并且存在已多选的节点列表才进行合并数据
		this.setState({
			treeData: [...backTree]
		});

		// 支持搜索则返回搜素结果
		if (supportSearch && onSearchNode) {
			onSearchNode(searchText, backTree);
		}
	};

	/**
	 * 选中节点
	 * @param node
	 */
	onSelectedAction = node => {
		const data = this.state.treeData;
		const { supportCheckbox, onSelectedNode } = this.props;

		// 更新节点选中状态
		this.updateActiveNode(data, node);
		// 单选节点列表
		const radioSelectedList = store.selectedForRadio(data, node);
		// 多选节点列表
		const checkboxSelectedList = this.getSelectedMoreList(data, node);

		const selectedResult = supportCheckbox ? checkboxSelectedList : radioSelectedList;

		// 传递到外部
		onSelectedNode(node, selectedResult);

		// 更新树列表数据
		this.setState({
			treeData: jEasy.clone(data)
		});
		this.setState({ preSelectedNode: node });
	};

	/**
	 * 多选选中节点列表
	 * @param data
	 * @param node
	 * @returns {Array}
	 */
	getSelectedMoreList = (data, node) => {
		const selectedList = [];
		this.updateActiveNode(data, node);
		// 更新checked状态
		const tmp = store.selectedForCheckbox(data, node);
		const filterSelected = selectedData => {
			selectedData.forEach(item => {
				if (item.checked) {
					selectedList.push(item);
				}
				if (item.children && item.children.length) {
					return filterSelected(item.children);
				}
				return selectedList;
			});
		};
		filterSelected(tmp);
		return selectedList;
	};

	/**
	 * 展开/隐藏节点
	 * @param data
	 * @param node
	 */
	onFoldNodeAction = (data, node) => {
		const backData = store.onFoldNode(data, node);
		this.setState({
			treeData: [...backData]
		});
	};

	/**
	 * 新增节点
	 * @param pId
	 * @param value
	 * @param pLevel
	 */
	onAddAction = (pId, value, pLevel) => {
		const { onAddNode, isAddFront, maxLevel } = this.props;
		onAddNode(pId, value)
			.then(res => {
				const newNode = { id: res.data || res.id, name: value, children: [], pId, level: pLevel + 1, disableAdd: maxLevel - pLevel === 1 };
				const treeData = store.addChildNode(this.state.treeData, pId, newNode, isAddFront);
				const allTreeData = store.addChildNode(this.state.allTreeData, pId, newNode, isAddFront);
				// 新增之后重新init判断层级，不然会出现无层级可继续添加问题
				this.setState({
					treeData: jEasy.clone(treeData),
					allTreeData: jEasy.clone(allTreeData)
				});
				Message.success('添加成功');
			})
			.catch(() => {
				Message.error('添加失败');
			});
	};

	/**
	 * 重命名节点
	 * @param id
	 * @param newValue
	 */
	onRenameAction = (id, newValue) => {
		const { onRenameNode } = this.props;
		onRenameNode(id, newValue)
			.then(() => {
				const treeData = store.renameChildNode(this.state.treeData, id, newValue);
				const allTreeData = store.renameChildNode(this.state.allTreeData, id, newValue);
				this.setState({
					treeData: jEasy.clone(treeData),
					allTreeData: jEasy.clone(allTreeData)
				});
				Message.success('更新成功');
			})
			.catch(() => {
				Message.error('更新失败');
			});
	};

	/**
	 * 名称重复校验
	 * @param name
	 */
	onCheckRepeatNameAction = name => {
		return store.checkRepeatName(this.state.treeData, name);
	};

	/**
	 * 删除节点
	 * @param node
	 */
	onRemoveAction = node => {
		const { onRemoveNode } = this.props;
		Modal.confirm({
			isShowIcon: false,
			body: '你确定删除此目录吗?',
			onOk: () => {
				onRemoveNode(node.id, node)
					.then(() => {
						const treeData = store.removeChildNode(this.state.treeData, node);
						const allTreeData = store.removeChildNode(this.state.allTreeData, node, false);
						this.setState({
							treeData: jEasy.clone(treeData),
							allTreeData: jEasy.clone(allTreeData)
						});
					})
					.catch(() => {
						Message.error('删除失败');
					});
			},
			onCancel: () => {}
		});
	};

	onReRenderNode = ({ preNode, currentNode, isEdit = false, isAdd = false, isUnfold }) => {
		const { treeData } = this.state;
		const pre = store.findNodeById(treeData, (preNode || {}).id);
		if (pre) {
			Object.assign(pre, { isEdit: false, isAdd: false });
		}

		const current = store.findNodeById(treeData, (currentNode || {}).id);
		if (current) {
			Object.assign(current, { isEdit, isAdd });
			if (isUnfold !== undefined) {
				Object.assign(current, { isUnfold });
			}
		}
	};

	/**
	 * 显示菜单
	 * @param node
	 * @param menuStyle
	 * @param options
	 */
	showMenu = (node, menuStyle, options) => {
		this.setState({
			visibleMenu: true,
			menuStyle,
			nodeData: node,
			menuOptions: options
		});
	};

	/**
	 * 隐藏菜单
	 */
	hideMenu = () => {
		if (!this.state.visibleMenu) {
			return;
		}
		this.setState({
			visibleMenu: false
		});
	};

	render() {
		const selector = `${prefixCls}-tree`;

		const {
			style,
			className,
			isUnfold,
			searchPlaceholder,
			searchMaxLength,
			supportSearch,
			supportImmediatelySearch,
			nodeNameMaxLength,
			supportCheckbox,
			supportMenu,
			isAddFront,
			showIcon,
			openIconType,
			closeIconType,
			iconColor,
			selectedValue
		} = this.props;

		const { onAddAction, onRenameAction, onRemoveAction, onSelectedAction, onFoldNodeAction, onCheckRepeatNameAction, showMenu, onReRenderNode } = this;
		const { treeData, searchText, nodeData, menuStyle, menuOptions, visibleMenu } = this.state;
		const { id, name, disableAdd, disableRename, disableRemove } = nodeData;

		return (
			<TreeContext.Provider
				value={{
					treeData,
					isUnfold,
					searchText,
					supportCheckbox,
					supportMenu,
					isAddFront,
					nodeNameMaxLength,
					showIcon,
					openIconType,
					closeIconType,
					iconColor,
					selectedValue,
					showMenu,
					onAddAction,
					onRenameAction,
					onRemoveAction,
					onSelectedAction,
					onFoldNodeAction,
					onCheckRepeatNameAction,
					onReRenderNode
				}}>
				<div className={`${selector} ${className}`} style={style}>
					<Search
						prefixCls={selector}
						onSearchAction={this.onSearchAction}
						supportImmediatelySearch={supportImmediatelySearch}
						supportSearch={supportSearch && !supportCheckbox}
						searchPlaceholder={searchPlaceholder}
						searchMaxLength={searchMaxLength}
					/>

					<Menu
						id={id}
						name={name}
						nodeData={nodeData}
						menuStyle={menuStyle}
						prefixCls={selector}
						disableAdd={disableAdd}
						disableRename={disableRename}
						disableRemove={disableRemove}
						options={menuOptions}
						deleteNode={() => this.onRemoveAction(nodeData)}
						visible={visibleMenu}
						onEditNodeBefore={onReRenderNode}
					/>

					{treeData && treeData.length > 0 && <TreeList prefixCls={selector} nodeNameMaxLength={nodeNameMaxLength} data={treeData} />}

					{(!treeData || !treeData.length) && <p>暂无结果</p>}
				</div>
			</TreeContext.Provider>
		);
	}
}

export default Tree;
