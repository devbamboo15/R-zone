export const templateHtml = (orgName, programCode) => {
  return `
<table style="width: 100%;">
  <tbody>
    <tr>
        <td>
            <table style="width: 100%; background: rgb(248, 252, 254);">
              <tbody>
                <tr>
                    <td>
                        <table style="width: 690px; margin: 0px auto;text-align: justify;">
                          <tbody>
                            <tr>
                                <td style="font-size: 16px; font-weight: 500; color: rgb(0, 0, 0); line-height: 206%; padding-bottom: 20px;">Dear Friend,</td>
                            </tr>
                            <tr>
                                <td style="font-size: 15px; line-height: 35px; padding-bottom: 20px;">We are committed to helping every child become a proficient reader at ${orgName}.</td>
                            </tr>
                            <tr>
                                <td style="font-size: 15px; line-height: 35px; padding-bottom: 20px;">We’re excited to begin using a web-based system for our reading programs called Reader Zone.</td>
                            </tr>
                            <tr>
                                <td style="font-size: 15px; line-height: 35px; padding-bottom: 20px;">This means no more paper reading calendars to fill out! You can use our mobile app to log reading and see how you're doing with reading goals in real time.</td>
                            </tr>
                            <tr>
                                <td style="font-size: 15px; line-height: 35px; padding-bottom: 20px;">The link in this email will go directly to our reading program. For future reference, our unique reading program code is: <span style="color: #FFC315; font-weight: bold; font-size: 30px;">${programCode}</span></td>
                            </tr>
                            <tr>
                                <td style="font-size: 15px; line-height: 35px; padding-bottom: 20px;">We hope that using Reader Zone will simplify our reading programs and help our readers succeed.</td>
                            </tr>
                            <tr>
                                <td style="font-size: 15px; line-height: 35px; padding-bottom: 20px;">Please email us with questions. If you need help with your Reader Zone account, please email <a href="mailto:help@readerzone.com">help@readerzone.com</a>.</td>
                            </tr>
                            <tr>
                                <td style="font-size: 20px; padding-bottom: 10px;">Happy Reading!</td>
                            </tr>
                            <tr>
                                <td style="font-size: 18px; padding-bottom: 20px;">${orgName}</td>
                            </tr>
                          </tbody>
                        </table>
                    </td>
                </tr>
              </tbody>
            </table>
        </td>
    </tr>
  </tbody>
</table>
`;
};
