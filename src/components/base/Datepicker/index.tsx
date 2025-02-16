import { setHours, setMinutes, setSeconds, subDays } from "date-fns";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import "react-datepicker/dist/react-datepicker-cssmodules.css";
import "./datepicker.css";

import CustomInput from "./CustomInput";

interface BaseDatepickerProps {
  defaultValue?: Date;
  value?: Date | null;
  onChange?: (date: Date) => void;
  titleEnd?: string;
  placeholder?: string;
}

const BaseDatepicker = ({
  defaultValue,
  value,
  onChange,
  titleEnd,
  placeholder = "Select Date",
}: BaseDatepickerProps) => {
  const [startDate, setStartDate] = useState<Date | null>(defaultValue || null);
  const [minTime, setMinTime] = useState<Date>(
    setHours(setMinutes(new Date(), 0), 0)
  );
  const [maxTime, setMaxTime] = useState<Date>(
    setHours(setMinutes(new Date(), 30), 23)
  );

  const handleDateChange = (date: Date | null) => {
    setStartDate(date);
    if (onChange && date) {
      onChange(date);
    }
  };

  useEffect(() => {
    // if the date is today, set the min and max time to the current time
    if (startDate && startDate.toDateString() === new Date().toDateString()) {
      setMinTime(
        setHours(
          setMinutes(setSeconds(new Date(), 0), new Date().getMinutes()),
          new Date().getHours()
        )
      );
      setMaxTime(setHours(setMinutes(setSeconds(new Date(), 0), 30), 23));
      // if the date is not today, set the min and max time to the current time
    } else {
      setMinTime(setHours(setMinutes(setSeconds(new Date(), 0), 0), 0));
      setMaxTime(setHours(setMinutes(setSeconds(new Date(), 0), 30), 23));
    }
  }, [startDate]);

  useEffect(() => {
    if (value) {
      setStartDate(value);
    }
  }, [value]);

  return (
    <DatePicker
      selected={startDate}
      onChange={handleDateChange}
      showTimeSelect
      excludeTimes={[
        setHours(setMinutes(new Date(), 0), 17),
        setHours(setMinutes(new Date(), 30), 18),
        setHours(setMinutes(new Date(), 30), 19),
        setHours(setMinutes(new Date(), 30), 17),
      ]}
      dateFormat="MMMM d, yyyy h:mm aa"
      customInput={<CustomInput className="react-datepicker-input" titleEnd={titleEnd} placeholder={placeholder} />}
      placeholderText={placeholder}
      minDate={subDays(new Date(), 0)}
      minTime={minTime}
      maxTime={maxTime}
      // calendarClassName="rasta-stripes"
      // timeClassName=""
      // withPortal
    />
  );
};

export default BaseDatepicker;
