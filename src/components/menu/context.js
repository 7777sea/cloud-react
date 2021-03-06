import React from 'react';

const MenuContext = React.createContext({
	openKeys: [],
	selectedKeys: [],
	changeSelectedKeys: () => {}
});

export const types = {
	LINK: 'link', // link类型
	COMMON: 'common' // 预设类型
};

export default MenuContext;
