import * as React from 'react';
import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import endOfWeek from 'date-fns/endOfWeek';
import isSameDay from 'date-fns/isSameDay';
import isWithinInterval from 'date-fns/isWithinInterval';
import startOfWeek from 'date-fns/startOfWeek';
import {DatePicker} from "@mui/x-date-pickers";
import moment, {Moment} from "moment";
import {pl} from "date-fns/locale";

type CustomPickerDayProps = PickersDayProps<Date> & {
	dayIsBetween: boolean;
	isFirstDay: boolean;
	isLastDay: boolean;
};

const CustomPickersDay = styled(PickersDay, {
	shouldForwardProp: (prop) =>
		prop !== 'dayIsBetween' && prop !== 'isFirstDay' && prop !== 'isLastDay',
})<CustomPickerDayProps>(({ theme, dayIsBetween, isFirstDay, isLastDay }) => ({
	...(dayIsBetween && {
		borderRadius: 0,
		backgroundColor: theme.palette.primary.main,
		color: theme.palette.common.white,
		'&:hover, &:focus': {
			backgroundColor: theme.palette.primary.dark,
		},
	}),
	...(isFirstDay && {
		borderTopLeftRadius: '50%',
		borderBottomLeftRadius: '50%',
	}),
	...(isLastDay && {
		borderTopRightRadius: '50%',
		borderBottomRightRadius: '50%',
	}),
})) as React.ComponentType<CustomPickerDayProps>;


interface WeekPickerProps {
	label: string,
	date: Moment,
	onChange: (newDate: Moment) => void,
}

const WeekPicker: React.FC<WeekPickerProps> = ({label, date, onChange}) => {

	const renderWeekPickerDay = (
		currentDate: Date,
		selectedDates: Array<Date | null>,
		pickersDayProps: PickersDayProps<Date>,
	) => {
		if (!date) {
			return <PickersDay {...pickersDayProps} />;
		}

		const start = startOfWeek(date.toDate(), {locale: pl});
		const end = endOfWeek(date.toDate(), {locale: pl});

		const dayIsBetween = isWithinInterval(currentDate, { start, end });
		const isFirstDay = isSameDay(currentDate, start);
		const isLastDay = isSameDay(currentDate, end);

		return (
			<CustomPickersDay
				{...pickersDayProps}
				disableMargin
				dayIsBetween={dayIsBetween}
				isFirstDay={isFirstDay}
				isLastDay={isLastDay}

			/>
		);
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns} locale={pl}>
			<DatePicker
				label={label}
				value={date.toDate()}
				onChange={(newValue) => onChange(moment(newValue))}
				disablePast
				renderDay={renderWeekPickerDay}
				renderInput={(params) => <TextField {...params} sx={{width: "100%"}}/>}
				inputFormat={`${date.startOf("week").get("D")} - ${date.endOf("week").get("D")}.MM.yyyy`}
				// inputFormat={`dd-MM-yyyy`}
			/>
		</LocalizationProvider>
	);
}

export default WeekPicker;
