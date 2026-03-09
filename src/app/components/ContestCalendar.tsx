import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});


/* PLATFORM LOGOS */

const platformLogos: Record<string, string> = {
  leetcode: "https://leetcode.com/favicon.ico",
  codechef: "https://cdn.codechef.com/images/cc-logo.svg",
  codeforces: "https://sta.codeforces.com/s/97983/images/codeforces-logo-with-telegram.png",
  atcoder: "https://img.atcoder.jp/assets/atcoder.png",
  hackerearth: "https://hackerearth.global.ssl.fastly.net/static/hackerearth/images/logo/HE_logo.png",
  geeksforgeeks: "https://media.geeksforgeeks.org/gfg-gg-logo.svg",
};


/* CUSTOM EVENT CARD */

const EventCard = ({ event }: any) => {
  const logo =
  platformLogos[event.platform?.toLowerCase()] ||
  "https://cdn-icons-png.flaticon.com/512/1828/1828884.png";
  return (
    <div className="contest-event">
      <img src={logo} className="contest-logo" />

      <span className="contest-title">
        {event.name}
      </span>
    </div>
  );
};


/* MAIN COMPONENT */

export default function ContestCalendar({ contests }: any) {

  const events = contests.map((c: any) => {

    const start = new Date(c.date);

    return {
      title: c.name,
      name: c.name,
      platform: c.platform,
      start: start,
      end: new Date(start.getTime() + (c.duration || 7200) * 1000),
    };
  });


  return (
    <div className="calendar-wrapper bg-card border border-border rounded-2xl p-6">

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        components={{
          event: EventCard,
        }}
        style={{ height: 700 }}
      />

    </div>
  );
}