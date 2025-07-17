import { jest } from '@jest/globals';
import { errorHandler } from '../../src/middlewares/errorHandler.js';
import AppError from '../../src/utils/errors.js';
import { ZodError } from 'zod';

describe('errorHandler middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
    
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('AppError handling', () => {
    it('should handle AppError with correct status and message', () => {
      const appError = new AppError('Test error message', 404);

      errorHandler(appError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Test error message'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle AppError with different status codes', () => {
      const appError = new AppError('Unauthorized access', 401);

      errorHandler(appError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Unauthorized access'
      });
    });

    it('should handle AppError with 400 status code', () => {
      const appError = new AppError('Bad request', 400);

      errorHandler(appError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Bad request'
      });
    });
  });

  describe('ZodError handling', () => {
    it('should handle ZodError with validation details', () => {
      const zodError = new ZodError([
        {
          message: 'Required field missing',
          path: ['name'],
          code: 'invalid_type'
        },
        {
          message: 'Invalid email format',
          path: ['user', 'email'],
          code: 'invalid_string'
        }
      ]);

      errorHandler(zodError, req, res, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Validation échouée.',
        details: [
          {
            message: 'Required field missing',
            path: 'name'
          },
          {
            message: 'Invalid email format',
            path: 'user.email'
          }
        ]
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Generic error handling', () => {
    it('should handle generic Error with 500 status', () => {
      const genericError = new Error('Database connection failed');

      errorHandler(genericError, req, res, next);

      expect(console.error).toHaveBeenCalledWith(genericError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Erreur serveur interne.'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('Response object behavior', () => {
    it('should not call next() for any error type', () => {
      const errors = [
        new AppError('App error', 400),
        new ZodError([{ message: 'Validation error', path: ['field'], code: 'invalid' }]),
        new Error('Generic error')
      ];

      errors.forEach(error => {
        next.mockClear();
        errorHandler(error, req, res, next);
        expect(next).not.toHaveBeenCalled();
      });
    });
  });
});
