import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(
    to: string | string[],
    subject: string,
    template: string, // Path to the template file (e.g., './confirmation')
    context: Record<string, any>, // Data to be passed to the template
    from?: string, // Optional: override default sender
  ): Promise<void> {
    const sender = from || `\"${this.configService.get<string>('SMTP_FROM_NAME', 'Wove Platform')}\" <${this.configService.get<string>('SMTP_FROM_EMAIL', 'noreply@wove.com')}>`;
    try {
      await this.mailerService.sendMail({
        to,
        from: sender,
        subject,
        template, // Name of the template file without extension
        context, // Data to be passed to the template engine
      });
      this.logger.log(`Email sent successfully to ${to} with subject "${subject}"`);
    } catch (error) {
      this.logger.error(
        `Failed to send email to ${to} with subject "${subject}". Error: ${error.message}`,
        error.stack,
      );
      // Depending on the application's needs, you might want to throw the error
      // or handle it gracefully (e.g., queue for retry).
      throw error; // Re-throw for now, can be adjusted
    }
  }

  // Example of a more specific email sending method
  async sendPasswordResetEmail(email: string, token: string, name: string) {
    const resetLink = `${this.configService.get<string>('APP_URL')}/reset-password?token=${token}`;
    await this.sendEmail(
      email,
      'Password Reset Request',
      './password-reset', // Assumes a 'password-reset.hbs' template in the 'templates' folder
      {
        name,
        resetLink,
      },
    );
  }

  async sendVerificationEmail(email: string, token: string, name: string, type: 'EMAIL_VERIFICATION' | 'PARENTAL_CONSENT') {
    const verificationLink = `${this.configService.get<string>('APP_URL')}/verify-email/${token}?type=${type}`;
    const subject = type === 'PARENTAL_CONSENT' ? 'Parental Consent Required' : 'Verify Your Email Address';
    const templateName = type === 'PARENTAL_CONSENT' ? './parental-consent' : './email-verification';

    await this.sendEmail(
      email,
      subject,
      templateName, // e.g., './email-verification.hbs' or './parental-consent.hbs'
      {
        name,
        verificationLink,
        emailToVerify: email, // Useful for parental consent emails
      },
    );
  }
}