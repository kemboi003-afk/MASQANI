import { authService } from "../services/auth.service.js";
import { cookieOptions, signAccessToken } from "../middleware/auth.js";

function sendSession(res, user, status = 200) {
  const accessToken = signAccessToken(user);
  res.cookie("access_token", accessToken, cookieOptions);
  res.status(status).json({ user, accessToken });
}

export const authController = {
  async register(req, res) {
    const user = await authService.register(req.validated.body);
    const otp = await authService.createOtp(user.id, "phone_verification");
    const accessToken = signAccessToken(user);

    res.cookie("access_token", accessToken, cookieOptions);
    res.status(201).json({
      user,
      accessToken,
      otp
    });
  },

  async login(req, res) {
    const user = await authService.login(req.validated.body);
    sendSession(res, user);
  },

  async googleAuth(req, res) {
    const user = await authService.googleAuth(req.validated.body);
    sendSession(res, user);
  },

  async me(req, res) {
    const user = await authService.findById(req.user.id);
    res.json({ user });
  },

  async requestOtp(req, res) {
    const otp = await authService.createOtp(req.user.id, req.validated.body.purpose);
    res.json({ message: "OTP sent", otp });
  },

  async verifyOtp(req, res) {
    await authService.verifyOtp(req.user.id, req.validated.body.purpose, req.validated.body.code);
    const user = await authService.findById(req.user.id);
    sendSession(res, user);
  },

  async forgotPassword(req, res) {
    await authService.requestPasswordReset(req.validated.body.email);
    res.json({ message: "If the email exists, reset instructions have been sent" });
  },

  async logout(req, res) {
    res.clearCookie("access_token", cookieOptions);
    res.json({ message: "Signed out" });
  }
};
