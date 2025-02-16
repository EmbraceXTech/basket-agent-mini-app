import { Input, Select, SelectItem } from "@heroui/react";
import { useEffect, useState } from "react";

import useStepperStore from "@/stores/createAgent.store";

import FormHeader from "./FormHeader";
import BaseDatepicker from "@/components/base/Datepicker";

export default function Step4() {
  const { data, setData, canNext, setCanNext } = useStepperStore();
  const [intervalSet, setIntervalSet] = useState({
    interval: "1",
    intervalUnit: "hour",
  });
  // const [endDate, setEndDate] = useState<ZonedDateTime | null>(
  //   now(getLocalTimeZone())
  // );
  const [endDate, setEndDate] = useState<Date | null>(
    null
  );
  useEffect(() => {
    if (endDate) {
      setData({
        endDate: endDate,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate]);
  useEffect(() => {
    if (intervalSet.interval && intervalSet.intervalUnit) {
      const unit = intervalSet.intervalUnit;
      const interval = parseInt(intervalSet.interval);
      if (unit === "minute") {
        setData({
          intervalSeconds: interval * 60,
        });
      } else if (unit === "hour") {
        setData({
          intervalSeconds: interval * 60 * 60,
        });
      } else if (unit === "day") {
        setData({
          intervalSeconds: interval * 60 * 60 * 24,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [intervalSet]);
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
      <FormHeader
        title="Select Interval"
        description="Choose one of the templates or create a custom one with prompt."
      />
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Trading Settings</h2>
        <div className="flex gap-2">
          <Input
            type="number"
            label="Interval"
            value={intervalSet.interval}
            onChange={(e) =>
              setIntervalSet((prev) => ({ ...prev, interval: e.target.value }))
            }
          />
          <Select
            label="Unit"
            selectedKeys={[intervalSet.intervalUnit]}
            onChange={(e) =>
              setIntervalSet((prev) => ({
                ...prev,
                intervalUnit: e.target.value,
              }))
            }
          >
            <SelectItem key="minute" value="minute">
              Minutes
            </SelectItem>
            <SelectItem key="hour" value="hour">
              Hours
            </SelectItem>
            <SelectItem key="day" value="day">
              Days
            </SelectItem>
          </Select>
        </div>
      </div>

      <div className="w-full flex flex-row gap-4 mt-4">
        {/* <DatePicker
          hideTimeZone
          showMonthAndYearPickers
          defaultValue={now(getLocalTimeZone())}
          label="End Date"
          // variant="bordered"
          value={endDate}
          onChange={(e) => setEndDate(e)}
        /> */}
      </div>
      <div className="flex-1">
        <BaseDatepicker value={endDate} onChange={(e) => setEndDate(e)} titleEnd="End Date" />
      </div>
    </div>
  );
}
