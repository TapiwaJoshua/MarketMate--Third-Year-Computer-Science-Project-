import validate from "validate.js";

export const validateString = (id, value) => {
  const constraints = {
    presence: {
      allowEmpty: false,
    },
  };

  if (value !== "") {
    constraints.format = {
      pattern: ".+",
      flags: "i",
      message: "Value cannot be blank.",
    };
  }
  const validationResult = validate({ [id]: value }, { [id]: constraints });
  return validationResult && validationResult[id];
};

export const validateEmail = (id, value) => {
  const constraints = {
    presence: {
      allowEmpty: false,
    },
  };

  if (value !== "") {
    constraints.format = {
      pattern: ".+",
      flags: "i",
      message: "Email Address cannot be blank.",
    };
  }
  const validationResult = validate({ [id]: value }, { [id]: constraints });
  return validationResult && validationResult[id];
};

export const validateAddress = (id, value) => {
  const constraints = {
    presence: {
      allowEmpty: false,
      message: "Residential Address is required",
    },
    format: {
      pattern: /^[a-zA-Z0-9\s,'-]+$/,
      message:
        "Address should only contain alphanumeric characters, spaces, commas, hyphens, and apostrophes",
    },
    length: {
      minimum: 5,
      maximum: 100,
      message: "Address should be between 5 and 100 characters",
    },
  };

  const validationResult = validate({ [id]: value }, { [id]: constraints });
  return validationResult && validationResult[id];
};

export const validatePassword = (id, value) => {
  const constraints = {
    presence: {
      allowEmpty: false,
    },
  };

  if (value !== "") {
    constraints.length = {
      minimum: 6,
      message: "Must be at least 6 characters or more",
    };
  }
  const validationResult = validate({ [id]: value }, { [id]: constraints });
  return validationResult && validationResult[id];
};
