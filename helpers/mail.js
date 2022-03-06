import nodemailer from "nodemailer";

export const sendMail = async (to = "", subject = "", text = "") => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "instagramclonee@gmail.com",
      pass: "instagram_clone_1234",
    },
  });
  let mailOptions = {
    from: "instagramclonee@gmail.com",
    to: to,
    subject: subject,
    text: text,
  };

  return await transporter.sendMail(mailOptions);
};
