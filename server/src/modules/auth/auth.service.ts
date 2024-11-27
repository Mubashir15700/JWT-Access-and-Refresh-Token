import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // Mock user data (replace with database in real apps)
  private users = [
    {
      username: 'admin',
      password: '$2b$10$0a7EfGCDdN9RHJ5PvDSyUOj44zDlhIPJ12pgld/zsvfe8RYY6sKkO',
      // password: 'password123',
    },
  ];

  // Mock refresh tokens (replace with database in real apps)
  private refreshTokens: { [key: string]: string } = {};

  async validateUser(username: string, password: string): Promise<any> {
    const user = this.users.find((user) => user.username === username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (await bcrypt.compare(password, user.password)) {
      return { username: user.username };
    }
    throw new UnauthorizedException('Invalid credentials');
  }

  async login(user: any) {
    const payload = { username: user.username };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1m' }); // Access token expires in 1 hour

    // Generate a refresh token
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' }); // Refresh token expires in 7 days

    // Store the refresh token (in-memory for now, use DB in real-world apps)
    this.refreshTokens[user.username] = refreshToken;

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify(refreshToken); // Verify the refresh token

      // Check if the refresh token exists in the stored tokens (mocked here)
      if (
        !this.refreshTokens[decoded.username] ||
        this.refreshTokens[decoded.username] !== refreshToken
      ) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Generate a new access token
      const newAccessToken = this.jwtService.sign(
        { username: decoded.username },
        { expiresIn: '1m' },
      );
      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
