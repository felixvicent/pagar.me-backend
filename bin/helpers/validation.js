class ValidationContract {
  constructor() {
    this.errors = [];
  }

  isNotArrayEmpty(value, message) {
    if (!value && value.length === 0) {
      this.errors.push({ message });
    }
  }

  isTrue(value, message) {
    if (value) {
      this.errors.push({ message });
    }
  }

  isRequired(value, message) {
    if (!value || value.length <= 0) {
      this.errors.push({ message });
    }
  }

  isEmail(value, message) {
    const reg = new RegExp(/^\w+([-+,']\w+)*@\w+([-,]\w+)*\.\w+([-.]\w+)*$/);

    if (!reg.test(value)) {
      this.errors.push({ message });
    }
  }

  errors() {
    return this.errors;
  }

  isValid() {
    return this.errors.length === 0;
  }
}

module.exports = ValidationContract;
