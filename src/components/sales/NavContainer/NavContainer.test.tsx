import { render, screen } from '@testing-library/react-native';
import { MemoryRouter } from 'react-router-dom';
import NavContainer from './NavContainer';

const mockData = [
  { path: '/home', menuTitle: 'Home', menuId: 1 },
  { path: '/settings', menuTitle: 'Settings', menuId: 2 },
];

describe('Test for the component NavContainer', () => {
  test('render component NavContainer', () => {
    render(
      <MemoryRouter>
        <NavContainer data={mockData} isPrimary={false} />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('navcontainer-test')).toBeTruthy();
    expect(screen.getByText('Home')).toBeTruthy();
    expect(screen.getByText('Settings')).toBeTruthy();
  });

  test('render with missing path and undefined data', () => {
    const dataWithMissingPath: any = [{ menuTitle: 'No Path', menuId: 3 }];
    render(
      <MemoryRouter>
        <NavContainer data={dataWithMissingPath} isPrimary={false} />
      </MemoryRouter>,
    );
    expect(screen.getByText('No Path')).toBeTruthy();

    // Cover menuTitle || '' branch
    const dataWithMissingTitle: any = [{ path: '/test', menuId: 4 }];
    render(
      <MemoryRouter>
        <NavContainer data={dataWithMissingTitle} isPrimary={false} />
      </MemoryRouter>,
    );

    render(
      <MemoryRouter>
        <NavContainer data={undefined as any} isPrimary={false} />
      </MemoryRouter>,
    );
    expect(screen.getByTestId('navcontainer-test')).toBeTruthy();
  });
});
