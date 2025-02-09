import useStepperStore from "@/stores/createAgent.store";
import { DatePicker, Input } from "@heroui/react";
import { now, getLocalTimeZone, ZonedDateTime } from "@internationalized/date";
import { useEffect, useState } from "react";

export default function Step4() {
  const { data, setData, canNext, setCanNext } = useStepperStore();
  const [interval, setInterval] = useState("1");
  const [endDate, setEndDate] = useState<ZonedDateTime | null>(
    now(getLocalTimeZone())
  );
  useEffect(() => {
    setData({
      intervalSeconds: parseInt(interval),
      endDate: endDate?.toDate(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interval, endDate]);
  useEffect(() => {
    if (data.intervalSeconds && data.endDate) {
      setCanNext(true);
    } else {
      setCanNext(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canNext, data.intervalSeconds, data.endDate]);
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
