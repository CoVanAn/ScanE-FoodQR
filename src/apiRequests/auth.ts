import http from '@/lib/http'
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType
} from '@/schemaValidations/auth.schema'

const authApiRequest = {
  refreshTokenRequest: null as Promise<{
    status: number
    payload: RefreshTokenResType
  }> | null,
  //Gửi yêu cầu đăng nhập đến endpoint /auth/login (endpoint của server backend).
  sLogin: (body: LoginBodyType) => http.post<LoginResType>('/auth/login', body),
  //Gửi yêu cầu đăng nhập đến endpoint /api/auth/login (route handler trong ứng dụng Next.js).
  login: (body: LoginBodyType) =>
    http.post<LoginResType>('/api/auth/login', body, {
      baseUrl: ''
    }),
  //Gửi yêu cầu đăng xuất đến endpoint /auth/logout (endpoint của server backend).
  //Cần truyền accessToken và refreshToken vào body để xác thực yêu cầu.
  sLogout: (
    body: LogoutBodyType & {
      accessToken: string
    }
  ) =>
    http.post(
      '/auth/logout',
      {
        refreshToken: body.refreshToken
      },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`
        }
      }
    ),
  //Gửi yêu cầu đăng xuất đến endpoint /api/auth/logout (route handler trong ứng dụng Next.js).
  //Không cần truyền accessToken và refreshToken vào body vì chúng sẽ tự động được gửi qua cookie.
  logout: () => http.post('/api/auth/logout', null, { baseUrl: '' }), // client gọi đến route handler, không cần truyền AT và RT vào body vì AT và RT tự  động gửi thông qua cookie rồi
  //Gửi yêu cầu làm mới token đến endpoint /auth/refresh-token (endpoint của server backend).
  //Cần truyền refreshToken vào body để xác thực yêu cầu.
  //Nếu yêu cầu thành công, server sẽ trả về accessToken và refreshToken mới.
  sRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>('/auth/refresh-token', body),
  async refreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest
    }
    this.refreshTokenRequest = http.post<RefreshTokenResType>(
      '/api/auth/refresh-token',
      null,
      {
        baseUrl: ''
      }
    )
    const result = await this.refreshTokenRequest
    this.refreshTokenRequest = null
    return result
  }
}

export default authApiRequest
