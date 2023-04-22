export const mailConfigs = {
  ethereal: {
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: process.env.ETHEREAL_EMAIL,
      pass: process.env.ETHEREAL_PASSWORD,
    },
  },
};
