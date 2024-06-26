import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

type DatePickerValueType = {
  label: string;
  defaultValue?: Date | null;
  onDateChange: (dateTime: Dayjs | null) => void;
  validateForm?: boolean;
};

export default function DatePickerValue(props: DatePickerValueType) {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  const [value, setValue] = useState<Dayjs | null>(dayjs(props.defaultValue));

  // update the final state of the date value to parent component
  useEffect(() => {
    props.onDateChange(value);
  }, [value]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={props.label}
        value={value}
        onChange={(newValue) => setValue(newValue)}
        slotProps={{
          textField: {
            InputLabelProps: { shrink: true },
            error: props.validateForm && value === null,
            helperText:
              props.validateForm &&
              value === null &&
              "Please choose a date and time",
          },
        }}
        format="DD/MM/YYYY"
        timezone="Asia/Singapore"
        sx={{ width: 300 }}
      />
    </LocalizationProvider>
  );
}
