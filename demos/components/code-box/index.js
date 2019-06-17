import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';

import classes from './index.less';

hljs.registerLanguage('javascript', javascript);

export default class CodeBox extends React.Component {
	static propTypes = {
		title: PropTypes.string,
		desc: PropTypes.string,
		code: PropTypes.string,
		children: PropTypes.node
	};

	static defaultProps = {
		title: '标题',
		desc: '描述',
		code: '',
		children: ''
	}

	constructor(props) {
		super(props);
		this.codeBlock = React.createRef();
	}

	state = {
		expand: false
	}

	componentDidMount() {
		const { current } = this.codeBlock;

		hljs.highlightBlock(current);
	}

	onToggle = () => {
		const { expand } = this.state;
		this.setState({ expand: !expand });
	}

	render() {
		const { expand } = this.state;
		const { title, desc, code, children } = this.props;

		return (
			<section className={classes.codeBox}>
				<h4 className={classes.codeBoxTitle}>
					{title}
					<span className={classes.codeBoxDesc}>
						{desc}
					</span>
				</h4>
				<div className={classes.codeBoxDemo}>
					{children}
				</div>
				<div
					className={classnames({
						[classes.codeBoxActions]: true,
						[classes.expand]: expand
					})}
					onClick={this.onToggle}
					role="presentation"
				>
					<span>
						显示代码
					</span>
				</div>

				<pre ref={this.codeBlock} className={classnames({
					[classes.codeBlock]: true,
					[classes.hidden]: !expand
				})}>
					<code dangerouslySetInnerHTML={{ __html: code }} />
				</pre>
			</section>
		);
	}
}
