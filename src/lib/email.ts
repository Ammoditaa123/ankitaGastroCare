import nodemailer from 'nodemailer';
import { Booking, Contact } from './db';

// Helper to create the transport connection
function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    // If not configured, we print a warning and return null (we'll log to console instead of crashing)
    console.warn("⚠️ Nodemailer Warning: GMAIL_USER or GMAIL_APP_PASSWORD not found in environment variables. Email notifications will be logged to the console.");
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

const clinicEmail = process.env.CLINIC_RECEIVER_EMAIL || 'care@ankitagastrocare.com';

export async function sendBookingConfirmation(booking: Booking): Promise<void> {
  const transporter = getTransporter();
  const subject = `Booking Request Received - Ankita Gastro Care`;
  
  const htmlContent = `
    <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1c2b30; line-height: 1.6;">
      <div style="background-color: #0e4b43; color: #f7f4ee; padding: 24px; text-align: center;">
        <h2 style="margin: 0; font-family: Georgia, serif;">Ankita Gastro Care</h2>
        <p style="margin: 4px 0 0 0; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase;">Appointment Request Received</p>
      </div>
      <div style="padding: 24px; background-color: #f7f4ee; border: 1px solid rgba(27,27,25,0.12); border-top: none;">
        <p>Dear <strong>${booking.name}</strong>,</p>
        <p>Thank you for requesting an appointment at Ankita Gastro Care. We have received your request, and our reception team will contact you shortly to confirm your booking.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #fff; border: 1px solid rgba(27,27,25,0.08);">
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid rgba(27,27,25,0.08); font-weight: bold; width: 140px;">Patient Name</td>
            <td style="padding: 12px; border-bottom: 1px solid rgba(27,27,25,0.08);">${booking.name}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid rgba(27,27,25,0.08); font-weight: bold;">Phone Number</td>
            <td style="padding: 12px; border-bottom: 1px solid rgba(27,27,25,0.08);">${booking.phone}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid rgba(27,27,25,0.08); font-weight: bold;">Preferred Date</td>
            <td style="padding: 12px; border-bottom: 1px solid rgba(27,27,25,0.08);">${booking.date}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid rgba(27,27,25,0.08); font-weight: bold;">Preferred Time</td>
            <td style="padding: 12px; border-bottom: 1px solid rgba(27,27,25,0.08);">${booking.time}</td>
          </tr>
          <tr>
            <td style="padding: 12px; border-bottom: 1px solid rgba(27,27,25,0.08); font-weight: bold;">Reason for Visit</td>
            <td style="padding: 12px; border-bottom: 1px solid rgba(27,27,25,0.08);">${booking.reason}</td>
          </tr>
          ${booking.notes ? `
          <tr>
            <td style="padding: 12px; font-weight: bold;">Additional Notes</td>
            <td style="padding: 12px; font-style: italic;">"${booking.notes}"</td>
          </tr>
          ` : ''}
        </table>

        <div style="background-color: #efe9dd; padding: 16px; margin-top: 24px; font-size: 13px;">
          <h4 style="margin: 0 0 6px 0; color: #093530; font-family: Georgia, serif;">Clinic Location</h4>
          <p style="margin: 0; color: #5a5a54;">
            Talli Bamori, Lal Danth Bypass Rd, near Nainital Bank, Amrawati Colony, Haldwani, Uttarakhand 263139
            <br />Reception Phone: 09962076595
          </p>
        </div>
      </div>
      <div style="text-align: center; padding: 16px; font-size: 11px; color: #888;">
        This is an automated confirmation email. Please do not reply directly to this message.
      </div>
    </div>
  `;

  if (transporter && booking.email) {
    try {
      await transporter.sendMail({
        from: `"Ankita Gastro Care" <${process.env.GMAIL_USER}>`,
        to: booking.email,
        subject,
        html: htmlContent,
      });
      console.log(`✉️ Booking confirmation email sent to patient: ${booking.email}`);
    } catch (error) {
      console.error("❌ Error sending booking confirmation email:", error);
    }
  } else {
    console.log(`[Email Simulation] Patient Confirmation Email:\nTo: ${booking.email || 'N/A'}\nSubject: ${subject}\nBody:\n${htmlContent.replace(/<[^>]*>/g, '')}`);
  }
}

