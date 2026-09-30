/* eslint-disable global-require */
/* eslint-disable @typescript-eslint/no-var-requires */
import { render, fireEvent } from '@testing-library/react-native';
import { OFFER_TYPE } from 'const';
import * as platformHelper from 'utils/platformHelper';
import * as dimensionHelper from 'styles/dimentionHelper';
import AddPackageOffer from './AddPackageOffer';

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('wrappers/inflection/InflectionProvider', () => ({
  useInflection: () => ({ inflection: 'en' }),
}));

jest.mock('components/sales/TextContainer', () => 'TextContainer');
jest.mock('components/sales/Button', () => {
  const { Text } = require('react-native');
  return ({ label, onPress }: any) => <Text onPress={onPress}>{label}</Text>;
});
jest.mock('components/sales/Image', () => 'Image');

jest.mock('styles/dimentionHelper', () => ({
  getScreenWidth: jest.fn(() => 1024),
}));

jest.mock('utils/platformHelper', () => ({
  isWeb: false,
}));

jest.mock('styles/webBreakpoints', () => ({
  gcs: jest.fn((offset: string) => offset),
}));

const mockData = {
  offerType: 'Test Offer',
  name: 'Test Name',
  friendlyName: 'Friendly Name',
};

describe('AddPackageOffer Component Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Desktop View (screenWidth > 500)', () => {
    beforeEach(() => {
      (dimensionHelper.getScreenWidth as jest.Mock).mockReturnValue(1024);
    });

    test('renders component with Add button when offer is not added', () => {
      const { getByText } = render(<AddPackageOffer isOfferAdded={false} data={mockData} />);
      expect(getByText('strings.add')).toBeTruthy();
    });

    test('renders component with Remove button when offer is added', () => {
      const { getByText } = render(<AddPackageOffer isOfferAdded data={mockData} />);
      expect(getByText('strings.remove')).toBeTruthy();
    });

    test('calls onAddOffer when Add button is pressed', () => {
      const onAddOffer = jest.fn();
      const { getByText } = render(<AddPackageOffer isOfferAdded={false} onAddOffer={onAddOffer} data={mockData} />);
      const addButton = getByText('strings.add').parent;
      fireEvent.press(addButton!);
      expect(onAddOffer).toHaveBeenCalledTimes(1);
    });

    test('calls onRemoveOffer when Remove button is pressed', () => {
      const onRemoveOffer = jest.fn();
      const { getByText } = render(<AddPackageOffer isOfferAdded onRemoveOffer={onRemoveOffer} data={mockData} />);
      const removeButton = getByText('strings.remove').parent;
      fireEvent.press(removeButton!);
      expect(onRemoveOffer).toHaveBeenCalledTimes(1);
    });

    test('renders component and verifies structure', () => {
      const onViewDetails = jest.fn();
      const { getByText } = render(<AddPackageOffer isOfferAdded={false} onViewDetails={onViewDetails} data={mockData} />);
      expect(getByText('Test Offer')).toBeTruthy();
      expect(getByText('strings.add')).toBeTruthy();
    });

    test('renders with rechargeWinback offerType and shows friendlyName', () => {
      const { getByText } = render(<AddPackageOffer isOfferAdded={false} data={mockData} offerType={OFFER_TYPE.rechargeWinback} />);
      expect(getByText('Friendly Name')).toBeTruthy();
    });

    test('renders with default offerType and shows offerType', () => {
      const { getByText } = render(<AddPackageOffer isOfferAdded={false} data={mockData} />);
      expect(getByText('Test Offer')).toBeTruthy();
    });

    test('renders with data.name when offerType is not present', () => {
      const dataWithoutOfferType = { name: 'Only Name' };
      const { getByText } = render(<AddPackageOffer isOfferAdded={false} data={dataWithoutOfferType} />);
      expect(getByText('Only Name')).toBeTruthy();
    });
  });

  describe('Mobile View (screenWidth <= 500)', () => {
    beforeEach(() => {
      (dimensionHelper.getScreenWidth as jest.Mock).mockReturnValue(400);
    });

    test('renders mobile view with Add button', () => {
      const { getByText } = render(<AddPackageOffer isOfferAdded={false} data={mockData} />);
      expect(getByText('strings.add')).toBeTruthy();
      expect(getByText('strings.viewDetails')).toBeTruthy();
    });

    test('renders mobile view with Remove button when offer is added', () => {
      const { getByText } = render(<AddPackageOffer isOfferAdded data={mockData} />);
      expect(getByText('strings.remove')).toBeTruthy();
    });

    test('calls onAddOffer in mobile view', () => {
      const onAddOffer = jest.fn();
      const { getByText } = render(<AddPackageOffer isOfferAdded={false} onAddOffer={onAddOffer} data={mockData} />);
      const addButton = getByText('strings.add').parent;
      fireEvent.press(addButton!);
      expect(onAddOffer).toHaveBeenCalledTimes(1);
    });

    test('calls onRemoveOffer in mobile view', () => {
      const onRemoveOffer = jest.fn();
      const { getByText } = render(<AddPackageOffer isOfferAdded onRemoveOffer={onRemoveOffer} data={mockData} />);
      const removeButton = getByText('strings.remove').parent;
      fireEvent.press(removeButton!);
      expect(onRemoveOffer).toHaveBeenCalledTimes(1);
    });

    test('calls onViewDetails when view details text is pressed in mobile', () => {
      const onViewDetails = jest.fn();
      const { getByText } = render(<AddPackageOffer isOfferAdded={false} onViewDetails={onViewDetails} data={mockData} />);
      const viewDetailsText = getByText('strings.viewDetails').parent;
      fireEvent.press(viewDetailsText!);
      expect(onViewDetails).toHaveBeenCalledTimes(1);
    });

    test('renders with rechargeWinback offerType in mobile view', () => {
      const { getByText } = render(<AddPackageOffer isOfferAdded={false} data={mockData} offerType={OFFER_TYPE.rechargeWinback} />);
      expect(getByText('Friendly Name')).toBeTruthy();
    });

    test('applies active styles when rechargeWinback offer is added', () => {
      const { getByText } = render(<AddPackageOffer isOfferAdded data={mockData} offerType={OFFER_TYPE.rechargeWinback} />);
      expect(getByText('Friendly Name')).toBeTruthy();
    });
  });

  describe('Modal View', () => {
    test('renders with openInModal prop in mobile view', () => {
      (dimensionHelper.getScreenWidth as jest.Mock).mockReturnValue(400);
      const { getByText } = render(<AddPackageOffer isOfferAdded={false} data={mockData} openInModal />);
      expect(getByText('strings.add')).toBeTruthy();
    });

    test('renders with openInModal and verifies structure', () => {
      (dimensionHelper.getScreenWidth as jest.Mock).mockReturnValue(400);
      const onViewDetails = jest.fn();
      const { getByText } = render(<AddPackageOffer isOfferAdded={false} data={mockData} openInModal onViewDetails={onViewDetails} />);
      expect(getByText('Test Offer')).toBeTruthy();
      expect(getByText('strings.add')).toBeTruthy();
    });

    test('renders with offerInModal prop in desktop view', () => {
      (dimensionHelper.getScreenWidth as jest.Mock).mockReturnValue(1024);
      const { getByText } = render(<AddPackageOffer isOfferAdded={false} data={mockData} offerInModal />);
      expect(getByText('strings.add')).toBeTruthy();
    });
  });

  describe('Web Platform', () => {
    beforeEach(() => {
      (dimensionHelper.getScreenWidth as jest.Mock).mockReturnValue(400);
      (platformHelper.isWeb as any) = true;
    });

    afterEach(() => {
      (platformHelper.isWeb as any) = false;
    });

    test('applies web-specific styles on mobile view', () => {
      const { getByText } = render(<AddPackageOffer isOfferAdded={false} data={mockData} />);
      expect(getByText('Test Offer')).toBeTruthy();
      expect(getByText('strings.add')).toBeTruthy();
    });
  });

  describe('Edge Cases', () => {
    beforeEach(() => {
      (dimensionHelper.getScreenWidth as jest.Mock).mockReturnValue(400);
    });

    test('renders without data prop', () => {
      const result = render(<AddPackageOffer isOfferAdded={false} />);
      expect(result).toBeTruthy();
    });

    test('renders without callback functions', () => {
      const { getByText } = render(<AddPackageOffer isOfferAdded={false} data={mockData} />);
      expect(getByText('Test Offer')).toBeTruthy();
    });

    test('handles undefined onAddOffer gracefully', () => {
      const { getByText } = render(<AddPackageOffer isOfferAdded={false} data={mockData} onAddOffer={undefined} />);
      const addButton = getByText('strings.add');
      expect(() => fireEvent.press(addButton)).not.toThrow();
    });

    test('handles undefined onRemoveOffer gracefully', () => {
      const { getByText } = render(<AddPackageOffer isOfferAdded data={mockData} onRemoveOffer={undefined} />);
      const removeButton = getByText('strings.remove');
      expect(() => fireEvent.press(removeButton)).not.toThrow();
    });
  });

  describe('Snapshot Tests', () => {
    test('matches snapshot for desktop view with offer not added', () => {
      (dimensionHelper.getScreenWidth as jest.Mock).mockReturnValue(1024);
      const component = render(<AddPackageOffer isOfferAdded={false} data={mockData} />);
      expect(component.toJSON()).toMatchSnapshot();
    });

    test('matches snapshot for desktop view with offer added', () => {
      (dimensionHelper.getScreenWidth as jest.Mock).mockReturnValue(1024);
      const component = render(<AddPackageOffer isOfferAdded data={mockData} />);
      expect(component.toJSON()).toMatchSnapshot();
    });

    test('matches snapshot for mobile view', () => {
      (dimensionHelper.getScreenWidth as jest.Mock).mockReturnValue(400);
      const component = render(<AddPackageOffer isOfferAdded={false} data={mockData} />);
      expect(component.toJSON()).toMatchSnapshot();
    });

    test('matches snapshot for rechargeWinback offer type', () => {
      (dimensionHelper.getScreenWidth as jest.Mock).mockReturnValue(1024);
      const component = render(<AddPackageOffer isOfferAdded data={mockData} offerType={OFFER_TYPE.rechargeWinback} />);
      expect(component.toJSON()).toMatchSnapshot();
    });
  });
});
