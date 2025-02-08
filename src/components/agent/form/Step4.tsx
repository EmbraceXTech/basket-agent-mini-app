import { DatePicker, Input } from "@heroui/react";
import { now, getLocalTimeZone, ZonedDateTime } from "@internationalized/date";
import { useState } from "react";

export default function Step4() {
  const [interval, setInterval] = useState("1");
  const [endDate, setEndDate] = useState<ZonedDateTime | null>(
    now(getLocalTimeZone())
  );
  return (
    <div>
      <Input
        label="Interval"
        value={interval}
        onChange={(e) => setInterval(e.target.value)}
      />

      <div className="w-full max-w-xl flex flex-row gap-4">
        <DatePicker
          hideTimeZone
          showMonthAndYearPickers
          defaultValue={now(getLocalTimeZone())}
          label="End Date"
          variant="bordered"
          value={endDate}
          onChange={(e) => setEndDate(e)}
        />
      </div>
    </div>
  );
}
