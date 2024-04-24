import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import Dropdown, { type Option } from "react-dropdown";
import { type TimeSpan, type WindData } from "../types";

const REFRESH_INTERVAL = 30;

interface HeaderProps {
  windData: WindData | null;
  timeSpan: TimeSpan;
  setTimeSpan: Dispatch<SetStateAction<TimeSpan>>;
  refreshWindData: (overrideTimespan?: TimeSpan) => void;
}

export default function HeaderComponent({
  windData,
  timeSpan,
  setTimeSpan,
  refreshWindData,
}: HeaderProps) {
  const handleSelectTimespan = (o: Option) => {
    setTimeSpan(o.value as TimeSpan);
    refreshWindData(o.value as TimeSpan);
  };

  return (
    <div className="mx-4 flex flex-row flex-wrap justify-center gap-3 rounded-lg bg-white py-2 text-black">
      <div className="flex items-center gap-3 rounded pl-3 ">
        Antall minutter:
        <Dropdown
          options={["10", "30", "60"]}
          onChange={handleSelectTimespan}
          value={timeSpan}
          placeholder="Select a timespan"
        />
      </div>
      <SecondsSinceUpdateComponent
        refreshWindData={refreshWindData}
        windData={windData}
      />
    </div>
  );
}

const SecondsSinceUpdateComponent = ({
  windData,
  refreshWindData,
}: {
  windData: WindData | null;
  refreshWindData: () => void;
}) => {
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState<number | null>(
    null,
  );

  useEffect(() => {
    // Function to update the elapsed time
    const updateSeconds = () => {
      if (!windData) return;
      const now = new Date();
      const previous = new Date(windData.timestamp);
      const milliseconds = now.getTime() - previous.getTime();
      const newSeconds = Math.floor(milliseconds / 1000);
      setSecondsSinceUpdate(newSeconds);

      if (newSeconds >= REFRESH_INTERVAL) {
        refreshWindData();
        return;
      }
    };

    // Call the function once on mount to initialize the seconds state
    updateSeconds();

    // Set up an interval to update the seconds every second
    const intervalId = setInterval(updateSeconds, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [refreshWindData, windData]); // Depend on `previousDate` to reset the interval if it changes

  return (
    <div className="mr-3 flex w-[12rem] items-center justify-center">
      Oppdateres om
      {windData && (
        <span className="ml-1">
          {secondsSinceUpdate
            ? Math.max(REFRESH_INTERVAL - secondsSinceUpdate, 0)
            : REFRESH_INTERVAL}
          s
        </span>
      )}
    </div>
  );
};
