export const mailConfigs = {
  ethereal: {
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: process.env.ACC_EMAIL,
      pass: process.env.ACC_PASSWORD,
    },
  },
};
