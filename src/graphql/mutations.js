/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPaymentIntent = /* GraphQL */ `
  mutation CreatePaymentIntent(
    $amount: Int!
    $email: String!
    $jobID: String!
  ) {
    createPaymentIntent(amount: $amount, email: $email, jobID: $jobID) {
      clientSecret
    }
  }
`;
export const createJob = /* GraphQL */ `
  mutation CreateJob(
    $input: CreateJobInput!
    $condition: ModelJobConditionInput
  ) {
    createJob(input: $input, condition: $condition) {
      id
      jobTitle
      jobDescription
      address
      city
      zipCode
      duration
      requestDateTime
      backupProviders
      checkInTime
      checkOutTime
      currentStatus
      mainProvider
      requestOwner
      paymentID
      price
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateJob = /* GraphQL */ `
  mutation UpdateJob(
    $input: UpdateJobInput!
    $condition: ModelJobConditionInput
  ) {
    updateJob(input: $input, condition: $condition) {
      id
      jobTitle
      jobDescription
      address
      city
      zipCode
      duration
      requestDateTime
      backupProviders
      checkInTime
      checkOutTime
      currentStatus
      mainProvider
      requestOwner
      paymentID
      price
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteJob = /* GraphQL */ `
  mutation DeleteJob(
    $input: DeleteJobInput!
    $condition: ModelJobConditionInput
  ) {
    deleteJob(input: $input, condition: $condition) {
      id
      jobTitle
      jobDescription
      address
      city
      zipCode
      duration
      requestDateTime
      backupProviders
      checkInTime
      checkOutTime
      currentStatus
      mainProvider
      requestOwner
      paymentID
      price
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const createProvider = /* GraphQL */ `
  mutation CreateProvider(
    $input: CreateProviderInput!
    $condition: ModelProviderConditionInput
  ) {
    createProvider(input: $input, condition: $condition) {
      id
      subID
      firstName
      lastName
      email
      phoneNumber
      dateOfBirth
      address
      city
      zipCode
      biography
      profilePictureURL
      backgroundCheckStatus
      employeeID
      offenses
      overallRating
      jobs {
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateProvider = /* GraphQL */ `
  mutation UpdateProvider(
    $input: UpdateProviderInput!
    $condition: ModelProviderConditionInput
  ) {
    updateProvider(input: $input, condition: $condition) {
      id
      subID
      firstName
      lastName
      email
      phoneNumber
      dateOfBirth
      address
      city
      zipCode
      biography
      profilePictureURL
      backgroundCheckStatus
      employeeID
      offenses
      overallRating
      jobs {
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteProvider = /* GraphQL */ `
  mutation DeleteProvider(
    $input: DeleteProviderInput!
    $condition: ModelProviderConditionInput
  ) {
    deleteProvider(input: $input, condition: $condition) {
      id
      subID
      firstName
      lastName
      email
      phoneNumber
      dateOfBirth
      address
      city
      zipCode
      biography
      profilePictureURL
      backgroundCheckStatus
      employeeID
      offenses
      overallRating
      jobs {
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const createUser = /* GraphQL */ `
  mutation CreateUser(
    $input: CreateUserInput!
    $condition: ModelUserConditionInput
  ) {
    createUser(input: $input, condition: $condition) {
      id
      subID
      firstName
      lastName
      email
      phoneNumber
      dateOfBirth
      address
      jobs {
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const updateUser = /* GraphQL */ `
  mutation UpdateUser(
    $input: UpdateUserInput!
    $condition: ModelUserConditionInput
  ) {
    updateUser(input: $input, condition: $condition) {
      id
      subID
      firstName
      lastName
      email
      phoneNumber
      dateOfBirth
      address
      jobs {
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser(
    $input: DeleteUserInput!
    $condition: ModelUserConditionInput
  ) {
    deleteUser(input: $input, condition: $condition) {
      id
      subID
      firstName
      lastName
      email
      phoneNumber
      dateOfBirth
      address
      jobs {
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;