export async function sendBookingAlert(booking: Booking): Promise<void> {
  const transporter = getTransporter();
  const subject = `🚨 NEW Booking Request: ${booking.name} (${booking.date})`;
  
  // Highlight veteran status in notes
  const isVeteran = booking.notes.toLowerCase().includes('vet') || booking.notes.toLowerCase().includes('soldier') || booking.notes.toLowerCase().includes('army');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h3 style="background-color: #bd5e2c; color: #fff; padding: 15px; margin: 0; text-align: center;">New Appointment Alert</h3>
      <div style="padding: 20px; border: 1px solid #ddd; border-top: none; background-color: #fcfbfa;">
        <p>A new appointment has been requested online. Please verify scheduling and contact the patient to confirm.</p>
        
        ${isVeteran ? `
        <div style="background-color: #a23a2e; color: #fff; padding: 12px; font-weight: bold; margin-bottom: 15px; border-radius: 2px;">
          🎖️ VETERAN DISCOUNT DETECTED - Please apply veteran concession on visit!
        </div>
        ` : ''}

        <ul style="list-style: none; padding: 0;">
          <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Patient Name:</strong> ${booking.name}</li>
          <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone Number:</strong> ${booking.phone}</li>
          <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong> ${booking.email || 'None'}</li>
          <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Date Requested:</strong> ${booking.date}</li>
          <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Time Slot:</strong> ${booking.time}</li>
          <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Reason:</strong> ${booking.reason}</li>
          <li style="padding: 8px 0;"><strong>Notes:</strong> ${booking.notes || 'None'}</li>
        </ul>
        <p style="margin-top: 25px;"><a href="tel:${booking.phone}" style="display: inline-block; padding: 10px 20px; background-color: #0e4b43; color: #fff; text-decoration: none; font-weight: bold; border-radius: 3px;">Call Patient Now</a></p>
      </div>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Ankita Clinic Web Portal" <${process.env.GMAIL_USER}>`,
        to: clinicEmail,
        subject,
        html: htmlContent,
      });
      console.log(`✉️ Booking alert email sent to clinic reception: ${clinicEmail}`);
    } catch (error) {
      console.error("❌ Error sending booking alert email to clinic:", error);
    }
  } else {
    console.log(`[Email Simulation] Clinic Notification Alert:\nTo: ${clinicEmail}\nSubject: ${subject}\nBody:\n${htmlContent.replace(/<[^>]*>/g, '')}`);
  }
}

export async function sendBookingCancellation(booking: Booking): Promise<void> {
  const transporter = getTransporter();
  const subject = `Appointment CANCELLED - ${booking.name} (${booking.date})`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h3 style="background-color: #a23a2e; color: #fff; padding: 15px; margin: 0; text-align: center;">Appointment Cancelled</h3>
      <div style="padding: 20px; border: 1px solid #ddd; border-top: none; background-color: #fefcfc;">
        <p>An appointment request has been cancelled by the user.</p>
        <ul style="list-style: none; padding: 0;">
          <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Patient Name:</strong> ${booking.name}</li>
          <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone Number:</strong> ${booking.phone}</li>
          <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Date:</strong> ${booking.date}</li>
          <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Time Slot:</strong> ${booking.time}</li>
          <li style="padding: 8px 0;"><strong>Reason:</strong> ${booking.reason}</li>
        </ul>
      </div>
    </div>
  `;

  // Send to clinic
  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Ankita Clinic Web Portal" <${process.env.GMAIL_USER}>`,
        to: clinicEmail,
        subject,
        html: htmlContent,
      });
      
      // Also send copy to patient if email exists
      if (booking.email) {
        await transporter.sendMail({
          from: `"Ankita Gastro Care" <${process.env.GMAIL_USER}>`,
          to: booking.email,
          subject: `Cancellation Confirmation - Ankita Gastro Care`,
          html: htmlContent.replace('cancelled by the user.', 'cancelled. If this was a mistake, please book a new slot on our site.'),
        });
      }
      console.log(`✉️ Cancellation alert emails sent.`);
    } catch (error) {
      console.error("❌ Error sending cancellation alert emails:", error);
    }
  } else {
    console.log(`[Email Simulation] Cancellation Alert:\nTo: ${clinicEmail} & ${booking.email || 'N/A'}\nSubject: ${subject}\nBody:\n${htmlContent.replace(/<[^>]*>/g, '')}`);
  }
}

