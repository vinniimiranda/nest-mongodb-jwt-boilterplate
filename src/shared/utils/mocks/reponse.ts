import { Response } from 'express';
const mockResponse = {
  status: (statusCode: number) => {
    const json = (data: any) => {
      return data;
    };
    return { statusCode, json };
  },
};
export default (mockResponse as unknown) as Response;
