/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { store } from 'store';
import * as dateHelper from 'utils/dateHelper';
import actions from 'store/sales/actions/common';
import uiActions from 'store/sales/actions/ui';
import { PROPERTIES } from 'const';
import DateRangePicker from './DateRangePicker';

// --- Mocks ---

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
}));

jest.mock('store/sales/actions/common', () => ({
  resetCustomFormData: jest.fn(() => ({ type: 'RESET_FORM' })),
  setCustomFormData: jest.fn((data: any) => ({ type: 'SET_FORM', payload: data })),
}));

jest.mock('store/sales/actions/ui', () => ({
  hideBottomModal: jest.fn(() => ({ type: 'HIDE_MODAL' })),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('utils/dateHelper', () => ({
  calculatePastDaysDifference: jest.fn(() => 5),
  formatDateISO: jest.fn((date: any) => (date ? new Date(date).toISOString() : '')),
  formatDateToISO: jest.fn((date: any) => (date ? new Date(date).toISOString() : '')),
  getCurrentDateFormatted: jest.fn((date: any) => (date ? `formatted_${new Date(date).toISOString()}` : '')),
}));

jest.mock('components/sales/Calendar', () => {
  // eslint-disable-next-line global-require
  const { View } = require('react-native');
  return (props: any) => {
    const { maxDate, minDate, currentDate, onDateSelected } = props;
    return <View testID="mock-calendar" testID_maxDate={maxDate} testID_minDate={minDate} testID_currentDate={currentDate} onDateSelected={onDateSelected} />;
  };
});

describe('DateRangePicker Component', () => {
  const renderComponent = (props: any = {}) =>
    render(
      <Provider store={store}>
        <NavigationContainer>
          <DateRangePicker isMultiDates maxDateCount={0 as any} {...props} />
        </NavigationContainer>
      </Provider>,
    );

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-03-25T12:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- Rendering Tests ---
  it('renders correctly', () => {
    renderComponent();
    expect(screen.getByTestId('date-range-picker-test')).toBeTruthy();
  });

  it('renders error text when error prop is provided', () => {
    const { getByText } = renderComponent({ error: 'This is an error', id: 'errorId' });
    expect(getByText('This is an error')).toBeTruthy();
  });

  // --- minDate Logic Tests ---
  it('uses customMinDate when provided', () => {
    const { getByTestId } = renderComponent({ customMinDate: new Date('2026-03-01T00:00:00.000Z') });
    const calendar = getByTestId('mock-calendar');
    expect(calendar.props.testID_minDate).toBe(new Date('2026-03-01T00:00:00.000Z').toISOString());
  });

  it('uses defaultDateSelection when provided without customMinDate', () => {
    // maxDate is 25th. defaultDateSelection = 10 -> minDate = 15th
    const { getByTestId } = renderComponent({ defaultDateSelection: 10, customMaxDate: new Date('2026-03-25T00:00:00.000Z') });
    const calendar = getByTestId('mock-calendar');
    expect(calendar.props.testID_minDate).toBe(new Date('2026-03-15T00:00:00.000Z').toISOString());
  });

  it('falls back to 1900-01-01 when neither minDate props are provided', () => {
    const { getByTestId } = renderComponent();
    const calendar = getByTestId('mock-calendar');
    expect(calendar.props.testID_minDate).toBe(new Date('1900-01-01T00:00:00.000Z').toISOString());
  });

  // --- Date Selection Tests ---
  it('handles multi-date selection properly (start and end within limit)', () => {
    const { getByTestId } = renderComponent({ maxDateCount: 10, customMaxDate: new Date('2026-04-10T00:00:00.000Z') });
    const calendar = getByTestId('mock-calendar');

    fireEvent(calendar, 'dateSelected', { dateString: '2026-03-10T00:00:00.000Z' });
    expect(calendar.props.testID_currentDate).toBe('2026-03-10T00:00:00.000Z');

    fireEvent(calendar, 'dateSelected', { dateString: '2026-03-15T00:00:00.000Z' });

    // Selecting again should reset and set new start date
    fireEvent(calendar, 'dateSelected', { dateString: '2026-03-18T00:00:00.000Z' });
    expect(calendar.props.testID_currentDate).toBe('2026-03-18T00:00:00.000Z');
  });

  it('resets startDate if selected endDate is before startDate', () => {
    const { getByTestId } = renderComponent();
    const calendar = getByTestId('mock-calendar');

    fireEvent(calendar, 'dateSelected', { dateString: '2026-03-20T00:00:00.000Z' });
    fireEvent(calendar, 'dateSelected', { dateString: '2026-03-15T00:00:00.000Z' });
    expect(calendar.props.testID_currentDate).toBe('2026-03-15T00:00:00.000Z');
  });

  it('caps endDate to maxAllowedEndDate if selected endDate exceeds it', () => {
    const { getByTestId, getByText } = renderComponent({ maxDateCount: 3 });
    const calendar = getByTestId('mock-calendar');

    fireEvent(calendar, 'dateSelected', { dateString: '2026-03-10T00:00:00.000Z' });
    // maxAllowedEndDate = 10 + 2 = 12th
    fireEvent(calendar, 'dateSelected', { dateString: '2026-03-15T00:00:00.000Z' });

    fireEvent.press(getByText('strings.selectDate'));

    expect(actions.setCustomFormData).toHaveBeenCalledWith({
      evdMdnChangeFilter: {
        customDateRange: {
          startDate: '10/03/2026',
          endDate: '12/03/2026',
        },
      },
    });
  });

  it('handles single date selection', () => {
    const { getByTestId } = renderComponent({ isMultiDates: false });
    const calendar = getByTestId('mock-calendar');

    fireEvent(calendar, 'dateSelected', { dateString: '2026-03-10T00:00:00.000Z' });
    expect(calendar.props.testID_currentDate).toBe('2026-03-10T00:00:00.000Z');
  });

  // --- getCalendarMaxDate and getDisplayEndDate Tests ---
  it('limits calendar max date when start date is selected and maxDateCount is provided', () => {
    const { getByTestId } = renderComponent({ maxDateCount: 5, customMaxDate: new Date('2026-03-25T00:00:00.000Z') });
    const calendar = getByTestId('mock-calendar');

    // maxAllowedEndDate = 10 + 4 = 14th < originalMaxDate(25th)
    fireEvent(calendar, 'dateSelected', { dateString: '2026-03-10T00:00:00.000Z' });

    expect(calendar.props.testID_maxDate).toBe(new Date('2026-03-14T00:00:00.000Z').toISOString());
  });

  it('uses original max date if maxAllowedEndDate exceeds it', () => {
    const { getByTestId } = renderComponent({ maxDateCount: 20, customMaxDate: new Date('2026-03-25T00:00:00.000Z') });
    const calendar = getByTestId('mock-calendar');

    // maxAllowedEndDate = 10 + 19 = 29th > originalMaxDate(25th)
    fireEvent(calendar, 'dateSelected', { dateString: '2026-03-10T00:00:00.000Z' });
    expect(calendar.props.testID_maxDate).toBe(new Date('2026-03-25T00:00:00.000Z').toISOString());
  });

  it('handles empty string from dateHelper.formatDateISO gracefully for max/min dates', () => {
    (dateHelper.formatDateISO as jest.Mock).mockImplementation(() => '');
    const { getByTestId } = renderComponent({ maxDateCount: 5, customMaxDate: new Date('2026-03-25T00:00:00.000Z') });
    const calendar = getByTestId('mock-calendar');

    fireEvent(calendar, 'dateSelected', { dateString: '2026-03-10T00:00:00.000Z' });

    expect(calendar.props.testID_maxDate).toBe('');
    expect(calendar.props.testID_minDate).toBe('');

    (dateHelper.formatDateISO as jest.Mock).mockImplementation((date: any) => (date ? new Date(date).toISOString() : ''));
  });

  // --- Button Action Tests ---
  it('handles "Clear" button press', () => {
    const { getByText } = renderComponent();
    fireEvent.press(getByText('strings.clear'));
    expect(actions.resetCustomFormData).toHaveBeenCalled();
  });

  it('handles "Select" button for multi-dates with missing end date (falls back to current date/maxAllowed)', () => {
    const { getByTestId, getByText } = renderComponent({ maxDateCount: 5, customMaxDate: new Date('2026-03-25T00:00:00.000Z') });
    const calendar = getByTestId('mock-calendar');

    fireEvent(calendar, 'dateSelected', { dateString: '2026-03-10T00:00:00.000Z' });
    fireEvent.press(getByText('strings.selectDate'));

    // Current date is 25th > maxAllowedEndDate (14th), so it uses 14th
    expect(actions.setCustomFormData).toHaveBeenCalledWith({
      evdMdnChangeFilter: {
        customDateRange: {
          startDate: '10/03/2026',
          endDate: '14/03/2026',
        },
      },
    });
    expect(uiActions.hideBottomModal).toHaveBeenCalled();
  });

  it('handles "Select" button for multi-dates when current endDate is <= maxAllowedEndDate', () => {
    // maxDateCount 20 means maxAllowedEndDate is 30th
    // fall back current endDate is 25th, which is <= 30th
    const { getByTestId, getByText } = renderComponent({ maxDateCount: 20 });
    const calendar = getByTestId('mock-calendar');

    fireEvent(calendar, 'dateSelected', { dateString: '2026-03-10T00:00:00.000Z' });
    fireEvent.press(getByText('strings.selectDate'));

    expect(actions.setCustomFormData).toHaveBeenCalledWith({
      evdMdnChangeFilter: {
        customDateRange: {
          startDate: '10/03/2026',
          endDate: '25/03/2026',
        },
      },
    });
  });

  it('handles "Select" button for multi-dates when no start date is selected (empty string) to cover formatDisplayDate return', () => {
    const { getByText } = renderComponent({ maxDateCount: 5 });

    // Do not select any date. `startDate` is empty string.
    fireEvent.press(getByText('strings.selectDate'));

    expect(actions.setCustomFormData).toHaveBeenCalledWith({
      evdMdnChangeFilter: {
        customDateRange: {
          startDate: '',
          endDate: '25/03/2026', // falls back to current date
        },
      },
    });
  });

  it('handles "Select" button for multi-dates without maxDateCount restriction', () => {
    const { getByTestId, getByText } = renderComponent({ maxDateCount: 0 }); // pass 0 to avoid maxDateCount check failing
    const calendar = getByTestId('mock-calendar');

    fireEvent(calendar, 'dateSelected', { dateString: '2026-03-10T00:00:00.000Z' });
    fireEvent(calendar, 'dateSelected', { dateString: '2026-03-20T00:00:00.000Z' });
    fireEvent.press(getByText('strings.selectDate'));

    expect(actions.setCustomFormData).toHaveBeenCalledWith({
      evdMdnChangeFilter: {
        customDateRange: {
          startDate: '10/03/2026',
          endDate: '20/03/2026',
        },
      },
    });
  });

  it('handles "Select" button for single dates', () => {
    const { getByTestId, getByText } = renderComponent({ isMultiDates: false });
    const calendar = getByTestId('mock-calendar');

    fireEvent(calendar, 'dateSelected', { dateString: '2026-03-10T00:00:00.000Z' });
    fireEvent.press(getByText('strings.selectDate'));

    expect(actions.setCustomFormData).toHaveBeenCalledWith({
      evdMdnChangeFilter: {
        customDateRange: 6, // 5 + 1
        type: PROPERTIES.EVD_MDN_CHANGE_DETAILS.select,
      },
    });
    expect(uiActions.hideBottomModal).toHaveBeenCalled();
  });

  it('handles "Select" button for single dates when days difference is NaN', () => {
    (dateHelper.calculatePastDaysDifference as jest.Mock).mockReturnValueOnce(NaN);
    const { getByTestId, getByText } = renderComponent({ isMultiDates: false });
    const calendar = getByTestId('mock-calendar');

    fireEvent(calendar, 'dateSelected', { dateString: 'invalid-date' });
    fireEvent.press(getByText('strings.selectDate'));

    expect(actions.setCustomFormData).not.toHaveBeenCalled();
    expect(uiActions.hideBottomModal).not.toHaveBeenCalled();
  });
});