export async function sendContactAlert(contact: Contact): Promise<void> {
  const transporter = getTransporter();
  const subject = `📬 New Clinic Inquiry from ${contact.name}`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
      <h3 style="background-color: #0e4b43; color: #fff; padding: 15px; margin: 0; text-align: center;">New Website Message</h3>
      <div style="padding: 20px; border: 1px solid #ddd; border-top: none; background-color: #f7f9f9;">
        <p>You have received a new contact message from the clinic website contact page:</p>
        <ul style="list-style: none; padding: 0;">
          <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong> ${contact.name}</li>
          <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong> ${contact.email}</li>
          <li style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone:</strong> ${contact.phone || 'None'}</li>
        </ul>
        <div style="background-color: #fff; border: 1px solid #eee; padding: 15px; margin-top: 15px; font-style: italic;">
          "${contact.message}"
        </div>
      </div>
    </div>
  `;

  if (transporter) {
    try {
      await transporter.sendMail({
        from: `"Ankita Clinic Web Portal" <${process.env.GMAIL_USER}>`,
        to: clinicEmail,
        subject,
        html: htmlContent,
      });
      console.log(`✉️ Contact message alert sent to clinic reception: ${clinicEmail}`);
    } catch (error) {
      console.error("❌ Error sending contact message alert:", error);
    }
  } else {
    console.log(`[Email Simulation] Contact Inquiry Alert:\nTo: ${clinicEmail}\nSubject: ${subject}\nBody:\n${htmlContent.replace(/<[^>]*>/g, '')}`);
  }
}

export async function sendRescheduleProposal(booking: Booking): Promise<void> {
  const transporter = getTransporter();
  const subject = `Reschedule Suggestion - Ankita Gastro Care`;
  const baseUrl = process.env.APP_URL || 'http://localhost:3000';
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
      <div style="background-color: #0e4b43; color: #fff; padding: 20px; text-align: center;">
        <h2 style="margin: 0; font-family: Georgia, serif;">Ankita Gastro Care</h2>
        <p style="margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Appointment Reschedule Suggestion</p>
      </div>
      <div style="padding: 24px; border: 1px solid #ddd; border-top: none; background-color: #fcfbfa;">
        <p>Dear <strong>${booking.name}</strong>,</p>
        <p>Dr. (Major) Ajay Kandpal has reviewed your appointment request. The requested slot was unavailable, and we have proposed a new slot for your visit:</p>
        
        <div style="background-color: #efe9dd; padding: 18px; text-align: center; border-radius: 2px; margin: 20px 0; border: 1px solid rgba(27,27,25,0.08);">
          <span style="font-size: 11px; text-transform: uppercase; tracking-wider; font-weight: bold; color: #bd5e2c;">Proposed Appointment Time</span>
          <h3 style="margin: 8px 0; font-size: 20px; color: #093530; font-family: Georgia, serif;">${booking.date} at ${booking.time}</h3>
          <p style="margin: 0; font-size: 13px; color: #5a5a54;">Reason: ${booking.reason}</p>
        </div>

        <p>Please respond to this rescheduling proposal by clicking one of the buttons below:</p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${baseUrl}/api/appointments/action?id=${booking.id}&action=accept" style="display: inline-block; padding: 12px 24px; background-color: #0e4b43; color: #fff; text-decoration: none; font-weight: bold; font-size: 13px; border-radius: 2px;">Accept New Time</a>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <a href="${baseUrl}/api/appointments/action?id=${booking.id}&action=decline" style="display: inline-block; padding: 12px 24px; background-color: #a23a2e; color: #fff; text-decoration: none; font-weight: bold; font-size: 13px; border-radius: 2px;">Decline &amp; Cancel</a>
        </div>

        <p style="font-size: 12px; color: #666; font-style: italic;">Note: If you decline, your appointment request will be cancelled and the slot will be released.</p>
      </div>
    </div>
  `;

  if (transporter && booking.email) {
    try {
      await transporter.sendMail({
        from: `"Ankita Gastro Care" <${process.env.GMAIL_USER}>`,
        to: booking.email,
        subject,
        html: htmlContent,
      });
      console.log(`✉️ Reschedule proposal email sent to patient: ${booking.email}`);
    } catch (error) {
      console.error("❌ Error sending reschedule proposal email:", error);
    }
  } else {
    console.log(`[Email Simulation] Patient Reschedule Proposal:\nTo: ${booking.email || 'N/A'}\nSubject: ${subject}\nBody:\n${htmlContent.replace(/<[^>]*>/g, '')}`);
  }
}

