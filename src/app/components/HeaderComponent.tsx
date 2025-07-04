import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import Dropdown, { type Option } from "react-dropdown";
import { type TimeSpan } from "../utils/types";
import { Skeleton } from "@mui/material";

const REFRESH_INTERVAL = 30;

interface HeaderProps {
  previousAttempt: Date | null;
  timeSpan: TimeSpan;
  setTimeSpan: Dispatch<SetStateAction<TimeSpan>>;
  refreshWindData: (overrideTimespan?: TimeSpan) => void;
}

export default function HeaderComponent({
  timeSpan,
  previousAttempt,
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
          options={["10", "30", "60", "180"]}
          onChange={handleSelectTimespan}
          value={timeSpan}
          placeholder="Select a timespan"
        />
      </div>
      <SecondsSinceUpdateComponent
        refreshWindData={refreshWindData}
        previousAttempt={previousAttempt}
      />
    </div>
  );
}

const SecondsSinceUpdateComponent = ({
  previousAttempt,
  refreshWindData,
}: {
  previousAttempt: Date | null;
  refreshWindData: () => void;
}) => {
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState<number | null>(
    null,
  );

  useEffect(() => {
    // Function to update the elapsed time
    const updateSeconds = () => {
      if (!previousAttempt) return;
      const now = new Date();
      const previous = previousAttempt;
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
  }, [previousAttempt, refreshWindData]); // Depend on `previousDate` to reset the interval if it changes

  return (
    <div className="mr-3 flex w-[12rem] items-center justify-center">
      Oppdateres om
      {previousAttempt ? (
        <span className="ml-1">
          {secondsSinceUpdate
            ? Math.max(REFRESH_INTERVAL - secondsSinceUpdate, 0)
            : REFRESH_INTERVAL}
          s
        </span>
      ) : (
        <Skeleton className="ml-2 w-5" />
      )}
    </div>
  );
};
