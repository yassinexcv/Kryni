export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Insufficient permissions' });
  }

  return next();
};

export const isAdmin = authorizeRoles('admin');
export const isAgency = authorizeRoles('agency');
export const isCustomer = authorizeRoles('customer');
