import React, { Component } from "react";
import PropTypes from "prop-types";

import PaginationItem from "./pagination";

const noop = () => {};

class Pagination extends Component {
	static propTypes = {
		current: PropTypes.number,
		defaultCurrent: PropTypes.number,
		pageSize: PropTypes.number,
		defaultPageSize: PropTypes.number,
		pageSizeOptions: PropTypes.array,
		total: PropTypes.number,
		onChange: PropTypes.func,
		onShowSizeChange: PropTypes.func,
		showPageSizeOptions: PropTypes.bool,
		showQuickJumper: PropTypes.bool
	};

	static defaultProps = {
		current: undefined,
		defaultCurrent: 1,
		pageSize: undefined,
		defaultPageSize: 10,
		pageSizeOptions: [10, 20, 30, 40],
		total: 0,
		onChange: noop,
		onShowSizeChange: noop,
		showPageSizeOptions: false,
		showQuickJumper: false
	};

	render() {
		return <PaginationItem {...this.props} />;
	}
}

export default Pagination;
