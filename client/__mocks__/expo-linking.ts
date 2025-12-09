// Mock for expo-linking module
export const getInitialURL = jest.fn().mockResolvedValue(null);
export const addEventListener = jest.fn().mockReturnValue({ remove: jest.fn() });
export const createURL = jest.fn((path: string) => `client://${path}`);

export default {
  getInitialURL,
  addEventListener,
  createURL,
};
