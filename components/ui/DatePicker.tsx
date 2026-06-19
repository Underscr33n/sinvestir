"use client";

import ReactDatePicker, { registerLocale } from "react-datepicker";
import { fr } from "date-fns/locale/fr";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDays } from "lucide-react";

registerLocale("fr", fr);

interface DatePickerProps {
  value: string; // "YYYY-MM-DD"
  onChange: (v: string) => void;
  minDate?: string;
  maxDate?: string;
}

export function DatePicker({ value, onChange, minDate, maxDate }: DatePickerProps) {
  const selected = value ? new Date(value + "T12:00:00") : null;
  const min = minDate ? new Date(minDate + "T12:00:00") : undefined;
  const max = maxDate ? new Date(maxDate + "T12:00:00") : new Date();

  return (
    <>
      <style>{`
        .si-datepicker-wrapper { width: 100%; position: relative; }
        .si-datepicker-input {
          width: 100%;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--si-border);
          outline: none;
          padding: 8px 32px 8px 0;
          font-size: 1rem;
          color: var(--si-text);
          cursor: pointer;
          font-family: inherit;
        }
        .si-datepicker-icon {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          color: var(--si-text-muted);
          pointer-events: none;
        }
        .si-datepicker-popper { z-index: 9999 !important; }
        .si-datepicker-popper .react-datepicker {
          background: var(--si-bg-card);
          border: 1px solid var(--si-border);
          border-radius: 12px;
          font-family: inherit;
          box-shadow: 0 8px 32px rgba(0,0,0,0.4);
          overflow: hidden;
        }
        .si-datepicker-popper .react-datepicker__header {
          background: var(--si-bg-elevated);
          border-bottom: 1px solid var(--si-border);
          padding: 12px 0 8px;
        }
        .si-datepicker-popper .react-datepicker__current-month,
        .si-datepicker-popper .react-datepicker__day-name {
          color: var(--si-text);
          font-weight: 500;
        }
        .si-datepicker-popper .react-datepicker__day-name { color: var(--si-text-muted); font-size: 0.75rem; }
        .si-datepicker-popper .react-datepicker__day {
          color: var(--si-text);
          border-radius: 6px;
        }
        .si-datepicker-popper .react-datepicker__day:hover {
          background: var(--si-bg-elevated);
        }
        .si-datepicker-popper .react-datepicker__day--selected,
        .si-datepicker-popper .react-datepicker__day--keyboard-selected {
          background: var(--si-primary) !important;
          color: #fff !important;
          border-radius: 6px;
        }
        .si-datepicker-popper .react-datepicker__day--outside-month { color: var(--si-text-muted); opacity: 0.4; }
        .si-datepicker-popper .react-datepicker__day--disabled { opacity: 0.2; cursor: not-allowed; }
        .si-datepicker-popper .react-datepicker__navigation-icon::before { border-color: var(--si-text-muted); }
        .si-datepicker-popper .react-datepicker__year-read-view--down-arrow,
        .si-datepicker-popper .react-datepicker__month-read-view--down-arrow { border-color: var(--si-text-muted); }
        .si-datepicker-popper .react-datepicker__year-dropdown,
        .si-datepicker-popper .react-datepicker__month-dropdown {
          background: var(--si-bg-card);
          border: 1px solid var(--si-border);
          border-radius: 8px;
        }
        .si-datepicker-popper .react-datepicker__year-option,
        .si-datepicker-popper .react-datepicker__month-option {
          color: var(--si-text);
          padding: 4px 0;
        }
        .si-datepicker-popper .react-datepicker__year-option:hover,
        .si-datepicker-popper .react-datepicker__month-option:hover {
          background: var(--si-bg-elevated);
        }
        .si-datepicker-popper .react-datepicker__year-option--selected_year,
        .si-datepicker-popper .react-datepicker__month-option--selected_month {
          background: var(--si-primary);
          color: #fff;
        }
        .si-datepicker-popper .react-datepicker__triangle { display: none; }
        .si-dp-full { width: 100% !important; display: block !important; }
        .si-dp-full .react-datepicker__input-container { width: 100%; }
      `}</style>
      <div className="si-datepicker-wrapper">
        <ReactDatePicker
          selected={selected}
          onChange={(date: Date | null) => {
            if (!date) return;
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, "0");
            const d = String(date.getDate()).padStart(2, "0");
            onChange(`${y}-${m}-${d}`);
          }}
          dateFormat="dd/MM/yyyy"
          locale="fr"
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          minDate={min}
          maxDate={max}
          customInput={<input className="si-datepicker-input" readOnly />}
          wrapperClassName="si-dp-full"
          popperClassName="si-datepicker-popper"
          popperPlacement="bottom-start"
        />
        <CalendarDays size={16} className="si-datepicker-icon" />
      </div>
    </>
  );
}
