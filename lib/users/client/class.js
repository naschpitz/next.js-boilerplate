import EmailValidator from 'email-validator';
import PasswordValidator from 'password-validator';

export default class UsersClient {
  static validateEmail(email) {
    return EmailValidator.validate(email);
  }

  static validatePassword(password) {
    const schema = new PasswordValidator();

    schema.is().min(8)           // Minimum length 8
          .has().uppercase()     // Must have uppercase letters
          .has().lowercase()     // Must have lowercase letters
          .has().digits()        // Must have digits
          .has().symbols()       // Must have symbols
          .has().not().spaces(); // Should not have spaces

    return schema.validate(password);
  }
}