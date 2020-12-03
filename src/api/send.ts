import request from './request';

export async function sendEmail(email: string) {
  return request.call({
    url: `/public/send/email`,
    method: 'POST',
    data: {
      email,
    },
  });
}

export async function sendSMS(phone: string) {
  return request.call({
    url: `/public/send/sms`,
    method: 'POST',
    data: {
      phone,
    },
  });
}
