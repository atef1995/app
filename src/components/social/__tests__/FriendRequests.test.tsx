/**
 * Integration Test for Social Component Null Safety
 * Tests the actual null safety fixes we implemented
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { FriendRequests } from '../FriendRequests';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt, ...props }: { src: string; alt: string; [key: string]: unknown }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} {...props} />
  ),
}));

describe('FriendRequests - Real Null Safety Tests', () => {
  const mockProps = {
    onRequestResponse: jest.fn(),
    onSuccess: jest.fn(),
    onError: jest.fn(),
  };

  test('CRITICAL: handles undefined sender without crashing', () => {
    // This is the exact scenario that was causing the original crash
    const dangerousRequests = [
      {
        id: '1',
        sender: undefined, // This would crash before our fixes
        createdAt: new Date(),
      }
    ] as Parameters<typeof FriendRequests>[0]['requests'];

    // This should NOT throw an error anymore
    expect(() => {
      render(
        <FriendRequests
          requests={dangerousRequests}
          {...mockProps}
        />
      );
    }).not.toThrow();

    // Should show fallback content
    expect(screen.getByText('Unknown User')).toBeInTheDocument();
    expect(screen.getByAltText('Unknown User avatar')).toHaveAttribute('src', '/default-avatar.png');
  });

  test('CRITICAL: handles null image property without crashing', () => {
    const requestsWithNullImage = [
      {
        id: '2',
        sender: {
          id: 'user1',
          name: 'Test User',
          email: 'test@example.com',
          image: null, // This was causing crashes
        },
        createdAt: new Date(),
      }
    ];

    expect(() => {
      render(
        <FriendRequests
          requests={requestsWithNullImage}
          {...mockProps}
        />
      );
    }).not.toThrow();

    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByAltText('Test User avatar')).toHaveAttribute('src', '/default-avatar.png');
  });

  test('CRITICAL: handles completely missing sender object', () => {
    const requestsWithMissingSender = [
      {
        id: '3',
        // sender property completely missing
        createdAt: new Date(),
      }
    ] as Parameters<typeof FriendRequests>[0]['requests'];

    expect(() => {
      render(
        <FriendRequests
          requests={requestsWithMissingSender}
          {...mockProps}
        />
      );
    }).not.toThrow();

    expect(screen.getByText('Unknown User')).toBeInTheDocument();
  });

  test('Regression test: normal data still works correctly', () => {
    const normalRequests = [
      {
        id: '4',
        sender: {
          id: 'user2',
          name: 'John Doe',
          email: 'john@example.com',
          image: 'https://example.com/avatar.jpg',
        },
        message: 'Let\'s connect!',
        createdAt: new Date(),
      }
    ];

    render(
      <FriendRequests
        requests={normalRequests}
        {...mockProps}
      />
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText(/Let's connect!/)).toBeInTheDocument(); // Use regex to handle whitespace
    expect(screen.getByAltText('John Doe avatar')).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });
});