export async function sendBookingFinalConfirmation(booking: Booking): Promise<void> {
  const transporter = getTransporter();
  const subject = `Appointment CONFIRMED - Ankita Gastro Care`;
  
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; line-height: 1.6;">
      <div style="background-color: #0e4b43; color: #fff; padding: 20px; text-align: center;">
        <h2 style="margin: 0; font-family: Georgia, serif;">Ankita Gastro Care</h2>
        <p style="margin: 5px 0 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Appointment Confirmed</p>
      </div>
      <div style="padding: 24px; border: 1px solid #ddd; border-top: none; background-color: #f7f9f7;">
        <div style="background-color: #3e7a52; color: #fff; padding: 12px; font-weight: bold; text-align: center; margin-bottom: 20px; border-radius: 2px;">
          ✓ YOUR APPOINTMENT IS CONFIRMED!
        </div>
        <p>Dear <strong>${booking.name}</strong>,</p>
        <p>We are pleased to confirm your appointment at Ankita Gastro Care. Your slot is officially reserved.</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #fff; border: 1px solid #eee;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Date</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${booking.date}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Confirmed Time</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${booking.time}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Reason</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${booking.reason}</td>
          </tr>
        </table>

        <div style="background-color: #efe9dd; padding: 16px; font-size: 13px;">
          <h4 style="margin: 0 0 6px 0; color: #093530; font-family: Georgia, serif;">Preparation Instructions</h4>
          <p style="margin: 0; color: #5a5a54;">
            • If you are scheduled for an <strong>OGD Scopy (Endoscopy)</strong> or <strong>Colonoscopy</strong>, please remain empty-stomach (fasting) for at least 8 hours prior to your visit.
            <br />• Veterans, please bring your service credentials for the concession.
            <br />• If you need to reschedule or cancel, please call clinic reception at 09962076595.
          </p>
        </div>
      </div>
    </div>
  `;

  if (transporter && booking.email) {
    try {
      await transporter.sendMail({
        from: `"Ankita Gastro Care" <${process.env.GMAIL_USER}>`,
        to: booking.email,
        subject,
        html: htmlContent,
      });
      console.log(`✉️ Final confirmation email sent to patient: ${booking.email}`);
    } catch (error) {
      console.error("❌ Error sending final confirmation email:", error);
    }
  } else {
    console.log(`[Email Simulation] Patient Final Confirmation:\nTo: ${booking.email || 'N/A'}\nSubject: ${subject}\nBody:\n${htmlContent.replace(/<[^>]*>/g, '')}`);
  }
}
