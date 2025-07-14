const jwt = require('jsonwebtoken');
const authMiddleware = require('../../middleware/authMiddleware');

// Mock JWT
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {},
      user: null
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('authenticateToken', () => {
    it('should call next() when valid token is provided', () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      const mockToken = 'valid.token.here';

      mockReq.headers.authorization = `Bearer ${mockToken}`;
      jwt.verify.mockReturnValue(mockUser);

      authMiddleware.authenticateToken(mockReq, mockRes, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(mockToken, process.env.JWT_SECRET);
      expect(mockReq.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 401 when no token is provided', () => {
      authMiddleware.authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: 'Access token required' 
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when token format is invalid', () => {
      mockReq.headers.authorization = 'InvalidFormat token';

      authMiddleware.authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: 'Invalid token format' 
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when token is invalid', () => {
      const mockToken = 'invalid.token.here';
      mockReq.headers.authorization = `Bearer ${mockToken}`;
      
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      authMiddleware.authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: 'Invalid token' 
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('authorizeRoles', () => {
    it('should call next() when user has required role', () => {
      const requiredRoles = ['admin', 'doctor'];
      mockReq.user = { role: 'doctor' };

      const authorizeDoctor = authMiddleware.authorizeRoles(requiredRoles);
      authorizeDoctor(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    it('should return 403 when user lacks required role', () => {
      const requiredRoles = ['admin'];
      mockReq.user = { role: 'nurse' };

      const authorizeAdmin = authMiddleware.authorizeRoles(requiredRoles);
      authorizeAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: 'Insufficient permissions' 
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when user is not authenticated', () => {
      const requiredRoles = ['admin'];
      mockReq.user = null;

      const authorizeAdmin = authMiddleware.authorizeRoles(requiredRoles);
      authorizeAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({ 
        message: 'Authentication required' 
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
}); 