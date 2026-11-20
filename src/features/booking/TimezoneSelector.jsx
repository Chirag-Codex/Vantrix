import { Globe } from 'lucide-react';

const COMMON_TIMEZONES = [
  { value: 'Asia/Kolkata', label: 'India Standard Time (IST, GMT+5:30)' },
  { value: 'America/New_York', label: 'Eastern Time (US & Canada, EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US & Canada, PST/PDT)' },
  { value: 'America/Chicago', label: 'Central Time (US & Canada, CST/CDT)' },
  { value: 'Europe/London', label: 'Greenwich Mean Time (London, GMT/BST)' },
  { value: 'Europe/Berlin', label: 'Central European Time (Berlin, CET/CEST)' },
  { value: 'Asia/Singapore', label: 'Singapore Time (SGT, GMT+8:00)' },
  { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST, GMT+9:00)' },
  { value: 'Australia/Sydney', label: 'Australian Eastern Time (AEST/AEDT)' },
];

export function TimezoneSelector({ value, onChange, timezone, onSelectTimezone }) {
  const selectedValue = value ?? timezone;
  const handleChange = onChange ?? onSelectTimezone;

  return (
    <div className="flex items-center gap-2 rounded-[14px] border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-xs text-[var(--muted)]">
      <Globe className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
      <span className="font-semibold text-[var(--text)]">Timezone:</span>
      <select
        value={selectedValue}
        onChange={(e) => handleChange?.(e.target.value)}
        className="flex-1 cursor-pointer bg-transparent text-xs text-[var(--text)] focus:outline-none"
        aria-label="Select booking timezone"
      >
        {COMMON_TIMEZONES.map((tz) => (
          <option key={tz.value} value={tz.value}>
            {tz.label}
          </option>
        ))}
      </select>
    </div>
  );
}
