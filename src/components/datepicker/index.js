import Datepicker from './date-picker';
import MonthDayPicker from './month-day';
import TimePicker from './time-picker';
import YearPicker from './year';
import YearMonthPicker from './year-month';
import './index.less';

Object.assign(Datepicker, {
	TimePicker,
	YearPicker,
	YearMonthPicker,
	MonthDayPicker
});

export default Datepicker;
