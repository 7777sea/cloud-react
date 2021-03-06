import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { noop } from '@utils';
import Header from '../common/header';
import Grid from './grid';
import { displayNow, transformObj } from '../utils';

class DatePicker extends Component {
	constructor(props) {
		super(props);

		const { checkValue } = props;

		const now = displayNow();

		this.state = {
			tempYear: checkValue ? checkValue.year : now.year,
			tempMonth: checkValue ? checkValue.month : now.month,
			tempDay: checkValue ? checkValue.day : null
		};
	}

	componentDidUpdate(prevProps) {
		if (prevProps.checkDateObj !== this.props.checkDateObj) {
			this.updateState();
		}
	}

	updateState() {
		const { year, month, day } = this.props;
		this.setState({
			tempYear: year,
			tempMonth: month,
			tempDay: day
		});
	}

	onHeaderChange = (year, month) => {
		this.setState({
			tempYear: year,
			tempMonth: month
		});
	};

	onPickDate = ({ year, month, day }) => {
		this.setState({
			tempYear: year,
			tempMonth: month,
			tempDay: day
		});
	};

	render() {
		const { minDate, maxDate, showTimePicker, maxYear, minYear, onChange, checkValue, defaultTime } = this.props;
		const { tempYear, tempMonth, tempDay } = this.state;

		return (
			<>
				<Header
					min={transformObj(minDate)}
					max={transformObj(maxDate)}
					year={tempYear}
					month={tempMonth}
					maxYear={maxYear}
					minYear={minYear}
					onChange={this.onHeaderChange}
				/>
				<Grid
					defaultTime={defaultTime}
					checkValue={checkValue}
					day={tempDay}
					month={tempMonth}
					year={tempYear}
					minDate={minDate || new Date(`${minYear}/1/1`)}
					maxDate={maxDate || new Date(`${maxYear}/12/31`)}
					showTimePicker={showTimePicker}
					onPickDate={this.onPickDate}
					onOK={onChange}
				/>
			</>
		);
	}
}

DatePicker.propTypes = {
	minDate: PropTypes.instanceOf(Date),
	maxDate: PropTypes.instanceOf(Date),
	checkValue: PropTypes.object,
	showTimePicker: PropTypes.bool,
	onChange: PropTypes.func
};

DatePicker.defaultProps = {
	showTimePicker: false,
	checkValue: undefined,
	minDate: undefined,
	maxDate: undefined,
	onChange: noop
};

export default DatePicker;
