const userRoles = {
    SUPER_ADMIN: 'Super Admin',
    ADMIN: 'Admin',
    LANDLORD: 'Landlord',
    BROKER: 'Broker',
    RENTER: 'Renter'
  };
  
  // Define permissions for each role
  const permissions = {
    SUPER_ADMIN: {
      createAccount: true,
      updateAccount: true,
      deleteAccount: true,
      blockUser: true,
      unblockUser: true,
      // Add more permissions as needed
    },
    ADMIN: {
      createAccount: true,
      updateAccount: true,
      deleteAccount: true,
      blockUser: true,
      unblockUser: true,
      // Add more permissions as needed
    },
    LANDLORD: {
      listProperties: true,
      editProperties: true,
      deleteProperties: true,
      manageRequests: true,
      // Add more permissions as needed
    },
    BROKER: {
      listProperties: true,
      manageRequests: true,
      // Add more permissions as needed
    },
    RENTER: {
      searchProperties: true,
      viewPropertyDetails: true,
      initiateRequest: true,
      manageProfile: true,
      viewHistory: true,
      // Add more permissions as needed
    }
  }; 
  
  module.exports = {
    permissions,
    userRoles
  };
  