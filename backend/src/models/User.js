import db from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword, verifyPassword, generateToken } from '../utils/authUtils.js';

// User model
export const User = {
  // Find user by email
  findByEmail: (email) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
  },

  // Find user by ID
  findById: (id) => {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT id, email, full_name, created_at, last_login_at FROM users WHERE id = ?',
        [id],
        (err, row) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
  },

  // Create a new user
  create: async (email, password, fullName) => {
    const id = uuidv4();
    const passwordHash = await hashPassword(password);

    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (id, email, password_hash, full_name) VALUES (?, ?, ?, ?)',
        [id, email, passwordHash, fullName],
        function(err) {
          if (err) {
            if (err.message.includes('UNIQUE constraint')) {
              reject(new Error('Email already registered'));
            } else {
              reject(err);
            }
          } else {
            resolve({ id, email, full_name: fullName });
          }
        }
      );
    });
  },

  // Verify user credentials and return token
  authenticate: async (email, password) => {
    const user = await User.findByEmail(email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await verifyPassword(password, user.password_hash);
    
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Update last login
    db.run(
      'UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    const token = generateToken(user.id, user.email);
    return {
      id: user.id,
      email: user.email,
      fullName: user.full_name,
      token
    };
  }
};

export default User;
