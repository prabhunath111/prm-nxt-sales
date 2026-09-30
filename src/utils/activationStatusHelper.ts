import { SUBSCRIBER_STATUS } from 'const';
import { t } from 'i18next';
import { Colors } from 'styles';

export const getStatus = (status: string, t: any) => {
  switch (status) {
    case SUBSCRIBER_STATUS.ACTIVE:
      return {
        statusText: t('subscriberStatus.Active'),
        statusColor: Colors.appColors.activeGreen,
        statusBackgroundColor: Colors.appColors.activeGreenBackground,
      };
    case SUBSCRIBER_STATUS.PENDING_ACTIVATION:
      return {
        statusText: t('subscriberStatus.Pending'),
        statusColor: Colors.appColors.pendingYellow,
        statusBackgroundColor: Colors.appColors.pendingYellowBackground,
      };
    case SUBSCRIBER_STATUS.PENDING:
      return {
        statusText: t('subscriberStatus.Pending'),
        statusColor: Colors.appColors.pendingYellow,
        statusBackgroundColor: Colors.appColors.pendingYellowBackground,
      };
    case SUBSCRIBER_STATUS.BLACKLISTED:
      return {
        statusText: t('subscriberStatus.Blacklisted'),
        statusColor: Colors.neutral.g750,
        statusBackgroundColor: Colors.neutral.g350,
      };
    case SUBSCRIBER_STATUS.CANCELLED:
      return {
        statusText: t('subscriberStatus.Cancelled'),
        statusColor: Colors.neutral.g750,
        statusBackgroundColor: Colors.neutral.g350,
      };
    case SUBSCRIBER_STATUS.CANCEL_PENDING:
      return {
        statusText: t('subscriberStatus.CancelPending'),
        statusColor: Colors.neutral.g750,
        statusBackgroundColor: Colors.neutral.g350,
      };
    case SUBSCRIBER_STATUS.DEACTIVATED:
      return {
        statusText: t('subscriberStatus.Deactivated'),
        statusColor: Colors.neutral.g750,
        statusBackgroundColor: Colors.neutral.g350,
      };
    case SUBSCRIBER_STATUS.SUSPENDED:
      return {
        statusText: t('subscriberStatus.Suspended'),
        statusColor: Colors.neutral.g750,
        statusBackgroundColor: Colors.neutral.g350,
      };
    case SUBSCRIBER_STATUS.TEMP_SUSPENSION:
      return {
        statusText: t('subscriberStatus.TempSuspension'),
        statusColor: Colors.neutral.g750,
        statusBackgroundColor: Colors.neutral.g350,
      };
    default:
      return {
        statusText: status,
        statusColor: Colors.neutral.g750,
        statusBackgroundColor: Colors.neutral.g350,
      };
  }
};

export const formatTransDate = (rawDate: string | null | undefined, dateOnly?: boolean): string => {
  if (!rawDate) return t(`strings.notAvailable`);

  const dateObj = new Date(rawDate);
  if (Number.isNaN(dateObj.getTime())) return t(`strings.notAvailable`);

  const day = dateObj.getDate();
  const month = dateObj.toLocaleString('default', { month: 'short' });
  const year = dateObj.getFullYear();

  let hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert to 12-hour format
  hours %= 12;
  hours = hours === 0 ? 12 : hours;

  // Pad minutes with leading zero if needed
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;

  return dateOnly ? `${day} ${month} ${year}` : `${day} ${month} ${year} ${hours}:${minutesStr} ${ampm}`;
};

export const maskNumber = (num?: string | number) => {
  if (!num) return '';
  const str = String(num);
  if (str.length <= 4) return str;
  const first2 = str.slice(0, 2);
  const last2 = str.slice(-2);
  const middle = '*'.repeat(str.length - 4);
  return `${first2}${middle}${last2}`;
};
